/**
 * Authentication Service
 * Handles user registration, login, and token management
 * @module services/authService
 */

import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { getPrismaClient } from '../config/database';
import { env } from '../config/env';
import { logger } from '../utils/logger';
import { BCRYPT_SALT_ROUNDS } from '../utils/constants';
import { RegisterInput, LoginInput, JwtPayload } from '../types';
import { AppError, ConflictError, NotFoundError } from '../middleware/errorHandler';

/**
 * Register a new user
 * @param input - Registration data
 * @returns Created user and JWT token
 */
export async function registerUser(input: RegisterInput) {
  const prisma = getPrismaClient();

  // Check for existing user
  const existingUser = await prisma.user.findFirst({
    where: {
      OR: [
        { email: input.email },
        ...(input.phone ? [{ phone: input.phone }] : []),
      ],
    },
  });

  if (existingUser) {
    throw new ConflictError('A user with this email or phone already exists');
  }

  // Hash password
  const passwordHash = await bcrypt.hash(input.password, BCRYPT_SALT_ROUNDS);

  // Create user
  const user = await prisma.user.create({
    data: {
      email: input.email,
      phone: input.phone,
      passwordHash,
      name: input.name,
      language: input.language || 'en',
      region: input.region,
      latitude: input.latitude,
      longitude: input.longitude,
      deviceId: input.deviceId,
    },
    select: {
      id: true,
      email: true,
      name: true,
      language: true,
      region: true,
      createdAt: true,
    },
  });

  // Generate JWT
  const token = generateToken({ userId: user.id, email: user.email });

  logger.info({ userId: user.id }, 'User registered successfully');

  return { user, token };
}

/**
 * Authenticate user with email and password
 * @param input - Login credentials
 * @returns User data and JWT token
 */
export async function loginUser(input: LoginInput) {
  const prisma = getPrismaClient();

  const user = await prisma.user.findUnique({
    where: { email: input.email },
    select: {
      id: true,
      email: true,
      name: true,
      passwordHash: true,
      language: true,
      region: true,
      deletedAt: true,
    },
  });

  if (!user || user.deletedAt) {
    throw new NotFoundError('User');
  }

  const isPasswordValid = await bcrypt.compare(input.password, user.passwordHash);

  if (!isPasswordValid) {
    throw new AppError('Invalid credentials', 401, 'INVALID_CREDENTIALS');
  }

  const token = generateToken({ userId: user.id, email: user.email });

  // Create session
  await prisma.session.create({
    data: {
      userId: user.id,
      token,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
      deviceId: input.deviceId,
    },
  });

  logger.info({ userId: user.id }, 'User logged in');

  const { passwordHash: _, ...userData } = user;
  return { user: userData, token };
}

/**
 * Generate JWT token
 */
function generateToken(payload: JwtPayload): string {
  return jwt.sign(payload, env.JWT_SECRET, {
    expiresIn: env.JWT_EXPIRES_IN as string,
  } as jwt.SignOptions);
}

# 🌾 Agricultural Advisory App

> Offline-capable mobile app for crop disease detection and agricultural advisory, built for smallholder farmers in Kashmir and South Asia.

**Cursor Hackathon 2026 Submission**

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- PostgreSQL 15+
- Redis 7+
- Expo CLI (`npm install -g expo-cli`)

### Backend Setup
```bash
cd backend
cp .env.example .env
# Edit .env with your database credentials
npm install
npx prisma generate
npx prisma db push
npm run dev
# Server starts on http://localhost:5000
```

### Mobile App Setup
```bash
cd mobile-app
cp .env.example .env
npm install
npx expo start
# Scan QR code with Expo Go app
```

---

## 📱 Features
- **Disease Detection**: Camera-based crop disease identification
- **Planting Guides**: Season-specific crop guidance
- **Market Prices**: Real-time price data for local markets
- **Offline Mode**: Full functionality without internet
- **Multilingual**: English, Urdu, Punjabi support

## 🏗️ Architecture
- **Frontend**: React Native + Expo, TypeScript, Redux Toolkit, SQLite
- **Backend**: Node.js + Express, TypeScript, Prisma ORM, PostgreSQL
- **Offline**: SQLite local storage + sync queue system

## 👥 Team
| Role | Focus Area |
|------|-----------|
| Frontend Dev | `/mobile-app/src/screens` + `/src/components` |
| Backend Dev | `/backend/src/controllers` + `/src/services` |
| Presenter/DevOps | `/docs` + deployment + demos |

## 📄 Documentation
- [Architecture Overview](./ARCHITECTURE.md)
- [API Documentation](./API_DOCUMENTATION.md)
- [Edge Cases](./EDGE_CASES_DOCUMENTATION.md)
- [File Manifest](./FILES_MANIFEST.md)

## 📜 License
MIT

/**
 * Error Boundary Component
 * Catches React rendering errors and displays fallback UI
 * @module components/ErrorBoundary
 */

import React, { Component, ErrorInfo, ReactNode } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

export default class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    // TODO: Log error to external service
    console.error('[ErrorBoundary]', error, errorInfo);
  }

  handleReset = (): void => {
    this.setState({ hasError: false, error: null });
  };

  render(): ReactNode {
    if (this.state.hasError) {
      return (
        <View style={styles.container}>
          <Text style={styles.icon}>⚠️</Text>
          <Text style={styles.title}>Something went wrong</Text>
          <Text style={styles.message}>
            {this.state.error?.message || 'An unexpected error occurred'}
          </Text>
          <TouchableOpacity style={styles.retryButton} onPress={this.handleReset}>
            <Text style={styles.retryText}>Try Again</Text>
          </TouchableOpacity>
        </View>
      );
    }

    return this.props.children;
  }
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 32, backgroundColor: '#FFF' },
  icon: { fontSize: 48, marginBottom: 16 },
  title: { fontSize: 22, fontWeight: 'bold', color: '#333', marginBottom: 8 },
  message: { fontSize: 14, color: '#666', textAlign: 'center', marginBottom: 24, lineHeight: 22 },
  retryButton: { backgroundColor: '#2E7D32', paddingHorizontal: 32, paddingVertical: 12, borderRadius: 8 },
  retryText: { color: '#FFF', fontSize: 16, fontWeight: '600' },
});

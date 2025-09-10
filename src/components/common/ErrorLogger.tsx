import React, { Component, ReactNode } from 'react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
  errorId?: string;
}

export class ErrorLogger extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error,
      errorId: Math.random().toString(36).substr(2, 9)
    };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Log error to production monitoring service
    console.error('Maritime System Error:', {
      error: error.message,
      stack: error.stack,
      componentStack: errorInfo.componentStack,
      errorId: this.state.errorId,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      url: window.location.href
    });

    // In production, send to monitoring service
    if (process.env.NODE_ENV === 'production') {
      // Send error to monitoring service
      this.logToMonitoringService(error, errorInfo);
    }
  }

  private logToMonitoringService(error: Error, errorInfo: React.ErrorInfo) {
    // Implementation for production error logging
    const errorData = {
      message: error.message,
      stack: error.stack,
      componentStack: errorInfo.componentStack,
      errorId: this.state.errorId,
      timestamp: new Date().toISOString(),
      severity: 'error',
      source: 'maritime-dashboard'
    };

    // Send to your monitoring service (Sentry, LogRocket, etc.)
    console.error('Production Error Log:', errorData);
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <Alert variant="destructive" className="m-4">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>System Error Detected</AlertTitle>
          <AlertDescription className="mt-2">
            <p>A critical error occurred in the maritime system.</p>
            <p className="text-xs mt-2 font-mono">
              Error ID: {this.state.errorId}
            </p>
            <Button
              variant="outline"
              size="sm"
              className="mt-3"
              onClick={() => window.location.reload()}
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Restart System
            </Button>
          </AlertDescription>
        </Alert>
      );
    }

    return this.props.children;
  }
}
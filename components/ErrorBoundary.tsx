"use client";

import React, { Component, ErrorInfo, ReactNode } from "react";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    this.setState({ errorInfo });
    
    // Auto-recover from hook errors by reloading
    if (error.message.includes("Rendered fewer hooks") || 
        error.message.includes("hooks") ||
        error.message.includes("early return")) {
      // Silently reload to fix hook issues
      if (typeof window !== "undefined") {
        setTimeout(() => {
          window.location.reload();
        }, 100);
        return;
      }
    }
    
    // Use setTimeout to avoid logging errors during render phase
    if (typeof window !== "undefined") {
      setTimeout(() => {
        try {
          console.error("ErrorBoundary caught an error:", error);
          if (errorInfo.componentStack) {
            console.error("Component stack:", errorInfo.componentStack);
          }
        } catch (logError) {
          // Silently fail if logging itself causes an error
        }
      }, 0);
    }
  }

  render() {
    if (this.state.hasError) {
      // Auto-recover from hook errors - don't show error UI, just reload
      if (this.state.error?.message.includes("Rendered fewer hooks") || 
          this.state.error?.message.includes("hooks") ||
          this.state.error?.message.includes("early return")) {
        // Return children and let componentDidCatch handle the reload
        return this.props.children;
      }

      if (this.props.fallback) {
        return this.props.fallback;
      }

      // Only show error UI for non-hook errors
      return (
        <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900 p-4">
          <div className="text-center p-8 max-w-2xl w-full">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Something went wrong
            </h1>
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 mb-6 text-left">
              <p className="text-red-800 dark:text-red-200 font-semibold mb-2">
                Error: {this.state.error?.message || "An unexpected error occurred"}
              </p>
              {this.state.error?.stack && (
                <details className="mt-2">
                  <summary className="text-sm text-red-700 dark:text-red-300 cursor-pointer">
                    Stack trace
                  </summary>
                  <pre className="text-xs text-red-600 dark:text-red-400 mt-2 overflow-auto max-h-40">
                    {this.state.error.stack}
                  </pre>
                </details>
              )}
              {this.state.errorInfo?.componentStack && (
                <details className="mt-2">
                  <summary className="text-sm text-red-700 dark:text-red-300 cursor-pointer">
                    Component stack
                  </summary>
                  <pre className="text-xs text-red-600 dark:text-red-400 mt-2 overflow-auto max-h-40">
                    {this.state.errorInfo.componentStack}
                  </pre>
                </details>
              )}
            </div>
            <div className="flex gap-4 justify-center">
              <button
                onClick={() => {
                  this.setState({ hasError: false, error: null, errorInfo: null });
                }}
                className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors"
              >
                Try Again
              </button>
              <button
                onClick={() => {
                  window.location.reload();
                }}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
              >
                Reload Page
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;


import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children?: ReactNode;
}

interface State {
  hasError: boolean;
  errorMsg: string;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    errorMsg: ''
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, errorMsg: error.message };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      let isFirestoreError = false;
      try {
        const parsed = JSON.parse(this.state.errorMsg);
        if (parsed && parsed.operationType) isFirestoreError = true;
      } catch (e) {}

      return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-[#F5F5F7] dark:bg-[#1E1E2E] text-gray-900 dark:text-gray-100 p-4 font-sans">
          <h1 className="text-2xl font-bold text-red-500 mb-4">Something went wrong</h1>
          <p className="mb-4 text-center max-w-lg">
            {isFirestoreError 
              ? "A database permission error occurred. Please check your account access or Firebase configuration."
              : "An unexpected error occurred in the application."}
          </p>
          <div className="bg-black/5 dark:bg-white/5 p-4 rounded-xl text-sm overflow-auto max-w-full font-mono text-gray-600 dark:text-gray-400">
            {this.state.errorMsg}
          </div>
          <button 
            className="mt-6 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-full transition-colors"
            onClick={() => window.location.reload()}
          >
            Reload Page
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

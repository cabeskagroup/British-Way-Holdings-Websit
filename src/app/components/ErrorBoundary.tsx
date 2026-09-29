import { Component, type ErrorInfo, type ReactNode } from "react";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
}

export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error("Page error:", error, info.componentStack);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex min-h-[70vh] flex-col items-center justify-center px-6 pb-20 pt-32 text-center">
          <span className="eyebrow">Unexpected error</span>
          <h1 className="mt-5 font-display text-3xl font-semibold text-white">Something went wrong</h1>
          <p className="mt-3 max-w-md text-mist">This page could not be loaded. Please refresh or return to the homepage.</p>
          <button onClick={() => window.location.assign(import.meta.env.BASE_URL)} className="btn-luxe mt-8">
            Go home
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

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
        <div
          className="min-h-[60vh] flex flex-col items-center justify-center px-6 pt-32 pb-20 text-center"
          style={{ fontFamily: "'Poppins', sans-serif", background: "#f5f9ff" }}
        >
          <h1 style={{ fontWeight: 700, fontSize: "1.5rem", color: "#1a2f4a", marginBottom: "12px" }}>
            Something went wrong
          </h1>
          <p style={{ fontFamily: "'Open Sans', sans-serif", fontSize: "0.95rem", color: "#5a7898", marginBottom: "24px", maxWidth: "420px" }}>
            This page could not be loaded. Please refresh or return to the homepage.
          </p>
          <button
            onClick={() => window.location.assign(import.meta.env.BASE_URL)}
            className="px-6 py-3 rounded-2xl font-semibold text-[14px] text-white"
            style={{ background: "linear-gradient(135deg, #4a80b4, #2a5a94)" }}
          >
            Go Home
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

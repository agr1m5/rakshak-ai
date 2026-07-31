import { Component } from "react";
import { AlertTriangle } from "lucide-react";

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { error: null };
  }

  static getDerivedStateFromError(error) {
    return { error };
  }

  componentDidCatch(error, info) {
    // eslint-disable-next-line no-console
    console.error("Caught by ErrorBoundary:", error, info);
  }

  render() {
    if (this.state.error) {
      return (
        <div className="flex flex-col items-center justify-center gap-3 p-10 text-center">
          <AlertTriangle size={22} className="text-severity-critical" strokeWidth={1.5} />
          <p className="text-sm text-ink-50">Something went wrong on this page.</p>
          <p className="text-xs text-ink-500 font-mono max-w-md">
            {this.state.error.message}
          </p>
          <button
            onClick={() => this.setState({ error: null })}
            className="text-xs text-sentinel-400 hover:text-sentinel-300"
          >
            Try again
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

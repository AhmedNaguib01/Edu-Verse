import React from "react";

/**
 * Error Boundary component to catch and handle React errors
 * Prevents entire app from crashing due to component errors
 */
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Error caught by boundary:", error, errorInfo);

    this.setState({
      error,
      errorInfo,
    });

    // Log to error reporting service (e.g., Sentry)
    if (process.env.NODE_ENV === "production") {
      // logErrorToService(error, errorInfo);
    }
  }

  handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div style={styles.container}>
          <div style={styles.content}>
            <h1 style={styles.title}>Oops! Something went wrong</h1>
            <p style={styles.message}>
              We're sorry for the inconvenience. The error has been logged and
              we'll look into it.
            </p>

            {process.env.NODE_ENV === "development" && this.state.error && (
              <details style={styles.details}>
                <summary style={styles.summary}>Error Details</summary>
                <pre style={styles.errorText}>
                  {this.state.error.toString()}
                  {this.state.errorInfo && this.state.errorInfo.componentStack}
                </pre>
              </details>
            )}

            <div style={styles.actions}>
              <button onClick={this.handleReset} style={styles.button}>
                Try Again
              </button>
              <button
                onClick={() => (window.location.href = "/")}
                style={{ ...styles.button, ...styles.secondaryButton }}
              >
                Go Home
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

const styles = {
  container: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    minHeight: "100vh",
    backgroundColor: "#f5f5f5",
    padding: "20px",
  },
  content: {
    maxWidth: "600px",
    backgroundColor: "white",
    borderRadius: "8px",
    padding: "40px",
    boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
    textAlign: "center",
  },
  title: {
    fontSize: "24px",
    fontWeight: "bold",
    color: "#333",
    marginBottom: "16px",
  },
  message: {
    fontSize: "16px",
    color: "#666",
    marginBottom: "24px",
    lineHeight: "1.5",
  },
  details: {
    textAlign: "left",
    marginBottom: "24px",
    backgroundColor: "#f9f9f9",
    padding: "16px",
    borderRadius: "4px",
    border: "1px solid #e0e0e0",
  },
  summary: {
    cursor: "pointer",
    fontWeight: "bold",
    marginBottom: "8px",
    color: "#666",
  },
  errorText: {
    fontSize: "12px",
    color: "#d32f2f",
    overflow: "auto",
    maxHeight: "200px",
  },
  actions: {
    display: "flex",
    gap: "12px",
    justifyContent: "center",
  },
  button: {
    padding: "12px 24px",
    fontSize: "16px",
    fontWeight: "500",
    borderRadius: "6px",
    border: "none",
    cursor: "pointer",
    backgroundColor: "#1976d2",
    color: "white",
    transition: "background-color 0.2s",
  },
  secondaryButton: {
    backgroundColor: "#757575",
  },
};

export default ErrorBoundary;

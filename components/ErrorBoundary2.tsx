import React, { ReactNode, useState, useEffect } from "react";

type FallbackComponentProps = {
  error: Error;
};

type ErrorBoundaryProps = {
  fallback: React.ComponentType<FallbackComponentProps>;
  children: ReactNode;
};

const ErrorBoundary: React.FC<ErrorBoundaryProps> = ({
  fallback: FallbackComponent,
  children,
}) => {
  const [hasError, setHasError] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    function errorHandler(event: ErrorEvent) {
      if (event.error.hasBeenCaught !== undefined) return;
      event.error.hasBeenCaught = true;

      setError(event.error);
      setHasError(true);
    }

    window.addEventListener("error", errorHandler);

    return () => {
      window.removeEventListener("error", errorHandler);
    };
  }, []);

  if (hasError) {
    return FallbackComponent ? (
      <FallbackComponent error={error as Error} />
    ) : null;
  }

  return <>{children}</>;
};

export default ErrorBoundary;

import type { FallbackProps } from "react-error-boundary";
import { ErrorMessage } from "./error-message";

export function Fallback({ resetErrorBoundary }: FallbackProps) {
  return (
    <ErrorMessage
      message="Unexpected error"
      onClick={() => resetErrorBoundary()}
    />
  );
}

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTriangleExclamation } from "@fortawesome/free-solid-svg-icons";

interface ErrorMessageProps {
  message?: string;
}

export function ErrorMessage({
  message = "Failed to load data. Is the API running?",
}: ErrorMessageProps) {
  return (
    <div className="flex items-center gap-2 rounded-md border border-red-500/30 bg-red-500/10 px-3 py-2 text-xs text-red-400">
      <FontAwesomeIcon icon={faTriangleExclamation} />
      <span>{message}</span>
    </div>
  );
}

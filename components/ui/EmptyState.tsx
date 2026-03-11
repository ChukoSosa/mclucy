import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faInbox } from "@fortawesome/free-solid-svg-icons";

interface EmptyStateProps {
  message?: string;
}

export function EmptyState({ message = "No data available" }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-2 py-8 text-slate-500">
      <FontAwesomeIcon icon={faInbox} className="text-2xl" />
      <p className="text-xs">{message}</p>
    </div>
  );
}

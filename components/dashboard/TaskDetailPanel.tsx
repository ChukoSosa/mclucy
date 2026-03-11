"use client";

import { useQuery } from "@tanstack/react-query";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faClock, faChevronDown } from "@fortawesome/free-solid-svg-icons";
import { getTasks, getTaskSubtasks } from "@/lib/api/tasks";
import { useDashboardStore } from "@/store/dashboardStore";
import { Card, StatusBadge, SkeletonList, EmptyState, ErrorMessage } from "@/components/ui";
import { fromNow } from "@/lib/utils/formatDate";
import { priorityLabel, priorityVariant } from "@/lib/utils/formatStatus";

export function TaskDetailPanel() {
  const selectedTaskId = useDashboardStore((s) => s.selectedTaskId);

  const { data: tasks = [] } = useQuery({ queryKey: ["tasks"], queryFn: getTasks });
  const selectedTask = tasks.find((t) => t.id === selectedTaskId);

  const {
    data: subtasks,
    isLoading: subtasksLoading,
    isError: subtasksError,
  } = useQuery({
    queryKey: ["subtasks", selectedTaskId],
    queryFn: () => getTaskSubtasks(selectedTaskId!),
    enabled: !!selectedTaskId,
  });

  return (
    <Card title="Task Detail" className="h-full">
      {!selectedTaskId && <EmptyState message="Select a task to see details and subtasks" />}

      {selectedTask && (
        <div className="space-y-4">
          {/* Task header */}
          <div className="space-y-2">
            <h2 className="text-sm font-semibold text-slate-100 leading-snug">{selectedTask.title}</h2>

            <div className="flex flex-wrap gap-1.5">
              <StatusBadge status={selectedTask.status} pulse={selectedTask.status === "IN_PROGRESS"} />
              {selectedTask.priority != null && (
                <StatusBadge
                  status={priorityLabel(selectedTask.priority)}
                  variant={priorityVariant(selectedTask.priority)}
                />
              )}
            </div>

            <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs">
              {selectedTask.assignedAgent && (
                <>
                  <span className="text-slate-500 flex items-center gap-1">
                    <FontAwesomeIcon icon={faUser} className="text-[10px]" />
                    Agent
                  </span>
                  <span className="text-slate-200">{selectedTask.assignedAgent.name}</span>
                </>
              )}
              {selectedTask.updatedAt && (
                <>
                  <span className="text-slate-500 flex items-center gap-1">
                    <FontAwesomeIcon icon={faClock} className="text-[10px]" />
                    Updated
                  </span>
                  <span className="text-slate-200">{fromNow(selectedTask.updatedAt)}</span>
                </>
              )}
              <span className="text-slate-500">ID</span>
              <span className="font-mono text-[10px] text-slate-400 truncate">{selectedTask.id}</span>
            </div>

            {selectedTask.description && (
              <p className="text-xs text-slate-400 rounded bg-surface-800 border border-surface-700 p-2">
                {selectedTask.description}
              </p>
            )}
          </div>

          {/* Subtasks */}
          <div>
            <div className="flex items-center gap-1.5 mb-2">
              <FontAwesomeIcon icon={faChevronDown} className="text-[10px] text-slate-500" />
              <span className="text-[10px] font-semibold uppercase tracking-widest text-slate-500">
                Subtasks {subtasks && `(${subtasks.length})`}
              </span>
            </div>

            {subtasksLoading && <SkeletonList rows={3} />}
            {subtasksError && <ErrorMessage message="Failed to load subtasks" />}
            {!subtasksLoading && !subtasksError && (!subtasks || subtasks.length === 0) && (
              <EmptyState message="No subtasks" />
            )}

            {subtasks && subtasks.length > 0 && (
              <div className="space-y-1.5">
                {subtasks.map((sub, idx) => (
                  <div
                    key={sub.id}
                    className="flex items-center gap-2 rounded border border-surface-700 bg-surface-800 px-3 py-2"
                  >
                    <span className="font-mono text-[10px] text-slate-600 w-4 shrink-0">
                      {sub.position ?? idx + 1}
                    </span>
                    <span className="text-xs text-slate-200 flex-1 min-w-0 truncate">{sub.title}</span>
                    {sub.ownerAgent && (
                      <span className="text-[10px] text-slate-500 truncate max-w-[80px]">
                        {sub.ownerAgent.name}
                      </span>
                    )}
                    <StatusBadge status={sub.status} />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </Card>
  );
}

import { HTMLAttributes, useCallback, useEffect, useState } from "react";
import { useTask, useTaskRoles } from "../hooks";

export function usePrefetchTaskDetailsOnHover(
  taskId: string | undefined
): Pick<HTMLAttributes<HTMLDivElement>, "onMouseEnter" | "onMouseLeave"> {
  const [prefetch, setPrefetch] = useState(false);
  const [hovering, setHovering] = useState(false);
  const onMouseEnter = useCallback(() => setHovering(true), []);
  const onMouseLeave = useCallback(() => setHovering(false), []);

  useEffect(() => {
    if (!hovering) return;
    const timeout = setTimeout(() => setPrefetch(true), 300);
    return () => clearTimeout(timeout);
  }, [hovering]);

  const { task } = useTask(prefetch ? taskId : undefined);
  useTaskRoles(task);

  return { onMouseEnter, onMouseLeave };
}

import { useDroppable } from "@dnd-kit/core";
import { ReactNode } from "react";

interface DroppableAreaProps {
  id: string;
  children: ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

export function DroppableArea({ id, children, className, style }: DroppableAreaProps) {
  const { setNodeRef, isOver } = useDroppable({
    id,
  });

  return (
    <div
      ref={setNodeRef}
      className={className}
      style={{
        ...style,
        opacity: isOver ? 0.8 : 1,
        transition: "opacity 0.2s ease",
      }}
    >
      {children}
    </div>
  );
}

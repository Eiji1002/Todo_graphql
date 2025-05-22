'use client';

import { useDraggable } from '@dnd-kit/core';
import SubTaskList from './SubTaskList';

export default function TaskCard({ task }: { task: any }) {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: task.id,
  });

  const style = {
    transform: transform
      ? `translate(${transform.x}px, ${transform.y}px)`
      : undefined,
  };

  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      style={style}
      className="bg-white border border-gray-300 p-4 rounded shadow mb-3 text-black"
    >
      <h3 className="font-semibold text-lg">{task.title}</h3>
      <SubTaskList subtasks={task.subtasks} />
    </div>
  );
}

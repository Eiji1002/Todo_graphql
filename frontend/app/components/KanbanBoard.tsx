'use client';

import { useQuery, useMutation } from '@apollo/client';
import { GET_PROJECT_TASKS } from '@/app/lib/graphql/queries';
import { CREATE_TASK, UPDATE_TASK_STATUS } from '@/app/lib/graphql/mutation';
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  useDroppable,
} from '@dnd-kit/core';
import {
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { createPortal } from 'react-dom';

const columns = ['todo', 'doing', 'done'];

const statusLabels: Record<string, string> = {
  todo: 'À faire',
  doing: 'En cours',
  done: 'Fait',
};

function SortableTask({ task }: { task: any }) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({
    id: task.id.toString(),
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="p-4 mb-4 bg-gray-200 rounded shadow cursor-move"
    >
      <h3 className="font-bold">{task.title}</h3>
      <p className="text-gray-600">{task.completed ? 'Complétée' : 'Non complétée'}</p>
    </div>
  );
}

function DroppableColumn({
  column,
  children,
}: {
  column: string;
  children: React.ReactNode;
}) {
  const { setNodeRef } = useDroppable({
    id: column,
  });

  return (
    <div ref={setNodeRef} className="flex-1 p-4 border rounded min-h-[300px]">
      <h2 className="text-xl font-bold mb-4">{statusLabels[column]}</h2>
      {children}
    </div>
  );
}

export default function KanbanBoard() {
  const searchParams = useSearchParams();
  const projectId = searchParams.get('projectId');

  const { data, loading, error } = useQuery(GET_PROJECT_TASKS, {
    variables: { projectId: parseInt(projectId!, 10) },
  });

  const [createTask] = useMutation(CREATE_TASK);
  const [updateTaskStatus] = useMutation(UPDATE_TASK_STATUS);
  const [title, setTitle] = useState('');
  const [showModal, setShowModal] = useState(false);

  const sensors = useSensors(useSensor(PointerSensor));

  if (!projectId) return <p>Project ID manquant dans l'URL</p>;
  if (loading) return <p>Chargement...</p>;
  if (error) return <p>Erreur: {error.message}</p>;

  const allTasks = data?.getProjectTasks || [];

  const groupedTasks = columns.reduce((acc, column) => {
    acc[column] = allTasks.filter((task) => task.status === column);
    return acc;
  }, {} as Record<string, any[]>);

  const handleDragEnd = async (event: any) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
  
    const activeTaskId = parseInt(active.id, 10);
    const overColumnId = over.id;
  
    console.log(`Moving task ${activeTaskId} to column ${overColumnId}`);
  
    try {
      const result = await updateTaskStatus({
        variables: {
          taskId: activeTaskId,
          status: overColumnId,
        },
        optimisticResponse: {
          updateTaskStatus: {
            __typename: 'Task',
            id: activeTaskId,
            status: overColumnId,
            // Ajoutez d'autres champs nécessaires ici
          },
        },
        update: (cache, { data }) => {
          console.log('Updating cache...');
          const updatedTask = data?.updateTaskStatus;
          const existingData = cache.readQuery<{ getProjectTasks: any[] }>({
            query: GET_PROJECT_TASKS,
            variables: { projectId: parseInt(projectId!, 10) },
          });
  
          if (existingData && updatedTask) {
            cache.writeQuery({
              query: GET_PROJECT_TASKS,
              variables: { projectId: parseInt(projectId!, 10) },
              data: {
                getProjectTasks: existingData.getProjectTasks.map((task) =>
                  task.id === updatedTask.id ? { ...task, status: updatedTask.status } : task
                ),
              },
            });
          }
        },
      });
  
      console.log('Mutation result:', result);
    } catch (error) {
      console.error("Failed to update task status:", error);
      // Vous pourriez vouloir afficher une notification à l'utilisateur ici
    }
  };

  const handleCreateTask = async () => {
    if (!title.trim()) return;

    await createTask({
      variables: {
        title,
        projectId: parseInt(projectId, 10),
        status: 'todo',
      },
      refetchQueries: [
        { query: GET_PROJECT_TASKS, variables: { projectId: parseInt(projectId, 10) } },
      ],
    });

    setTitle('');
    setShowModal(false);
  };

  return (
    <>
      <DndContext
        collisionDetection={closestCenter}
        sensors={sensors}
        onDragEnd={handleDragEnd}
      >
        <div className="flex flex-col gap-4 p-4 bg-white min-h-screen text-black">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-2xl font-bold">Kanban</h1>
            <button
              onClick={() => setShowModal(true)}
              className="bg-black text-white px-4 py-2 rounded"
            >
              Nouvelle tâche
            </button>
          </div>

          <div className="flex gap-4">
            {columns.map((column) => (
              <DroppableColumn key={column} column={column}>
                <SortableContext
                  items={groupedTasks[column].map((task) => task.id.toString())}
                  strategy={verticalListSortingStrategy}
                >
                  {groupedTasks[column].map((task) => (
                    <SortableTask key={task.id} task={task} />
                  ))}
                </SortableContext>

                {groupedTasks[column].length === 0 && (
                  <p className="text-gray-500">Aucune tâche dans cette colonne.</p>
                )}
              </DroppableColumn>
            ))}
          </div>
        </div>
      </DndContext>

      {showModal &&
        createPortal(
          <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded shadow w-full max-w-md">
              <h2 className="text-xl font-bold mb-4">Créer une tâche</h2>
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Nom de la tâche"
                className="w-full p-2 border border-gray-300 rounded mb-4"
              />
              <div className="flex justify-end gap-2">
                <button
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 bg-gray-300 rounded"
                >
                  Annuler
                </button>
                <button
                  onClick={handleCreateTask}
                  className="px-4 py-2 bg-black text-white rounded"
                >
                  Créer
                </button>
              </div>
            </div>
          </div>,
          document.body
        )}
    </>
  );
}

export default function SubTaskList({ subtasks }: { subtasks: any[] }) {
    if (!subtasks || subtasks.length === 0) return <p className="text-sm">Aucune sous-tâche</p>;
  
    return (
      <ul className="list-disc pl-5 text-sm">
        {subtasks.map((subtask) => (
          <li key={subtask.id}>
            {subtask.title} - {subtask.done ? 'Fait' : 'À faire'}
          </li>
        ))}
      </ul>
    );
  }
  
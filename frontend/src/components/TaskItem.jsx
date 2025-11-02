// Simple task item component
// Shows a single task with checkbox and delete button
// Props: task object, onToggle function, onDelete function

export default function TaskItem({ task, onToggle, onDelete }) {
  const isOverdue = new Date(task.due_date) < new Date() && !task.completed;

  return (
    <div className={`task ${task.completed ? 'completed' : ''} ${isOverdue ? 'overdue' : ''}`}>
      <input
        type="checkbox"
        checked={task.completed}
        onChange={() => onToggle(task.id, task.completed)}
      />
      <div className="task-info">
        <div className="task-title">{task.title}</div>
        <div className="task-meta">
          <span>{task.assigned_to}</span>
          <span>{task.due_date}</span>
          {isOverdue && <span className="overdue-label">OVERDUE</span>}
        </div>
      </div>
      <button onClick={() => onDelete(task.id)}>Delete</button>
    </div>
  );
}

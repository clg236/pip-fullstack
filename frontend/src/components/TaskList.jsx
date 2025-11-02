import TaskItem from './TaskItem';

// Task list component
// Shows a list of tasks with optional filtering
// Props: tasks array, onToggle function, onDelete function, filter value, onFilterChange function

export default function TaskList({ tasks, onToggle, onDelete, filter, onFilterChange }) {
  // Get unique team members from tasks
  const teamMembers = [...new Set(tasks.map(task => task.assigned_to))];

  // Filter tasks based on selected person
  const filteredTasks = filter === 'all'
    ? tasks
    : tasks.filter(task => task.assigned_to === filter);

  return (
    <div className="task-list">
      <div className="task-list-header">
        <h2>Tasks</h2>
        <select value={filter} onChange={(e) => onFilterChange(e.target.value)}>
          <option value="all">All</option>
          {teamMembers.map(member => (
            <option key={member} value={member}>{member}</option>
          ))}
        </select>
      </div>

      {filteredTasks.length === 0 ? (
        <p>No tasks found</p>
      ) : (
        filteredTasks.map(task => (
          <TaskItem
            key={task.id}
            task={task}
            onToggle={onToggle}
            onDelete={onDelete}
          />
        ))
      )}
    </div>
  );
}

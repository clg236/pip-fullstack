import { useState } from 'react';

// Form component for adding new tasks
// Props: onSubmit function to handle form submission

export default function TaskForm({ onSubmit }) {
  const [title, setTitle] = useState('');
  const [assignedTo, setAssignedTo] = useState('');
  const [dueDate, setDueDate] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!title || !assignedTo || !dueDate) {
      alert('Please fill in all fields');
      return;
    }

    onSubmit({ title, assigned_to: assignedTo, due_date: dueDate });

    // Reset form
    setTitle('');
    setAssignedTo('');
    setDueDate('');
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Task title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <input
        type="text"
        placeholder="Assigned to"
        value={assignedTo}
        onChange={(e) => setAssignedTo(e.target.value)}
      />
      <input
        type="date"
        value={dueDate}
        onChange={(e) => setDueDate(e.target.value)}
      />
      <button type="submit">Add Task</button>
    </form>
  );
}

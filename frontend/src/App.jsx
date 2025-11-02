import { useState, useEffect } from 'react';
import './App.css';
import TaskForm from './components/TaskForm';
import TaskList from './components/TaskList';
import StatsCard from './components/StatsCard';

// Main app component
// Manages state for tasks and stats, handles API calls

const API_URL = 'http://localhost:8000';

export default function App() {
  const [tasks, setTasks] = useState([]);
  const [stats, setStats] = useState({});
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(false);

  // Fetch tasks and stats on mount
  useEffect(() => {
    fetchTasks();
    fetchStats();
  }, []);

  // Get tasks from API
  const fetchTasks = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/tasks`);
      const data = await response.json();
      setTasks(data.tasks);
    } catch (err) {
      console.error('Error fetching tasks:', err);
    } finally {
      setLoading(false);
    }
  };

  // Get stats from API
  const fetchStats = async () => {
    try {
      const response = await fetch(`${API_URL}/stats`);
      const data = await response.json();
      setStats(data.stats);
    } catch (err) {
      console.error('Error fetching stats:', err);
    }
  };

  // Create new task
  const handleAddTask = async (taskData) => {
    try {
      const response = await fetch(`${API_URL}/tasks`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(taskData),
      });

      if (response.ok) {
        fetchTasks();
        fetchStats();
      }
    } catch (err) {
      console.error('Error creating task:', err);
    }
  };

  // Toggle task completion
  const handleToggleTask = async (taskId, currentStatus) => {
    try {
      const response = await fetch(`${API_URL}/tasks/${taskId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ completed: !currentStatus }),
      });

      if (response.ok) {
        fetchTasks();
        fetchStats();
      }
    } catch (err) {
      console.error('Error updating task:', err);
    }
  };

  // Delete task
  const handleDeleteTask = async (taskId) => {
    if (!confirm('Delete this task?')) return;

    try {
      const response = await fetch(`${API_URL}/tasks/${taskId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        fetchTasks();
        fetchStats();
      }
    } catch (err) {
      console.error('Error deleting task:', err);
    }
  };

  return (
    <div className="app">
      <header>
        <h1>Team Accountability Tracker</h1>
      </header>

      <div className="stats-section">
        <h2>Team Stats</h2>
        <div className="stats-grid">
          {Object.keys(stats).length === 0 ? (
            <p>No stats yet</p>
          ) : (
            Object.entries(stats).map(([person, data]) => (
              <StatsCard key={person} person={person} stats={data} />
            ))
          )}
        </div>
      </div>

      <div className="form-section">
        <h2>Add Task</h2>
        <TaskForm onSubmit={handleAddTask} />
      </div>

      <TaskList
        tasks={tasks}
        onToggle={handleToggleTask}
        onDelete={handleDeleteTask}
        filter={filter}
        onFilterChange={setFilter}
      />

      {loading && <div className="loading">Loading...</div>}
    </div>
  );
}

// Stats card component
// Shows stats for a single team member
// Props: person name, stats object with completed/pending/total counts

export default function StatsCard({ person, stats }) {
  const completionRate = stats.total > 0
    ? Math.round((stats.completed / stats.total) * 100)
    : 0;

  return (
    <div className="stat-card">
      <h3>{person}</h3>
      <div className="stats">
        <div>
          <span className="stat-value">{stats.completed}</span>
          <span className="stat-label">Completed</span>
        </div>
        <div>
          <span className="stat-value">{stats.pending}</span>
          <span className="stat-label">Pending</span>
        </div>
        <div>
          <span className="stat-value">{completionRate}%</span>
          <span className="stat-label">Rate</span>
        </div>
      </div>
    </div>
  );
}

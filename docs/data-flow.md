# Data Flow

## Complete Request Lifecycle

This shows how data flows through the entire application when a user adds a task.

```mermaid
sequenceDiagram
    participant U as User
    participant TF as TaskForm
    participant App as App.jsx
    participant API as FastAPI
    participant DB as Supabase

    U->>TF: Fill form & click submit
    TF->>TF: Validate inputs
    TF->>App: onSubmit(taskData)
    App->>API: POST /tasks
    Note over App,API: fetch() with JSON body
    API->>API: Validate with Pydantic
    API->>DB: Insert task
    DB-->>API: Return new task
    API-->>App: 200 OK + task data
    App->>App: fetchTasks()
    App->>API: GET /tasks
    API->>DB: SELECT * FROM tasks
    DB-->>API: All tasks
    API-->>App: tasks array
    App->>App: setTasks(data)
    App->>App: fetchStats()
    App->>API: GET /stats
    API->>DB: Calculate stats
    DB-->>API: Stats data
    API-->>App: stats object
    App->>App: setStats(data)
    Note over App: React re-renders
    App->>TF: Re-render with new props
    App->>U: Show updated UI
```

## State Management Flow

How state changes propagate through the app.

```mermaid
graph TD
    A[User Action] --> B{Action Type}

    B -->|Create Task| C[TaskForm.onSubmit]
    B -->|Toggle Task| D[TaskItem.onChange]
    B -->|Delete Task| E[TaskItem.onClick]
    B -->|Filter Change| F[TaskList.onChange]

    C --> G[App.handleAddTask]
    D --> H[App.handleToggleTask]
    E --> I[App.handleDeleteTask]
    F --> J[App.setFilter]

    G --> K[API Call]
    H --> K
    I --> K
    J --> L[Local State Update]

    K --> M[Refetch Data]
    M --> N[Update State]
    L --> N

    N --> O[React Re-render]
    O --> P[Updated UI]
```

## Component Re-render Chain

When state changes, which components re-render?

```mermaid
graph TD
    State[State Change in App] --> App[App Re-renders]

    App --> Check1{tasks changed?}
    Check1 -->|Yes| TaskList[TaskList Re-renders]
    Check1 -->|No| TaskList2[TaskList skipped]

    TaskList --> TaskItems[All TaskItem components Re-render]

    App --> Check2{stats changed?}
    Check2 -->|Yes| Stats[StatsCard components Re-render]
    Check2 -->|No| Stats2[StatsCard skipped]

    App --> Check3{filter changed?}
    Check3 -->|Yes| TaskList
    Check3 -->|No| TaskList3[Filter not changed]

    style State fill:#ffcccc
    style App fill:#ccffcc
    style TaskList fill:#ccccff
    style Stats fill:#ffffcc
```

## API Call Pattern

Standard pattern used for all mutations:

```mermaid
flowchart TD
    Start[User Action] --> Call[Make API Call]
    Call --> Check{Response OK?}

    Check -->|Yes| Refetch[Refetch Tasks & Stats]
    Check -->|No| Error[Log Error]

    Refetch --> Update[Update State]
    Update --> Render[React Re-renders]
    Render --> End[User Sees Update]

    Error --> End2[User Sees Error]
```

## Example: Adding a Task

Step-by-step data transformation:

### 1. User Input (Form State)
```javascript
{
  title: "Write docs",
  assignedTo: "Alex",
  dueDate: "2024-11-15"
}
```

### 2. Transform for API
```javascript
{
  title: "Write docs",
  assigned_to: "Alex",    // snake_case for API
  due_date: "2024-11-15"
}
```

### 3. Pydantic Validation (Backend)
```python
Task(
  title="Write docs",
  assigned_to="Alex",
  due_date="2024-11-15"
)
```

### 4. Database Insert
```sql
INSERT INTO tasks (title, assigned_to, due_date, completed)
VALUES ('Write docs', 'Alex', '2024-11-15', false)
RETURNING *;
```

### 5. API Response
```json
{
  "message": "Task created",
  "data": [{
    "id": 19,
    "title": "Write docs",
    "assigned_to": "Alex",
    "due_date": "2024-11-15",
    "completed": false,
    "created_at": "2024-11-02T12:00:00Z"
  }]
}
```

### 6. Frontend State Update
```javascript
// App state after fetchTasks()
tasks = [
  // ... existing tasks
  {
    id: 19,
    title: "Write docs",
    assigned_to: "Alex",
    due_date: "2024-11-15",
    completed: false,
    created_at: "2024-11-02T12:00:00Z"
  }
]
```

### 7. Component Props
```javascript
// TaskList receives
<TaskList tasks={tasks} ... />

// TaskItem receives
<TaskItem task={task} ... />
```

## Error Handling Flow

```mermaid
flowchart TD
    Start[API Call] --> Try{Try}

    Try -->|Success| Response[Get Response]
    Try -->|Network Error| Catch[Catch Block]

    Response --> Check{response.ok?}
    Check -->|Yes| Success[Process Data]
    Check -->|No| Fail[Log Error]

    Catch --> Log[console.error]
    Fail --> Log

    Success --> Update[Update State]
    Log --> NoUpdate[State Unchanged]

    Update --> Render[UI Updates]
    NoUpdate --> NoRender[UI Shows Error]
```

## Key Concepts

### Unidirectional Data Flow
Data flows **down** from parent to child via props.
Events flow **up** from child to parent via callbacks.

### Single Source of Truth
All application data lives in `App.jsx` state.
Child components receive data as props.

### Optimistic Updates
We could implement optimistic updates (update UI before API responds), but currently we:
1. Make API call
2. Wait for response
3. Refetch all data
4. Update state
5. UI re-renders

This is simpler and safer for learning purposes.

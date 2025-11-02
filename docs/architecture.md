# System Architecture

## Overview

This is a fullstack web application built with React (frontend) and FastAPI (backend), using Supabase as the database.

## High-Level Architecture

```mermaid
graph TB
    subgraph "Frontend - React + Vite"
        Browser[Browser]
        App[App.jsx]
        Components[Components]
        CSS[Styles]
    end

    subgraph "Backend - FastAPI"
        API[FastAPI Server]
        Routes[API Routes]
        Models[Data Models]
    end

    subgraph "Database"
        Supabase[(Supabase PostgreSQL)]
    end

    Browser --> App
    App --> Components
    App --> CSS
    App -->|HTTP Requests| API
    API --> Routes
    Routes --> Models
    Models -->|SQL Queries| Supabase
    Supabase -->|Response| Models
    Models -->|JSON| API
    API -->|JSON Response| App
```

## Technology Stack

### Frontend
- **React 19** - UI library
- **Vite** - Build tool and dev server
- **Native Fetch API** - HTTP requests

### Backend
- **FastAPI** - Python web framework
- **Uvicorn** - ASGI server
- **Pydantic** - Data validation
- **python-dotenv** - Environment variables

### Database
- **Supabase** - PostgreSQL database as a service
- **Supabase Client** - Python SDK for database operations

## Communication Flow

```mermaid
sequenceDiagram
    participant User
    participant React
    participant FastAPI
    participant Supabase

    User->>React: Interact with UI
    React->>FastAPI: HTTP Request (fetch)
    FastAPI->>FastAPI: Validate with Pydantic
    FastAPI->>Supabase: Query database
    Supabase->>FastAPI: Return data
    FastAPI->>React: JSON Response
    React->>React: Update state
    React->>User: Render updated UI
```

## Key Features

1. **CORS Enabled** - Frontend and backend run on different ports
2. **RESTful API** - Standard HTTP methods (GET, POST, PATCH, DELETE)
3. **Real-time Updates** - Frontend refetches data after mutations
4. **Component-Based UI** - Reusable React components
5. **Type Safety** - Pydantic models validate API data

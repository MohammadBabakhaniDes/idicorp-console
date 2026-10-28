
import {
    Check,
    Circle,
    Clock3,
    MoreHorizontal,
    Pencil,
    Trash2,
  } from "lucide-react";
  
  function IconButton({ label, onClick, children, className = "" }) {
    return (
      <button
        type="button"
        className={`icon-button ${className}`}
        aria-label={label}
        title={label}
        onClick={onClick}
      >
        {children}
      </button>
    );
  }
  
  export default function TaskList({
    tasks = [],
    onToggle,
    onEdit,
    onDelete,
    loading = false,
  }) {
    if (loading) {
      return (
        <div className="empty-state">
          <p>Loading tasks...</p>
        </div>
      );
    }
  
    if (tasks.length === 0) {
      return (
        <div className="empty-state">
          <Check className="empty-state-icon" size={28} />
          <h3>No tasks found</h3>
          <p>Create a task or change your search and filters.</p>
        </div>
      );
    }
  
    return (
      <div className="task-list">
        {tasks.map((task) => {
          const completed = Boolean(task.completed);
  
          return (
            <article
              className={`task-row ${completed ? "task-completed" : ""}`}
              key={task.id}
            >
              <button
                type="button"
                className="task-check"
                aria-label={
                  completed ? "Mark task as pending" : "Mark task as completed"
                }
                onClick={() => onToggle?.(task)}
              >
                {completed ? <Check size={16} /> : <Circle size={18} />}
              </button>
  
              <div className="task-content">
                <h3>{task.title}</h3>
                {task.description && <p>{task.description}</p>}
  
                <span className="task-meta">
                  <Clock3 size={13} />
                  {completed ? "Completed" : "In progress"}
                </span>
              </div>
  
              <div className="task-actions">
                <IconButton
                  label="Edit task"
                  onClick={() => onEdit?.(task)}
                >
                  <Pencil size={16} />
                </IconButton>
  
                <IconButton
                  label="Delete task"
                  onClick={() => onDelete?.(task)}
                >
                  <Trash2 size={16} />
                </IconButton>
              </div>
            </article>
          );
        })}
      </div>
    );
  }
  
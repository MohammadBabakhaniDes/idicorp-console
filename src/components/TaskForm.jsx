
import { X } from "lucide-react";

export default function TaskForm({
  open,
  editingTask,
  title,
  description,
  setTitle,
  setDescription,
  onClose,
  onSubmit,
  saving = false,
}) {
  if (!open) return null;

  return (
    <div
      className="modal-backdrop"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <section
        className="task-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="task-form-title"
      >
        <div className="modal-header">
          <div>
            <p className="eyebrow">
              {editingTask ? "UPDATE TASK" : "NEW TASK"}
            </p>
            <h2 id="task-form-title">
              {editingTask ? "Edit task" : "Create a task"}
            </h2>
          </div>

          <button
            type="button"
            className="icon-button"
            aria-label="Close form"
            onClick={onClose}
          >
            <X size={18} />
          </button>
        </div>

        <form
          className="task-form"
          onSubmit={(event) => {
            event.preventDefault();
            onSubmit();
          }}
        >
          <label htmlFor="task-title">Title</label>
          <input
            id="task-title"
            name="title"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            maxLength={120}
            required
            autoFocus
            placeholder="Enter task title"
          />

          <label htmlFor="task-description">Description</label>
          <textarea
            id="task-description"
            name="description"
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            maxLength={2000}
            rows={4}
            placeholder="Add details (optional)"
          />

          <div className="modal-actions">
            <button
              type="button"
              className="button-secondary"
              onClick={onClose}
              disabled={saving}
            >
              Cancel
            </button>

            <button
              type="submit"
              className="button-primary"
              disabled={saving || !title.trim()}
            >
              {saving
                ? "Saving..."
                : editingTask
                  ? "Save changes"
                  : "Create task"}
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}

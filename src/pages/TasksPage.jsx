
import { useCallback, useEffect, useState } from "react";
import { Plus, Search } from "lucide-react";
import SectionTitle from "../components/SectionTitle.jsx";
import TaskList from "../components/TaskList.jsx";
import TaskForm from "../components/TaskForm.jsx";
import {
  getTasks,
  createTask,
  updateTask,
  patchTask,
  deleteTask,
} from "../services/taskService.js";

export default function TasksPage({ onNotice }) {
  const [tasks, setTasks] = useState([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formOpen, setFormOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const loadTasks = useCallback(async () => {
    setLoading(true);

    try {
      const data = await getTasks({ search, filter });
      setTasks(Array.isArray(data) ? data : data?.tasks || []);
    } catch (error) {
      onNotice?.(error.message);
    } finally {
      setLoading(false);
    }
  }, [search, filter, onNotice]);

  useEffect(() => {
    loadTasks();
  }, [loadTasks]);

  function openCreateForm() {
    setEditingTask(null);
    setTitle("");
    setDescription("");
    setFormOpen(true);
  }

  function openEditForm(task) {
    setEditingTask(task);
    setTitle(task.title || "");
    setDescription(task.description || "");
    setFormOpen(true);
  }

  function closeForm() {
    if (saving) return;
    setFormOpen(false);
    setEditingTask(null);
  }

  async function handleSave() {
    if (!title.trim()) {
      onNotice?.("Task title is required.");
      return;
    }

    setSaving(true);

    try {
      const taskData = {
        title: title.trim(),
        description: description.trim(),
        completed: editingTask?.completed ?? false,
      };

      if (editingTask) {
        await updateTask(editingTask.id, taskData);
        onNotice?.("Task updated successfully.");
      } else {
        await createTask(taskData);
        onNotice?.("Task created successfully.");
      }

      setFormOpen(false);
      setEditingTask(null);
      await loadTasks();
    } catch (error) {
      onNotice?.(error.message);
    } finally {
      setSaving(false);
    }
  }

  async function handleToggle(task) {
    try {
      await patchTask(task.id, { completed: !task.completed });
      await loadTasks();
    } catch (error) {
      onNotice?.(error.message);
    }
  }

  async function handleDelete(task) {
    if (!window.confirm(`Delete "${task.title}"?`)) return;

    try {
      await deleteTask(task.id);
      onNotice?.("Task deleted.");
      await loadTasks();
    } catch (error) {
      onNotice?.(error.message);
    }
  }

  return (
    <div className="page-section">
      <SectionTitle
        eyebrow="TASK MANAGEMENT"
        title="Your tasks"
        description="Create, organize, and track your work."
        action={
          <button
            type="button"
            className="button-primary"
            onClick={openCreateForm}
          >
            <Plus size={17} /> New task
          </button>
        }
      />

      <section className="panel">
        <div className="task-toolbar">
          <div className="search-field">
            <Search size={17} />
            <input
              aria-label="Search tasks"
              placeholder="Search tasks..."
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
          </div>

          <select
            aria-label="Filter tasks"
            value={filter}
            onChange={(event) => setFilter(event.target.value)}
          >
            <option value="all">All tasks</option>
            <option value="pending">Pending</option>
            <option value="completed">Completed</option>
          </select>
        </div>

        <TaskList
          tasks={tasks}
          loading={loading}
          onToggle={handleToggle}
          onEdit={openEditForm}
          onDelete={handleDelete}
        />
      </section>

      <TaskForm
        open={formOpen}
        editingTask={editingTask}
        title={title}
        description={description}
        setTitle={setTitle}
        setDescription={setDescription}
        onClose={closeForm}
        onSubmit={handleSave}
        saving={saving}
      />
    </div>
  );
}


import { apiRequest } from "./api.js";

export function getTasks({ search = "", filter = "all" } = {}) {
  const params = {};

  if (search.trim()) {
    params.q = search.trim();
  }

  if (filter === "completed") {
    params.completed = true;
  } else if (filter === "pending") {
    params.completed = false;
  }

  return apiRequest("/api/tasks", { params });
}

export function getTask(id) {
  return apiRequest(`/api/tasks/${id}`);
}

export function createTask(task) {
  return apiRequest("/api/tasks", {
    method: "POST",
    data: {
      title: task.title.trim(),
      description: task.description?.trim() || "",
      completed: task.completed ?? false,
    },
  });
}

export function updateTask(id, task) {
  return apiRequest(`/api/tasks/${id}`, {
    method: "PUT",
    data: {
      title: task.title.trim(),
      description: task.description?.trim() || "",
      completed: Boolean(task.completed),
    },
  });
}

export function patchTask(id, changes) {
  return apiRequest(`/api/tasks/${id}`, {
    method: "PATCH",
    data: changes,
  });
}

export function deleteTask(id) {
  return apiRequest(`/api/tasks/${id}`, {
    method: "DELETE",
  });
}

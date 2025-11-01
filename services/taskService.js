const API_URL = 'http://localhost:4000/tasks';

export const taskService = {
  async getTasks() {
    const response = await fetch(API_URL);
    if (!response.ok) throw new Error('Failed to fetch tasks');
    return response.json();
  },

  async getTasksByColumn(column) {
    const response = await fetch(`${API_URL}?column=${column}`);
    if (!response.ok) throw new Error('Failed to fetch tasks');
    return response.json();
  },

  async createTask(task) {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(task),
    });
    if (!response.ok) throw new Error('Failed to create task');
    return response.json();
  },

  async updateTask(id, task) {
    const response = await fetch(`${API_URL}/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(task),
    });
    if (!response.ok) throw new Error('Failed to update task');
    return response.json();
  },

  async deleteTask(id) {
    const response = await fetch(`${API_URL}/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error('Failed to delete task');
  },

  async searchTasks(query) {
    const response = await fetch(`${API_URL}?q=${query}`);
    if (!response.ok) throw new Error('Failed to search tasks');
    return response.json();
  }
};

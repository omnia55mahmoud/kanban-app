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
    // Search by title OR description
    const [titleResponse, descriptionResponse] = await Promise.all([
      fetch(`${API_URL}?title_like=${encodeURIComponent(query)}`),
      fetch(`${API_URL}?description_like=${encodeURIComponent(query)}`)
    ]);
    
    if (!titleResponse.ok || !descriptionResponse.ok) {
      throw new Error('Failed to search tasks');
    }
    
    const [titleResults, descriptionResults] = await Promise.all([
      titleResponse.json(),
      descriptionResponse.json()
    ]);
    
    // Merge and deduplicate results by id
    const mergedResults = [...titleResults, ...descriptionResults];
    const uniqueResults = mergedResults.filter((task, index, self) =>
      index === self.findIndex(t => t.id === task.id)
    );
    
    return uniqueResults;
  }
};

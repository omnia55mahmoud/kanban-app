import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { taskService } from '@/services/taskService';

export const taskKeys = {
  all: ['tasks'],
  lists: () => [...taskKeys.all, 'list'],
  list: (filters) => [...taskKeys.lists(), filters],
  details: () => [...taskKeys.all, 'detail'],
  detail: (id) => [...taskKeys.details(), id],
};

export const useTasks = () => {
  return useQuery({
    queryKey: taskKeys.lists(),
    queryFn: taskService.getTasks,
  });
};

export const useTasksByColumn = (column) => {
  return useQuery({
    queryKey: taskKeys.list({ column }),
    queryFn: () => taskService.getTasksByColumn(column),
  });
};

export const useTask = (id) => {
  return useQuery({
    queryKey: taskKeys.detail(id),
    queryFn: () => taskService.getTaskById(id),
    enabled: !!id,
  });
};

export const useSearchTasks = (query) => {
  return useQuery({
    queryKey: taskKeys.list({ search: query }),
    queryFn: () => taskService.searchTasks(query),
    enabled: query.length > 0,
  });
};

export const useCreateTask = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: taskService.createTask,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: taskKeys.lists() });
    },
  });
};

export const useUpdateTask = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, task }) => taskService.updateTask(id, task),
    onSuccess: (updatedTask) => {
      queryClient.setQueryData(taskKeys.detail(updatedTask.id), updatedTask);
      queryClient.invalidateQueries({ queryKey: taskKeys.lists() });
    },
  });
};

export const useDeleteTask = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: taskService.deleteTask,
    onSuccess: (_, deletedId) => {
      queryClient.removeQueries({ queryKey: taskKeys.detail(deletedId) });
      queryClient.invalidateQueries({ queryKey: taskKeys.lists() });
    },
  });
};
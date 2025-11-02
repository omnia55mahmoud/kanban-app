import { useState, useEffect } from 'react';
import { useTasks, useSearchTasks } from "@/hooks/useTasks";

export function useTasksData() {
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState('');
  
  // Debounce search query 
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
    }, 700);

    return () => clearTimeout(timer);
  }, [searchQuery]);
  
  const { data: allTasks = [], isLoading: isLoadingAll, error: errorAll, dataUpdatedAt: allTasksUpdatedAt } = useTasks();
  const { data: searchResults = [], isLoading: isLoadingSearch, error: errorSearch, dataUpdatedAt: searchUpdatedAt } = useSearchTasks(debouncedSearchQuery);
  
  const tasks = debouncedSearchQuery ? searchResults : allTasks;
  const filteredTasks = tasks;
  const isLoading = debouncedSearchQuery ? isLoadingSearch : isLoadingAll;
  const error = debouncedSearchQuery ? errorSearch : errorAll;
  const dataUpdatedAt = debouncedSearchQuery ? searchUpdatedAt : allTasksUpdatedAt;

  return {
    tasks,
    filteredTasks,
    isLoading,
    error,
    dataUpdatedAt,
    searchQuery,
    setSearchQuery,
  };
}


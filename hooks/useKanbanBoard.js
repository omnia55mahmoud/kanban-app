import { useState } from 'react';
import { useTasksData } from './useTasksData';
import { useTaskModal } from './useTaskModal';
import { useKanbanDnD } from './useKanbanDnD';

export function useKanbanBoard() {
  // Task data management
  const {
    tasks,
    filteredTasks,
    isLoading,
    error,
    dataUpdatedAt,
    searchQuery,
    setSearchQuery,
  } = useTasksData();

  // Modal management
  const {
    modalOpen,
    modalType,
    selectedTask,
    openModal,
    closeModal,
    confirmModal,
  } = useTaskModal();

  // Drag and drop management
  const {
    activeTaskId,
    activeTask,
    reorderedTasks,
    onDragStart,
    onDragOver,
    onDragEnd,
  } = useKanbanDnD({ tasks, filteredTasks, dataUpdatedAt });

  // Pagination state
  const [displayCounts, setDisplayCounts] = useState({
    backlog: 10,
    inProgress: 10,
    review: 10,
    done: 10
  });

  function loadMore(column) {
    setDisplayCounts(prev => ({
      ...prev,
      [column]: prev[column] + 10
    }));
  }

  function getColumnTasks(column) {
    const tasksToUse = reorderedTasks || filteredTasks;
    let columnTasks;

    if (reorderedTasks) {
      columnTasks = tasksToUse.filter(t => t.column === column);
    } else {
      columnTasks = tasksToUse
        .filter(t => t.column === column)
        .sort((a, b) => {
          const aTime = a.createdAt || 0;
          const bTime = b.createdAt || 0;
          return bTime - aTime;
        });
    }
    
    return columnTasks.slice(0, displayCounts[column]);
  }

  function hasMore(column) {
    const columnTasks = filteredTasks
      .filter(t => t.column === column)
      .sort((a, b) => {
        const aTime = a.createdAt || 0;
        const bTime = b.createdAt || 0;
        return bTime - aTime;
      });
    return columnTasks.length > displayCounts[column];
  }

  return {
    // data
    tasks,
    filteredTasks,
    isLoading,
    error,
    activeTaskId,
    activeTask,
    displayCounts,

    // modal
    modalOpen,
    modalType,
    selectedTask,
    openModal,
    closeModal,
    confirmModal,

    // search
    searchQuery,
    setSearchQuery,

    // pagination
    getColumnTasks,
    hasMore,
    loadMore,

    // dnd
    onDragStart,
    onDragOver,
    onDragEnd,
  };
}
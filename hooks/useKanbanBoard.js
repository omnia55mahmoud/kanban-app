import { useState, useEffect } from 'react';
import { useTasks, useUpdateTask, useDeleteTask, useCreateTask, useSearchTasks } from "@/hooks/useTasks";

export function useKanbanBoard() {
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState('');
  
  // Debounce search query 
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
    }, 700);

    return () => clearTimeout(timer);
  }, [searchQuery]);
  
  const { data: allTasks = [], isLoading: isLoadingAll, error: errorAll } = useTasks();
  const { data: searchResults = [], isLoading: isLoadingSearch, error: errorSearch } = useSearchTasks(debouncedSearchQuery);
  
  const tasks = debouncedSearchQuery ? searchResults : allTasks;
  const filteredTasks = tasks;
  const isLoading = debouncedSearchQuery ? isLoadingSearch : isLoadingAll;
  const error = debouncedSearchQuery ? errorSearch : errorAll;
  
  const updateTaskMutation = useUpdateTask();
  const deleteTaskMutation = useDeleteTask();
  const createTaskMutation = useCreateTask();

  const [modalOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState(null); // 'edit' | 'delete'
  const [selectedTask, setSelectedTask] = useState(null);
  const [activeTaskId, setActiveTaskId] = useState(null);
  const [displayCounts, setDisplayCounts] = useState({
    backlog: 10,
    inProgress: 10,
    review: 10,
    done: 10
  });
// modal handlers
  function openModal(type, task) {
    setModalType(type);
    setSelectedTask(task || null);
    setModalOpen(true);
  }

  function closeModal() {
    setModalOpen(false);
    setModalType(null);
    setSelectedTask(null);
  }

  function confirmModal(data) {
    if (modalType === 'edit') {
      if (selectedTask && data) {
        updateTaskMutation.mutate({
          id: selectedTask.id,
          task: {
            ...selectedTask,
            title: data.title,
            description: data.description,
          },
        });
      } else if (data) {
        createTaskMutation.mutate({
          title: data.title,
          description: data.description,
          column: 'backlog',
        });
      }
    } else if (modalType === 'delete') {
      deleteTaskMutation.mutate(selectedTask.id);
    }
    closeModal();
  }
// pagination handlers
  function loadMore(column) {
    setDisplayCounts(prev => ({
      ...prev,
      [column]: prev[column] + 10
    }));
  }
// get tasks for a specific column with pagination
  function getColumnTasks(column) {
    const columnTasks = filteredTasks.filter(t => t.column === column);
    return columnTasks.slice(0, displayCounts[column]);
  }

  function hasMore(column) {
    const columnTasks = filteredTasks.filter(t => t.column === column);
    return columnTasks.length > displayCounts[column];
  }

  function getColumnIdByTaskId(taskId) {
    const task = tasks.find(t => String(t.id) === String(taskId));
    return task ? task.column : null;
  }
// drag-and-drop handlers
  function onDragStart(event) {
    setActiveTaskId(event.active.id);
  }

  function onDragEnd(event) {
    const { active, over } = event;
    setActiveTaskId(null);

    if (!over) return;

    const sourceColId = getColumnIdByTaskId(active.id);
    const destColId = over.id;
    if (!sourceColId || !destColId || sourceColId === destColId) return;

    const taskToMove = tasks.find(t => t.id === active.id);
    if (!taskToMove) return;

    updateTaskMutation.mutate({
      id: taskToMove.id,
      task: {
        ...taskToMove,
        column: destColId,
      },
    });
  }

  return {
    // data
    tasks,
    filteredTasks,
    isLoading,
    error,
    activeTaskId,
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
    onDragEnd,
  };
}
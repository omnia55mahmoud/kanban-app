import { useState, useEffect } from 'react';
import { useUpdateTask } from "@/hooks/useTasks";
import { arrayMove } from '@dnd-kit/sortable';

const COLUMNS = ['backlog', 'inProgress', 'review', 'done'];

export function useKanbanDnD({ tasks, filteredTasks, dataUpdatedAt }) {
  const [activeTaskId, setActiveTaskId] = useState(null);
  const [activeTask, setActiveTask] = useState(null);
  const [reorderedTasks, setReorderedTasks] = useState(null);
  const [pendingTaskUpdate, setPendingTaskUpdate] = useState(null);

  const updateTaskMutation = useUpdateTask();

  useEffect(() => {
    if (pendingTaskUpdate && dataUpdatedAt && reorderedTasks) {
      const taskInNewData = tasks.find(t => t.id === pendingTaskUpdate.id);
      if (taskInNewData && taskInNewData.column === pendingTaskUpdate.column) {
        setReorderedTasks(null);
        setPendingTaskUpdate(null);
      }
    }
  }, [dataUpdatedAt, tasks, pendingTaskUpdate, reorderedTasks]);

  function getTasksInColumn(column, tasksToUse) {
    return tasksToUse.filter(t => t.column === column);
  }

  function rebuildTasksByColumn(reorderedColumnTasks, targetColumn, tasksToUse) {
    const result = [];
    COLUMNS.forEach(col => {
      if (col === targetColumn) {
        result.push(...reorderedColumnTasks);
      } else {
        const otherTasks = tasksToUse.filter(t => t.column === col);
        result.push(...otherTasks);
      }
    });
    return result;
  }

  function onDragStart(event) {
    const taskId = event.active.id;
    setActiveTaskId(taskId);
    const task = tasks.find(t => t.id === taskId);
    setActiveTask(task || null);
    
    const visualOrder = [];
    COLUMNS.forEach(column => {
      const columnTasks = filteredTasks
        .filter(t => t.column === column)
        .sort((a, b) => {
          const aTime = a.createdAt || 0;
          const bTime = b.createdAt || 0;
          return bTime - aTime;
        });
      visualOrder.push(...columnTasks);
    });
    
    setReorderedTasks(visualOrder);
  }

  function onDragOver(event) {
    const { active, over } = event;
    
    if (!over) {
      setReorderedTasks(null);
      return;
    }

    const activeId = active.id;
    const overId = over.id;
    const tasksToUse = reorderedTasks || tasks;
    const activeTaskItem = tasksToUse.find(t => t.id === activeId);
    
    if (!activeTaskItem) return;

    const activeColumn = activeTaskItem.column;
    const overTask = tasksToUse.find(t => t.id === overId);
    
    if (overTask) {
      const overColumn = overTask.column;
      
      if (activeColumn === overColumn && activeId !== overId) {
        // Reordering within same column
        const columnTasks = getTasksInColumn(activeColumn, tasksToUse);
        const oldIndex = columnTasks.findIndex(t => t.id === activeId);
        const newIndex = columnTasks.findIndex(t => t.id === overId);
        
        if (oldIndex !== newIndex && oldIndex !== -1 && newIndex !== -1) {
          const reorderedColumnTasks = arrayMove(columnTasks, oldIndex, newIndex);
          const result = rebuildTasksByColumn(reorderedColumnTasks, activeColumn, tasksToUse);
          setReorderedTasks(result);
        }
      } else if (activeColumn !== overColumn) {
        // Moving to different column
        const destColumnTasks = getTasksInColumn(overColumn, tasksToUse).filter(t => t.id !== activeId);
        const insertIndex = destColumnTasks.findIndex(t => t.id === overId);
        
        const result = [];
        COLUMNS.forEach(col => {
          if (col === activeColumn) {
            const sourceTasks = tasksToUse.filter(t => t.column === col && t.id !== activeId);
            result.push(...sourceTasks);
          } else if (col === overColumn) {
            const destTasks = destColumnTasks;
            if (insertIndex >= 0) {
              result.push(...destTasks.slice(0, insertIndex));
              result.push({ ...activeTaskItem, column: overColumn });
              result.push(...destTasks.slice(insertIndex));
            } else {
              result.push(...destTasks);
              result.push({ ...activeTaskItem, column: overColumn });
            }
          } else {
            const otherTasks = tasksToUse.filter(t => t.column === col);
            result.push(...otherTasks);
          }
        });
        
        setReorderedTasks(result);
      }
    } else {
      // Dragging over a column droppable
      const overColumn = overId;
      
      if (activeColumn !== overColumn) {
        const result = [];
        COLUMNS.forEach(col => {
          if (col === activeColumn) {
            const sourceTasks = tasksToUse.filter(t => t.column === col && t.id !== activeId);
            result.push(...sourceTasks);
          } else if (col === overColumn) {
            const destTasks = tasksToUse.filter(t => t.column === col && t.id !== activeId);
            result.push({ ...activeTaskItem, column: overColumn });
            result.push(...destTasks);
          } else {
            const otherTasks = tasksToUse.filter(t => t.column === col);
            result.push(...otherTasks);
          }
        });
        
        setReorderedTasks(result);
      }
    }
  }

  function onDragEnd(event) {
    const { active, over } = event;

    if (!over) {
      setReorderedTasks(null);
      setActiveTaskId(null);
      setActiveTask(null);
      return;
    }

    const activeId = active.id;
    const tasksToUse = reorderedTasks || tasks;
    const activeTaskItem = tasksToUse.find(t => t.id === activeId);
    
    if (!activeTaskItem) {
      setReorderedTasks(null);
      setActiveTaskId(null);
      setActiveTask(null);
      return;
    }

    const overId = over.id;
    const overTask = tasksToUse.find(t => t.id === overId);
    
    const destColumn = overTask ? overTask.column : overId;
    const sourceColumn = activeTaskItem.column;

    let finalTasks = tasksToUse;
    
    if (sourceColumn === destColumn && overTask) {
      // Reordering within same column
      const columnTasks = getTasksInColumn(destColumn, tasksToUse);
      const oldIndex = columnTasks.findIndex(t => t.id === activeId);
      const newIndex = columnTasks.findIndex(t => t.id === overId);
      
      if (oldIndex !== newIndex) {
        const newColumnTasks = arrayMove(columnTasks, oldIndex, newIndex);
        finalTasks = rebuildTasksByColumn(newColumnTasks, destColumn, tasksToUse);
      }
    } else if (sourceColumn !== destColumn) {
      // Moving between columns
      const result = [];
      COLUMNS.forEach(col => {
        if (col === sourceColumn) {
          const sourceTasks = tasksToUse.filter(t => t.column === col && t.id !== activeId);
          result.push(...sourceTasks);
        } else if (col === destColumn) {
          const destTasks = tasksToUse.filter(t => t.column === col && t.id !== activeId);
          result.push({ ...activeTaskItem, column: destColumn, createdAt: Date.now() });
          result.push(...destTasks);
        } else {
          const otherTasks = tasksToUse.filter(t => t.column === col);
          result.push(...otherTasks);
        }
      });
      
      finalTasks = result;
    }

    // Update the task in the database
    const taskToUpdate = finalTasks.find(t => t.id === activeId);
    if (taskToUpdate) {
      setReorderedTasks(finalTasks);
      setPendingTaskUpdate(taskToUpdate);
      
      setActiveTaskId(null);
      setActiveTask(null);
      
      updateTaskMutation.mutate(
        {
          id: taskToUpdate.id,
          task: {
            ...taskToUpdate,
          },
        },
        {
          onSuccess: () => {
            // Mutation succeeded - useEffect will clear reorderedTasks when data updates
          },
          onError: () => {
            setReorderedTasks(null);
            setPendingTaskUpdate(null);
          },
        }
      );
    } else {
      setReorderedTasks(null);
      setPendingTaskUpdate(null);
      setActiveTaskId(null);
      setActiveTask(null);
    }
  }

  return {
    activeTaskId,
    activeTask,
    reorderedTasks,
    onDragStart,
    onDragOver,
    onDragEnd,
  };
}
import { useState } from 'react';
import { useUpdateTask, useDeleteTask, useCreateTask } from "@/hooks/useTasks";

export function useTaskModal() {
  const [modalOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState(null); // 'edit' | 'delete'
  const [selectedTask, setSelectedTask] = useState(null);

  const updateTaskMutation = useUpdateTask();
  const deleteTaskMutation = useDeleteTask();
  const createTaskMutation = useCreateTask();

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
          createdAt: Date.now(),
        });
      }
    } else if (modalType === 'delete') {
      deleteTaskMutation.mutate(selectedTask.id);
    }
    closeModal();
  }

  return {
    modalOpen,
    modalType,
    selectedTask,
    openModal,
    closeModal,
    confirmModal,
  };
}


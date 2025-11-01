'use client';
import { useState } from 'react';
import {
  DndContext,
  useDraggable,
  useDroppable,
} from "@dnd-kit/core";
import Search from "@/components/Search/Search";
import styles from "./page.module.css";
import TaskCard from "@/components/TaskCard/TaskCard";
import TaskModal from "@/components/TaskModal/TaskModal";
import { useTasks, useUpdateTask } from "@/hooks/useTasks";
import Loader from '@/components/Loader/Loader';
import Error from '@/components/Error/Error';

const COLUMN_MAP = {
  backlog: 'backlog',
  inProgress: 'inProgress',
  review: 'review',
  done: 'done'
};

function DraggableTaskCard({ task, onEdit, onDelete }) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: task.id,
  });

  const style = {
    transform: transform ? `translate3d(${transform.x}px, ${transform.y}px, 0)` : undefined,
    opacity: isDragging ? 0.5 : 1,
    cursor: isDragging ? 'grabbing' : 'grab',
  };

  return (
    <div ref={setNodeRef} style={style} {...listeners} {...attributes}>
      <TaskCard
        title={task.title}
        description={task.description}
        onEdit={onEdit}
        onDelete={onDelete}
      />
    </div>
  );
}

function DroppableColumn({ id, children, className }) {
  const { setNodeRef, isOver } = useDroppable({
    id: id,
  });

  const style = {
    backgroundColor: isOver ? '#e3f2fd' : undefined,
  };

  return (
    <div ref={setNodeRef} className={className} style={style}>
      {children}
    </div>
  );
}

export default function Home() {
  const [modalOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState(null); 
  const [selectedTask, setSelectedTask] = useState(null);
  const [activeTaskId, setActiveTaskId] = useState(null);
  const { data: tasks = [], isLoading, error } = useTasks();
  const updateTaskMutation = useUpdateTask();

  const getColumnIdByTaskId = (taskId) => {
    const task = tasks.find((t) => String(t.id) === String(taskId));
    return task ? task.column : null;
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;

    setActiveTaskId(null);

    if (!over) return;

    const sourceColId = getColumnIdByTaskId(active.id);
    const destColId = over.id;
    
    if (!sourceColId || !destColId) return;    

    if (sourceColId === destColId) return;

    const taskId = active.id;
    const taskToMove = tasks.find((t) => t.id === taskId);
    if (!taskToMove) return;

    updateTaskMutation.mutate({
      id: taskToMove.id,
      task: {
        ...taskToMove,
        column: destColId,
      },
    });
  };

  const handleDragStart = (event) => {
    setActiveTaskId(event.active.id);
  };

  const handleOpenModal = (type, task) => {
    setModalType(type);
    setSelectedTask(task);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setModalType(null);
    setSelectedTask(null);
  };

  const handleConfirm = (data) => {
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
      }
    } else if (modalType === 'delete') {
      console.log('Delete task:', selectedTask?.id);
    }
    handleCloseModal();
  };

  if (error) {
    return <Error error={error} />;
  }
  
  return (
    <div className={styles.page}>
      <Loader isLoading={isLoading} />
      <main className={styles.main}>
        <div className={styles.header}>
          <Search />
        </div>
        <div className={styles.body}>
          <DndContext
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
          >
            <div className={styles.kanbanBoard}>
              <DroppableColumn id={COLUMN_MAP.backlog} className={styles.column}>
                <div className={styles.columnHeader}>Backlog</div>
                <div className={styles.columnContent}>
                  {tasks.filter(task => task.column === 'backlog').map((task) => (
                    <DraggableTaskCard
                      key={task.id}
                      task={task}
                      onEdit={() => handleOpenModal('edit', task)}
                      onDelete={() => handleOpenModal('delete', task)}
                      isActive={activeTaskId === task.id}
                    />
                  ))}
                </div>
              </DroppableColumn>
              <DroppableColumn id={COLUMN_MAP.inProgress} className={styles.column}>
                <div className={styles.columnHeader}>In Progress</div>
                <div className={styles.columnContent}>
                  {tasks.filter(task => task.column === 'inProgress').map((task) => (
                    <DraggableTaskCard
                      key={task.id}
                      task={task}
                      onEdit={() => handleOpenModal('edit', task)}
                      onDelete={() => handleOpenModal('delete', task)}
                      isActive={activeTaskId === task.id}
                    />
                  ))}
                </div>
              </DroppableColumn>
              <DroppableColumn id={COLUMN_MAP.review} className={styles.column}>
                <div className={styles.columnHeader}>Review</div>
                <div className={styles.columnContent}>
                  {tasks.filter(task => task.column === 'review').map((task) => (
                    <DraggableTaskCard
                      key={task.id}
                      task={task}
                      onEdit={() => handleOpenModal('edit', task)}
                      onDelete={() => handleOpenModal('delete', task)}
                      isActive={activeTaskId === task.id}
                    />
                  ))}
                </div>
              </DroppableColumn>
              <DroppableColumn id={COLUMN_MAP.done} className={styles.column}>
                <div className={styles.columnHeader}>Done</div>
                <div className={styles.columnContent}>
                  {tasks.filter(task => task.column === 'done').map((task) => (
                    <DraggableTaskCard
                      key={task.id}
                      task={task}
                      onEdit={() => handleOpenModal('edit', task)}
                      onDelete={() => handleOpenModal('delete', task)}
                      isActive={activeTaskId === task.id}
                    />
                  ))}
                </div>
              </DroppableColumn>
            </div>
          </DndContext>
        </div>
      </main>
      <TaskModal
        open={modalOpen}
        onClose={handleCloseModal}
        type={modalType}
        task={selectedTask}
        onConfirm={handleConfirm}
      />
    </div>
  );
}

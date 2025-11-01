'use client';
import { useState } from 'react';
import Search from "@/components/Search/Search";
import styles from "./page.module.css";
import TaskCard from "@/components/TaskCard/TaskCard";
import TaskModal from "@/components/TaskModal/TaskModal";
import { useTasks } from "@/hooks/useTasks";
import Loader from '@/components/Loader/Loader';

export default function Home() {
  const [modalOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState(null); 
  const [selectedTask, setSelectedTask] = useState(null);

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
      console.log('Edit task:', selectedTask?.id, data);
    } else if (modalType === 'delete') {
      console.log('Delete task:', selectedTask?.id);
    }
    handleCloseModal();
  };

  const { data: tasks = [], isLoading, error } = useTasks();

  if (error) {
    return <div style={{ color: 'red' }}>Error: {error.message}</div>;
  }
  
  return (
    <div className={styles.page}>
     <Loader isLoading={isLoading} />
      <main className={styles.main}>
        <div className={styles.header}>
          <Search />
        </div>
        <div className={styles.body}>
          <div className={styles.kanbanBoard}>
            <div className={styles.column}>
              <div className={styles.columnHeader}>Backlog</div>
              <div className={styles.columnContent}>
                {tasks.filter(task => task.column === 'backlog').map((task) => (
                  <TaskCard
                    key={task.id}
                    title={task.title}
                    description={task.description}
                    onEdit={() => handleOpenModal('edit', task)}
                    onDelete={() => handleOpenModal('delete', task)}
                  />
                ))}
              </div>
            </div>
            <div className={styles.column}>
              <div className={styles.columnHeader}>In Progress</div>
              <div className={styles.columnContent}>
                {tasks.filter(task => task.column === 'inProgress').map((task) => (
                  <TaskCard
                    key={task.id}
                    title={task.title}
                    description={task.description}
                    onEdit={() => handleOpenModal('edit', task)}
                    onDelete={() => handleOpenModal('delete', task)}
                  />
                ))}
              </div>
            </div>
            <div className={styles.column}>
              <div className={styles.columnHeader}>Review</div>
              <div className={styles.columnContent}>
                {tasks.filter(task => task.column === 'review').map((task) => (
                  <TaskCard
                    key={task.id}
                    title={task.title}
                    description={task.description}
                    onEdit={() => handleOpenModal('edit', task)}
                    onDelete={() => handleOpenModal('delete', task)}
                  />
                ))}
              </div>
            </div>
            <div className={styles.column}>
              <div className={styles.columnHeader}>Done</div>
              <div className={styles.columnContent}>
                {tasks.filter(task => task.column === 'done').map((task) => (
                  <TaskCard
                    key={task.id}
                    title={task.title}
                    description={task.description}
                    onEdit={() => handleOpenModal('edit', task)}
                    onDelete={() => handleOpenModal('delete', task)}
                  />
                ))}
              </div>
            </div>
          </div>
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

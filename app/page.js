'use client';
import { useState } from 'react';
import Search from "@/components/Search/Search";
import styles from "./page.module.css";
import TaskCard from "@/components/TaskCard/TaskCard";
import TaskModal from "@/components/TaskModal/TaskModal";

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

  const sampleTasks = [
    { id: 1, title: "Design homepage", description: "Include hero section", column: "backlog" },
    { id: 2, title: "Sample Task 2", description: "This is a sample task description", column: "inProgress" },
    { id: 3, title: "Sample Task 3", description: "This is a sample task description", column: "inProgress" },
    { id: 4, title: "Sample Task 4", description: "This is a sample task description", column: "review" },
    { id: 5, title: "Sample Task 5", description: "This is a sample task description", column: "review" },
    { id: 6, title: "Sample Task 6", description: "This is a sample task description", column: "review" },
    { id: 7, title: "Sample Task 7", description: "This is a sample task description", column: "done" },
    { id: 8, title: "Sample Task 8", description: "This is a sample task description", column: "done" },
    { id: 9, title: "Sample Task 9", description: "This is a sample task description", column: "done" },
    { id: 10, title: "Sample Task 10", description: "This is a sample task description", column: "done" }
  ];

  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <div className={styles.header}>
          <Search />
        </div>
        <div className={styles.body}>
          <div className={styles.kanbanBoard}>
            <div className={styles.column}>
              <div className={styles.columnHeader}>Backlog</div>
              <div className={styles.columnContent}>
                {sampleTasks.filter(task => task.column === 'backlog').map((task) => (
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
                {sampleTasks.filter(task => task.column === 'inProgress').map((task) => (
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
                {sampleTasks.filter(task => task.column === 'review').map((task) => (
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
                {sampleTasks.filter(task => task.column === 'done').map((task) => (
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

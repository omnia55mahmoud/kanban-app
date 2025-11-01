'use client';
import { useState, useMemo } from 'react';
import {
  DndContext,
  useDraggable,
  useDroppable,
} from "@dnd-kit/core";
import Search from "@/components/Search/Search";
import styles from "./page.module.css";
import TaskCard from "@/components/TaskCard/TaskCard";
import TaskModal from "@/components/TaskModal/TaskModal";
import { useTasks, useUpdateTask, useDeleteTask, useCreateTask } from "@/hooks/useTasks";
import Loader from '@/components/Loader/Loader';
import Error from '@/components/Error/Error';
import Button from '@mui/material/Button';
import SyncIcon from '@mui/icons-material/Sync';

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
  const [searchQuery, setSearchQuery] = useState('');
  const { 
    data, 
    isLoading, 
    error, 
  } = useTasks();
  
  const tasks = data || [];
  //Client-side search filtering
  const displayTasks = searchQuery.length > 0 
    ? tasks.filter(task => 
        task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        task.description.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : tasks;
  const [modalOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState(null); 
  const [selectedTask, setSelectedTask] = useState(null);
  const [activeTaskId, setActiveTaskId] = useState(null);
  // Initially displays 10 tasks for each task type
  const [displayCounts, setDisplayCounts] = useState({
    backlog: 10,
    inProgress: 10,
    review: 10,
    done: 10
  });
  const updateTaskMutation = useUpdateTask();
  const deleteTaskMutation = useDeleteTask();
  const createTaskMutation = useCreateTask();
 const handleSearch = (query) => {
    setSearchQuery(query);
  };
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
      } else if (data) {
        createTaskMutation.mutate({
          title: data.title,
          description: data.description,
          column: 'backlog'
        });
      }
    } else if (modalType === 'delete') {
      deleteTaskMutation.mutate(selectedTask.id);
    }
    handleCloseModal();
  };

  const handleLoadMore = (column) => {
    setDisplayCounts(prev => ({
      ...prev,
      [column]: prev[column] + 10
    }));
  };

  const getTasksForColumn = (column) => {
    const columnTasks = displayTasks.filter(task => task.column === column);
    return columnTasks.slice(0, displayCounts[column]);
  };

  const hasMoreTasks = (column) => {
    const columnTasks = displayTasks.filter(task => task.column === column);
    return columnTasks.length > displayCounts[column];
  };

  if (error) {
    return <Error error={error} />;
  }
  
  return (
    <div className={styles.page}>
      <Loader isLoading={isLoading} />
      <main className={styles.main}>
        <div className={styles.header}>
          <Search 
           onSearch={handleSearch} 
          onAddTask={() => handleOpenModal('edit', null)}
           />
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
                  {getTasksForColumn('backlog').map((task) => (
                    <DraggableTaskCard
                      key={task.id}
                      task={task}
                      onEdit={() => handleOpenModal('edit', task)}
                      onDelete={() => handleOpenModal('delete', task)}
                      isActive={activeTaskId === task.id}
                    />
                  ))}
                  {hasMoreTasks('backlog') && (
                    <div className={styles.loadMoreWrapper}>
                      <Button
                        variant="contained"
                        startIcon={<SyncIcon />}
                        onClick={() => handleLoadMore('backlog')}
                        className={styles.loadMoreButton}
                      >
                        Load More
                      </Button>
                    </div>
                  )}
                </div>
              </DroppableColumn>
              <DroppableColumn id={COLUMN_MAP.inProgress} className={styles.column}>
                <div className={styles.columnHeader}>In Progress</div>
                <div className={styles.columnContent}>
                  {getTasksForColumn('inProgress').map((task) => (
                    <DraggableTaskCard
                      key={task.id}
                      task={task}
                      onEdit={() => handleOpenModal('edit', task)}
                      onDelete={() => handleOpenModal('delete', task)}
                      isActive={activeTaskId === task.id}
                    />
                  ))}
                  {hasMoreTasks('inProgress') && (
                    <div className={styles.loadMoreWrapper}>
                      <Button
                        variant="contained"
                        startIcon={<SyncIcon />}
                        onClick={() => handleLoadMore('inProgress')}
                        className={styles.loadMoreButton}
                      >
                        Load More
                      </Button>
                    </div>
                  )}
                </div>
              </DroppableColumn>
              <DroppableColumn id={COLUMN_MAP.review} className={styles.column}>
                <div className={styles.columnHeader}>Review</div>
                <div className={styles.columnContent}>
                  {getTasksForColumn('review').map((task) => (
                    <DraggableTaskCard
                      key={task.id}
                      task={task}
                      onEdit={() => handleOpenModal('edit', task)}
                      onDelete={() => handleOpenModal('delete', task)}
                      isActive={activeTaskId === task.id}
                    />
                  ))}
                  {hasMoreTasks('review') && (
                    <div className={styles.loadMoreWrapper}>
                      <Button
                        variant="contained"
                        startIcon={<SyncIcon />}
                        onClick={() => handleLoadMore('review')}
                        className={styles.loadMoreButton}
                      >
                        Load More
                      </Button>
                    </div>
                  )}
                </div>
              </DroppableColumn>
              <DroppableColumn id={COLUMN_MAP.done} className={styles.column}>
                <div className={styles.columnHeader}>Done</div>
                <div className={styles.columnContent}>
                  {getTasksForColumn('done').map((task) => (
                    <DraggableTaskCard
                      key={task.id}
                      task={task}
                      onEdit={() => handleOpenModal('edit', task)}
                      onDelete={() => handleOpenModal('delete', task)}
                      isActive={activeTaskId === task.id}
                    />
                  ))}
                  {hasMoreTasks('done') && (
                    <div className={styles.loadMoreWrapper}>
                      <Button
                        variant="contained"
                        startIcon={<SyncIcon />}
                        onClick={() => handleLoadMore('done')}
                        className={styles.loadMoreButton}
                      >
                        Load More
                      </Button>
                    </div>
                  )}
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

'use client';
import { DndContext, DragOverlay, closestCenter, PointerSensor, useSensor, useSensors } from "@dnd-kit/core";
import Search from "@/components/Search/Search";
import TaskModal from "@/components/TaskModal/TaskModal";
import Loader from '@/components/Loader/Loader';
import Error from '@/components/Error/Error';
import KanbanColumn from '@/components/KanbanColumn';
import TaskCard from '@/components/TaskCard/TaskCard';
import styles from "./page.module.css";
import { useKanbanBoard } from '@/hooks/useKanbanBoard';

const COLUMNS = [
  { id: 'backlog',     title: 'Backlog' },
  { id: 'inProgress',  title: 'In Progress' },
  { id: 'review',      title: 'Review' },
  { id: 'done',        title: 'Done' },
];

export default function Home() {
  const {
    // data
    isLoading,
    error,
    activeTaskId,
    activeTask,

    // search
    searchQuery,
    setSearchQuery,

    // pagination 
    getColumnTasks,
    hasMore,
    loadMore,

    // modal
    modalOpen,
    modalType,
    selectedTask,
    openModal,
    closeModal,
    confirmModal,

    // dnd
    onDragStart,
    onDragOver,
    onDragEnd,
  } = useKanbanBoard();

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  if (error) {
    return <Error error={error} />;
  }

  return (
    <div className={styles.page}>
      <Loader isLoading={isLoading} />

      <main className={styles.main}>
        <div className={styles.header}>
          <Search
            onSearch={setSearchQuery}
            onAddTask={() => openModal('edit', null)}
            defaultValue={searchQuery}
          />
        </div>

        <div className={styles.body}>
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragStart={onDragStart}
            onDragOver={onDragOver}
            onDragEnd={onDragEnd}
          >
            <div className={styles.kanbanBoard}>
              {COLUMNS.map(col => (
                <KanbanColumn
                  key={col.id}
                  columnId={col.id}
                  title={col.title}
                  tasks={getColumnTasks(col.id)}
                  hasMore={hasMore(col.id)}
                  onLoadMore={() => loadMore(col.id)}
                  onEditTask={(task) => openModal('edit', task)}
                  onDeleteTask={(task) => openModal('delete', task)}
                  activeTaskId={activeTaskId}
                />
              ))}
            </div>
            <DragOverlay>
              {activeTask ? (
                <div style={{ transform: 'rotate(5deg)', opacity: 0.9 }}>
                  <TaskCard
                    title={activeTask.title}
                    description={activeTask.description}
                  />
                </div>
              ) : null}
            </DragOverlay>
          </DndContext>
        </div>
      </main>

      <TaskModal
        open={modalOpen}
        onClose={closeModal}
        type={modalType}
        task={selectedTask}
        onConfirm={confirmModal}
      />
    </div>
  );
}
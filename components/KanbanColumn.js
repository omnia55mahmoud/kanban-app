import Button from '@mui/material/Button';
import SyncIcon from '@mui/icons-material/Sync';
import { useDroppable, useDraggable } from '@dnd-kit/core';
import TaskCard from './TaskCard/TaskCard';
import styles from '../app/page.module.css';

function DraggableTaskCard({ task, isActive, onEdit, onDelete }) {
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

export default function KanbanColumn({
  columnId,
  title,
  tasks,
  hasMore,
  onLoadMore,
  onEditTask,
  onDeleteTask,
  activeTaskId
}) {
  const { setNodeRef, isOver } = useDroppable({ id: columnId });

  return (
    <div
      ref={setNodeRef}
      className={styles.column}
      style={{ backgroundColor: isOver ? '#e3f2fd' : undefined }}
    >
      <div className={styles.columnHeader}>{title}</div>

      <div className={styles.columnContent}>
        {tasks.map(task => (
          <DraggableTaskCard
            key={task.id}
            task={task}
            isActive={activeTaskId === task.id}
            onEdit={() => onEditTask(task)}
            onDelete={() => onDeleteTask(task)}
          />
        ))}

        {hasMore && (
          <div className={styles.loadMoreWrapper}>
            <Button
              variant="contained"
              startIcon={<SyncIcon />}
              onClick={onLoadMore}
              className={styles.loadMoreButton}
            >
              Load More
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

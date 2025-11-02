import Button from '@mui/material/Button';
import SyncIcon from '@mui/icons-material/Sync';
import { useDroppable } from '@dnd-kit/core';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import TaskCard from './TaskCard/TaskCard';
import styles from '../app/page.module.css';

function SortableTaskCard({ task, isActive, onEdit, onDelete, isDragging: isOverlayDragging }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({
    id: task.id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
    >
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
  const { setNodeRef, isOver } = useDroppable({ 
    id: columnId,
  });

  const taskIds = tasks.map(task => task.id);

  return (
    <div
      ref={setNodeRef}
      className={styles.column}
      style={{ backgroundColor: isOver ? '#e3f2fd' : undefined }}
    >
      <div className={styles.columnHeader}>{title}</div>

      <div className={styles.columnContent}>
        <SortableContext items={taskIds} strategy={verticalListSortingStrategy}>
          {tasks.map(task => (
            <SortableTaskCard
              key={task.id}
              task={task}
              isActive={activeTaskId === task.id}
              isDragging={activeTaskId === task.id}
              onEdit={() => onEditTask(task)}
              onDelete={() => onDeleteTask(task)}
            />
          ))}
        </SortableContext>

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

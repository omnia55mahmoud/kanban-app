'use client';

import styles from './TaskModal.module.css';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';

export default function DeleteContent({ task }) {
  return (
    <Box className={styles.deleteContainer}>
      <DeleteOutlineIcon className={styles.deleteWarningIcon} />
      <Typography variant="body1" className={styles.deleteMessage}>
        Are you sure you want to delete this task?
      </Typography>
      {task && (
        <Box className={styles.taskPreview}>
          <Typography variant="subtitle1" className={styles.taskTitle}>
            {task.title}
          </Typography>
          {task.description && (
            <Typography variant="body2" className={styles.taskDescription}>
              {task.description}
            </Typography>
          )}
        </Box>
      )}
      <Typography variant="body2" className={styles.deleteWarning}>
        This action cannot be undone.
      </Typography>
    </Box>
  );
}


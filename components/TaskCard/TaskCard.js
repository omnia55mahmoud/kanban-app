'use client';
import styles from './TaskCard.module.css';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import Box from '@mui/material/Box';

export default function TaskCard({ title, description, onEdit, onDelete }) {
  return (
    <Card className={styles.taskCard} elevation={2}>
      <CardContent className={styles.cardContent}>
        <Box className={styles.cardHeader}>
          <Typography variant="h6" className={styles.title}>
            {title}
          </Typography>
          <Box className={styles.actions}>
            <IconButton
              size="small"
              onClick={onEdit}
              className={styles.editButton}
              aria-label="edit task"
            >
              <EditIcon fontSize="small" />
            </IconButton>
            <IconButton
              size="small"
              onClick={onDelete}
              className={styles.deleteButton}
              aria-label="delete task"
            >
              <DeleteIcon fontSize="small" />
            </IconButton>
          </Box>
        </Box>
        <Typography variant="body2" className={styles.description}>
          {description}
        </Typography>
      </CardContent>
    </Card>
  );
}
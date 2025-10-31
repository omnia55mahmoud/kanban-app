'use client';

import styles from './TaskModal.module.css';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';

export default function EditContent({ title, description, onTitleChange, onDescriptionChange }) {
  return (
    <Box className={styles.formContainer}>
      <TextField
        autoFocus
        margin="dense"
        label="Task Title"
        type="text"
        fullWidth
        variant="outlined"
        value={title}
        onChange={onTitleChange}
        className={styles.inputField}
        placeholder="Enter task title"
      />
      <TextField
        margin="dense"
        label="Description"
        type="text"
        fullWidth
        multiline
        rows={4}
        variant="outlined"
        value={description}
        onChange={onDescriptionChange}
        className={styles.inputField}
        placeholder="Enter task description"
      />
    </Box>
  );
}


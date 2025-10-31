'use client';

import styles from './TaskModal.module.css';
import DialogTitle from '@mui/material/DialogTitle';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import EditIcon from '@mui/icons-material/Edit';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';

export default function ModalHeader({ isEditMode, isDeleteMode, onClose }) {
  return (
    <DialogTitle className={styles.dialogTitle}>
      <Box className={styles.titleContainer}>
        {isEditMode && <EditIcon className={styles.titleIcon} />}
        {isDeleteMode && <DeleteOutlineIcon className={styles.deleteIcon} />}
        <Typography variant="h6" className={styles.titleText}>
          {isEditMode ? 'Edit Task' : 'Delete Task'}
        </Typography>
      </Box>
      <IconButton
        aria-label="close"
        onClick={onClose}
        className={styles.closeButton}
        size="small"
      >
        <CloseIcon />
      </IconButton>
    </DialogTitle>
  );
}


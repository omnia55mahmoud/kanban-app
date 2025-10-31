'use client';

import styles from './TaskModal.module.css';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';

export default function ModalActions({ 
  onClose, 
  onConfirm, 
  isEditMode, 
  isDeleteMode,
  isDisabled 
}) {
  return (
    <DialogActions className={styles.dialogActions}>
      <Button 
        onClick={onClose} 
        className={styles.cancelButton}
        variant="outlined"
      >
        Cancel
      </Button>
      <Button
        onClick={onConfirm}
        className={isDeleteMode ? styles.deleteConfirmButton : styles.saveButton}
        variant="contained"
        disabled={isDisabled}
      >
        {isEditMode ? 'Save Changes' : 'Delete'}
      </Button>
    </DialogActions>
  );
}


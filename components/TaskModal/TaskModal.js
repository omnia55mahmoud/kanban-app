'use client';
import { useState, useEffect } from 'react';
import styles from './TaskModal.module.css';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import EditContent from './EditContent';
import DeleteContent from './DeleteContent';
import ModalActions from './ModalActions';
import ModalHeader from './ModalHeader';

export default function TaskModal({ 
  open, 
  onClose, 
  type, 
  task = null,
  onConfirm 
}) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  useEffect(() => {
    if (task && type === 'edit') {
      setTitle(task.title || '');
      setDescription(task.description || '');
    } else {
      setTitle('');
      setDescription('');
    }
  }, [task, type, open]);

  const handleClose = () => {
    setTitle('');
    setDescription('');
    onClose();
  };

  const handleConfirm = () => {
    if (type === 'edit') {
      onConfirm({ title, description });
    } else {
      onConfirm();
    }
    handleClose();
  };

  const isEditMode = type === 'edit';
  const isDeleteMode = type === 'delete';

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
      className={styles.dialog}
      PaperProps={{
        className: styles.dialogPaper
      }}
    >
      <ModalHeader
        isEditMode={isEditMode}
        isDeleteMode={isDeleteMode}
        onClose={handleClose}
      />

      <DialogContent className={styles.dialogContent}>
        {isEditMode ? (
          <EditContent
            title={title}
            description={description}
            onTitleChange={(e) => setTitle(e.target.value)}
            onDescriptionChange={(e) => setDescription(e.target.value)}
          />
        ) : (
          <DeleteContent task={task} />
        )}
      </DialogContent>

      <ModalActions
        onClose={handleClose}
        onConfirm={handleConfirm}
        isEditMode={isEditMode}
        isDeleteMode={isDeleteMode}
        isDisabled={isEditMode && (!title.trim() || !description.trim())}
      />
    </Dialog>
  );
}
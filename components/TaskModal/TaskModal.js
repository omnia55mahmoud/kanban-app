'use client';
import { useState, useEffect, useRef } from 'react';
import styles from './TaskModal.module.css';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import Grow from '@mui/material/Grow';
import EditContent from './EditContent';
import DeleteContent from './DeleteContent';
import ModalActions from './ModalActions';
import ModalHeader from './ModalHeader';

const Transition = (props) => {
  return (
    <Grow
      {...props}
      style={{
        transformOrigin: 'center center',
      }}
    />
  );
};

export default function TaskModal({ 
  open, 
  onClose, 
  type, 
  task = null,
  onConfirm 
}) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const stableTypeRef = useRef(type);

  useEffect(() => {
    if (type) {
      stableTypeRef.current = type;
    }
  }, [type]);

  useEffect(() => {
    const currentType = open ? type : stableTypeRef.current;
    if (task && currentType === 'edit') {
      setTitle(task.title || '');
      setDescription(task.description || '');
    } else {
      setTitle('');
      setDescription('');
    }
  }, [task, type, open]);

  const handleClose = () => {
    setTimeout(() => {
      setTitle('');
      setDescription('');
      stableTypeRef.current = null;
    }, 300);
    onClose();
  };

  const handleConfirm = () => {
    const currentType = open ? type : stableTypeRef.current;
    if (currentType === 'edit') {
      onConfirm({ title, description });
    } else {
      onConfirm();
    }
    handleClose();
  };

  const currentType = open ? type : stableTypeRef.current;
  const isEditMode = currentType === 'edit';
  const isDeleteMode = currentType === 'delete';

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
      className={styles.dialog}
      TransitionComponent={Transition}
      TransitionProps={{
        timeout: 300,
      }}
      slotProps={{
        backdrop: {
          timeout: 300,
          sx: {
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            backdropFilter: 'blur(4px)',
          }
        }
      }}
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
'use client';

import styles from './Search.module.css';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import SearchIcon from '@mui/icons-material/Search';
import Button from '@mui/material/Button';
import { useState } from 'react';

export default function Search({ onSearch, onAddTask }) {
  const [searchTerm, setSearchTerm] = useState('');
   const handleChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    if (onSearch) {
      onSearch(value);
    }
  };

  const handleAddTask = () => {
    if (onAddTask) {
      onAddTask();
    }
  };

  return (
    <div className={styles.searchContainer} suppressHydrationWarning>
      <TextField
        id="search-input"
        type="text"
        placeholder={"Search by task title or description"}
        className={styles.searchInput}
        onChange={handleChange}
        fullWidth
        variant="outlined"
        sx={{
          '& .MuiOutlinedInput-root': {
            height: '36px'
          }
        }}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <SearchIcon className={styles.searchIcon} />
            </InputAdornment>
          ),
        }}
        inputProps={{
          suppressHydrationWarning: true
        }}
      />
      <Button 
        variant="contained" 
        className={styles.addButton}
        sx={{ 
          minWidth: { xs: '100px', sm: '120px' },
          height: '36px',
          ml: { xs: 1, sm: 2 }
        }}
        suppressHydrationWarning
        onClick={handleAddTask}
      >
        Add Task
      </Button>
    </div>
  );
}


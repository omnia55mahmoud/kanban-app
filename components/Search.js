'use client';

import styles from './Search.module.css';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import SearchIcon from '@mui/icons-material/Search';
import Button from '@mui/material/Button';

export default function Search({ placeholder = "Search by task title or description", onSearch }) {
  const handleChange = (e) => {
    if (onSearch) {
      onSearch(e.target.value);
    }
  };

  return (
    <div className={styles.searchContainer} suppressHydrationWarning>
      <TextField
        id="search-input"
        type="text"
        placeholder={placeholder}
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
      >
        Add Task
      </Button>
    </div>
  );
}


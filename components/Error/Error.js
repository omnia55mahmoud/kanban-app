'use client';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import Button from '@mui/material/Button';
import RefreshIcon from '@mui/icons-material/Refresh';

export default function Error({ error }) {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        padding: 3,
        backgroundColor: '#f5f5f5',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 2,
          padding: 4,
          backgroundColor: 'white',
          borderRadius: 2,
          boxShadow: 3,
          maxWidth: 500,
          textAlign: 'center',
        }}
      >
        <ErrorOutlineIcon
          sx={{
            fontSize: 64,
            color: 'error.main',
          }}
        />
        <Typography variant="h5" component="h2" color="error" fontWeight="bold">
          Oops! Something went wrong
        </Typography>
        <Button
          variant="contained"
          color="error"
          startIcon={<RefreshIcon />}
          onClick={() => window.location.reload()}
          sx={{ mt: 2 }}
        >
          Refresh Page
        </Button>
      </Box>
    </Box>
  );
}

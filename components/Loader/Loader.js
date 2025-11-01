import { Backdrop, CircularProgress, Box } from "@mui/material";

export default function Loader({ isLoading}) {
  return(
     <Backdrop
        open={isLoading}
        sx={{
          zIndex: (theme) => theme.zIndex.drawer + 1,
          backdropFilter: 'blur(4px)',
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
        }}
      >
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 2,
          }}
        >
          <CircularProgress 
            size={80} 
            thickness={4.5}
          />
        </Box>
      </Backdrop>
  )
}
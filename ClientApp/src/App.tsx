import React from 'react';
import Rectangle from './components/Rectangle';
import { CssBaseline, Box } from '@mui/material';

const App: React.FC = () => {
  return (
    <>
      <CssBaseline />
      <Box sx={{ 
        bgcolor: '#12001f', // Darker purple (changed from #1a002e)
        minHeight: '100vh',
        minWidth: '100vw',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        p: { xs: 2, sm: 4, md: 8 } // Responsive padding
      }}>
        <Rectangle />
      </Box>
    </>
  );
};

export default App;
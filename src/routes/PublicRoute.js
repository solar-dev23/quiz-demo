import React from 'react';
import { Box } from '@mui/material';

const PublicRoute = ({ children }) => {
  return (
    <>
      <Box sx={{ display: 'flex' }}>{children}</Box>
    </>
  );
};

export default PublicRoute;

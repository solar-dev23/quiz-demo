import React from 'react';
import { Typography } from '@mui/material';
import { GridOverlay } from '@mui/x-data-grid';
import { ReactComponent as EmptyOverlayGridSvg } from '../../assets/images/empty-overlay-grid.svg';

function EmptyOverlayGrid() {
  return (
    <GridOverlay
      sx={{
        display: 'flex',
        flexDirection: 'column',
        flexGrow: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 2,
        height: 70,
      }}
    >
      <EmptyOverlayGridSvg />
      <Typography variant="body1">No Rows</Typography>
    </GridOverlay>
  );
}

export default EmptyOverlayGrid;

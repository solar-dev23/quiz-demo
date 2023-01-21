import React from 'react';
import { Button, Dialog, DialogActions, DialogTitle } from '@mui/material';

function ConfirmDialog(props) {
  const { open, onClose, onSubmit, children } = props;

  return (
    <div>
      <Dialog open={open} onClose={onClose}>
        <DialogTitle id="alert-dialog-description">{children}</DialogTitle>
        <DialogActions sx={{ px: 4, py: 2 }}>
          <Button onClick={onClose}>Cancel</Button>
          <Button onClick={onSubmit} color="primary" variant="contained" autoFocus>
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default ConfirmDialog;

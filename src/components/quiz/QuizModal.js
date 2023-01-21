import React, { useEffect } from 'react';
import {
  Button,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@mui/material';
import { useFormik } from 'formik';
import * as yup from 'yup';

const validationSchema = yup.object({
  title: yup.string().required('Title is required'),
});

function QuizModal(props) {
  const { open, onClose, onSubmit, selected } = props;

  const initialValues = {
    title: '',
  };

  const formik = useFormik({
    initialValues,
    validationSchema: validationSchema,
    onSubmit: (values, actions) => {
      onSubmit(values);
      actions.resetForm({
        values: initialValues,
      });
    },
  });
  const { values, setFieldValue, touched, errors } = formik;

  useEffect(() => {
    if (!open) return;

    if (selected) {
      formik.resetForm({ values: selected });
    } else {
      formik.resetForm({
        values: { ...initialValues },
      });
    }
  }, [open, selected]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <Dialog open={open} onClose={onClose}>
      <form onSubmit={formik.handleSubmit}>
        <DialogTitle>{selected ? 'Edit' : 'New'} Quiz</DialogTitle>
        <DialogContent>
          <DialogContentText>
            To create or update your quiz topic, please enter the title here.
          </DialogContentText>
          <TextField
            margin="normal"
            fullWidth
            id="title"
            label="Title"
            name="title"
            autoFocus
            value={values.title}
            onChange={(e) => {
              setFieldValue('title', e.target.value);
            }}
            error={touched.title && Boolean(errors.title)}
            helperText={touched.title && errors.title}
          />
        </DialogContent>
        <DialogActions sx={{ px: 4, py: 2 }}>
          <Button onClick={onClose}>Cancel</Button>
          <Button type="submit" variant="contained">
            Save
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}

export default QuizModal;

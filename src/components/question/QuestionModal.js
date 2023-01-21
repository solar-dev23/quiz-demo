import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import {
  Box,
  Button,
  FormControlLabel,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  List,
  Radio,
  RadioGroup,
  Typography,
} from '@mui/material';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { toast } from 'react-toastify';

import AnswerOptionItem from './AnswerOptionItem';
import { QuestionTypes } from '../../constants';

const validationSchema = yup.object({
  title: yup.string().required('Title is required'),
  type: yup.string().required('Type is required'),
});

function QuestionModal(props) {
  const { open, onClose, onSubmit, selected } = props;
  const { selected: quiz } = useSelector((state) => state.quiz);
  const [options, setOptions] = useState([]);
  const [correctValues, setCorrectValues] = useState([]);

  const initialValues = {
    title: '',
    type: QuestionTypes.SINGLE,
  };

  const formik = useFormik({
    initialValues,
    validationSchema: validationSchema,
    onSubmit: (values, actions) => {
      const isValidQuestion = validateQuestion(values, options);
      if (!isValidQuestion) return;

      const answers = options.filter((a) => a.value !== '');
      onSubmit({ ...values, answers });
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
      setOptions(selected.answers);
    } else {
      formik.resetForm({
        values: { ...initialValues },
      });
      setOptions([]);
    }
  }, [open, selected]); // eslint-disable-line react-hooks/exhaustive-deps

  const validateQuestion = (question, answers) => {
    const filledAnswers = answers.filter((a) => a.value !== '');
    if (!question.type || question.type === '') {
      toast.error('Please choose question type.');
      return;
    }

    if (filledAnswers.length < 2) {
      toast.error('You should add at least 2 answer options.');
      return;
    }

    const correctAnswers = filledAnswers.filter((a) => a.correct);
    if (correctAnswers.length === 0) {
      toast.error('Please select at least 1 correct answer.');
      return;
    }

    if (question.type === QuestionTypes.SINGLE && correctAnswers.length > 1) {
      toast.error('You should only 1 correct answer in single mode question.');
      return;
    }

    const valueArr = answers.map((answer) => answer.value);
    var isDuplicate = valueArr.some((answer, idx) => valueArr.indexOf(answer) !== idx);
    if (isDuplicate) {
      toast.error('Some answer options are duplicated.');
      return;
    }

    return true;
  };

  const handleAddOption = () => {
    setOptions((prevOptions) => {
      return [
        ...prevOptions,
        {
          value: '',
          correct: false,
        },
      ];
    });
  };

  const handleChangeOption = (index, val) => {
    setOptions((prevOptions) =>
      prevOptions.map((o, i) => (i === index ? { ...o, value: val } : o)),
    );
  };

  const handleChangeCorrect = (index, checked) => {
    setOptions((prevOptions) =>
      prevOptions.map((o, i) =>
        i === index
          ? { ...o, correct: checked }
          : values.type === QuestionTypes.SINGLE
          ? { ...o, correct: false }
          : o,
      ),
    );
    setCorrectValues([checked]);
  };

  const handleDeleteOption = (index) => {
    setOptions((prevOptions) => prevOptions.filter((o, i) => i !== index));
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <form onSubmit={formik.handleSubmit}>
        <DialogTitle sx={{ px: 5 }}>{selected ? 'Edit' : 'New'} Question</DialogTitle>
        <DialogContent>
          <TextField
            sx={{ display: 'flex', flexGrow: 1, mx: 2 }}
            id="title"
            label="Question"
            name="title"
            autoFocus
            value={values.title}
            variant="standard"
            disabled={quiz.published}
            onChange={(e) => {
              setFieldValue('title', e.target.value);
            }}
            error={touched.title && Boolean(errors.title)}
            helperText={touched.title && errors.title}
          />
          <Box sx={{ display: 'flex', alignItems: 'center', mx: 2, mt: 2 }}>
            <Typography sx={{ marginRight: 2 }}>Type:</Typography>
            <RadioGroup
              row
              aria-labelledby="question-type"
              defaultValue={QuestionTypes.SINGLE}
              name="question-type"
              value={values.type}
              onChange={(e) => {
                setOptions((prevOptions) => prevOptions.map((o) => ({ ...o, correct: false })));
                setFieldValue('type', e.target.value);
              }}
            >
              <FormControlLabel
                value={QuestionTypes.SINGLE}
                control={<Radio disabled={quiz.published} />}
                label="Single"
              />
              <FormControlLabel
                value={QuestionTypes.MULTIPLE}
                control={<Radio disabled={quiz.published} />}
                label="Multiple"
              />
            </RadioGroup>
          </Box>
          <List sx={{ mt: 2 }}>
            {options.map((option, i) => (
              <AnswerOptionItem
                key={i}
                index={i}
                option={option}
                type={values.type}
                correctValues={correctValues}
                disabled={quiz.published}
                onChange={handleChangeOption}
                onChangeCorrect={handleChangeCorrect}
                onDelete={handleDeleteOption}
              />
            ))}
          </List>
          <Box sx={{ display: 'flex', alignItems: 'center', mx: 2 }}>
            <Button
              sx={{ textTransform: 'capitalize' }}
              variant="contained"
              disabled={options.length >= 5 || quiz.published}
              onClick={handleAddOption}
            >
              Add Answer
            </Button>
          </Box>
        </DialogContent>
        <DialogActions sx={{ px: 4, py: 2 }}>
          <Button onClick={onClose}>{quiz.published ? 'Close' : 'Cancel'}</Button>
          {!quiz.published && (
            <Button type="submit" variant="contained">
              Save
            </Button>
          )}
        </DialogActions>
      </form>
    </Dialog>
  );
}

export default QuestionModal;

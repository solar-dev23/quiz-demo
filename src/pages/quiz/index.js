import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { Box, Button, Container, IconButton, Typography } from '@mui/material';
import { toast } from 'react-toastify';

import QuestionList from '../../components/question/QuestionList';
import QuestionModal from '../../components/question/QuestionModal';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import Loading from '../../components/common/Loading';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { questionActions, quizActions } from '../../store';
import { MAX_QUESTION_COUNT } from '../../constants';
import { history } from '../../helpers';

function Quiz() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { selected: quiz } = useSelector((state) => state.quiz);
  const { list: questions, selected: selectedQuestion } = useSelector((state) => state.question);
  const [isOpen, setOpen] = useState(false);
  const [isDelete, setDelete] = useState(false);
  const [selected, setSelected] = useState(null);
  const [isPublish, setPublish] = useState(false);
  const numOfRemainQuestion = MAX_QUESTION_COUNT - questions.length;

  // Get Quiz by Id
  useEffect(() => {
    if (!id) return;

    dispatch(quizActions.getById(id));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  // Edit Question
  useEffect(() => {
    if (!selectedQuestion.id) return;

    if (selectedQuestion.editing) {
      setOpen(true);
      setSelected(questions.find((q) => q._id === selectedQuestion.id));
    }

    if (selectedQuestion.deleting) {
      setDelete(true);
      setSelected(questions.find((q) => q._id === selectedQuestion.id));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedQuestion.id]);

  const handleOpenCreate = () => {
    setSelected(null);
    setOpen(true);
  };

  const handleSubmit = (question) => {
    if (!question._id) {
      dispatch(
        questionActions.create({
          qzId: id,
          data: { ...question, order: questions.length + 1 },
        }),
      );
    } else {
      dispatch(
        questionActions.update({
          qzId: id,
          data: question,
        }),
      );
    }
    setOpen(false);
    dispatch(questionActions.updateSelected({ id: null, editing: false }));
  };

  const handleDelete = () => {
    dispatch(questionActions.remove({ qzId: id, qsId: selected._id }));
    setDelete(false);
    dispatch(questionActions.updateSelected({ id: null, deleting: false }));
  };

  const handlePublish = () => {
    if (questions.length === 0) {
      toast.error('You should have at least 1 question to publish quiz.');
      return;
    }

    setPublish(false);
    dispatch(quizActions.publish(id));
  };

  const handleBack = () => {
    history.navigate('/');
  };

  if (!quiz) return <Loading />;

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Container maxWidth="xl">
        <Box sx={{ display: 'flex', justifyContent: 'space-between' }} my={5} px={2}>
          <IconButton onClick={handleBack} sx={{ width: 40, height: 40 }}>
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h5" sx={{ flexGrow: 1, display: 'flex', alignItems: 'center' }}>
            {quiz.title}
          </Typography>
          <Button
            sx={{ textTransform: 'capitalize', marginRight: 2, height: 40, minWidth: 100 }}
            variant="contained"
            color="primary"
            disabled={quiz.published}
            onClick={handlePublish}
          >
            {quiz.published ? 'Published' : 'Publish'}
          </Button>
          <Button
            sx={{ textTransform: 'capitalize', height: 40, minWidth: 150 }}
            variant="contained"
            color="primary"
            disabled={questions.length >= 10 || quiz.published}
            onClick={handleOpenCreate}
          >
            Add Question ({numOfRemainQuestion})
          </Button>
        </Box>
        <Box>
          <QuestionList quizId={id} />
        </Box>
      </Container>
      <QuestionModal
        open={isOpen}
        onClose={() => {
          dispatch(questionActions.updateSelected({ id: null, editing: false }));
          setOpen(false);
        }}
        onSubmit={handleSubmit}
        selected={selected}
      />
      <ConfirmDialog
        open={isDelete}
        onClose={() => {
          dispatch(questionActions.updateSelected({ id: null, deleting: false }));
          setDelete(false);
        }}
        onSubmit={handleDelete}
      >
        Are you sure you want to delete this question?
      </ConfirmDialog>
      <ConfirmDialog open={isPublish} onClose={() => setPublish(false)} onSubmit={handlePublish}>
        Are you sure you want to publish this quiz?
      </ConfirmDialog>
    </Box>
  );
}

export default Quiz;

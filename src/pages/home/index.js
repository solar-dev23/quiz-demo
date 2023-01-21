import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Box, Button, Container, Typography } from '@mui/material';
import { authActions, quizActions } from '../../store';
import QuizGrid from '../../components/quiz/QuizGrid';
import QuizModal from '../../components/quiz/QuizModal';
import ConfirmDialog from '../../components/common/ConfirmDialog';

function Home() {
  const dispatch = useDispatch();
  const { list: quizzes, totalCount, loading, error } = useSelector((state) => state.quiz);
  const [isOpen, setOpen] = useState(false);
  const [selected, setSelected] = useState(null);
  const [isDelete, setDelete] = useState(false);
  const [isPublish, setPublish] = useState(false);

  useEffect(() => {
    if (!error) return;

    if (error.message === 'User does not exist.') {
      dispatch(authActions.logout());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [error]);

  const handleOpenCreate = () => {
    setSelected(null);
    setOpen(true);
  };

  const handleOpenEdit = (data) => {
    setSelected(data);
    setOpen(true);
  };

  const handleSubmit = (quiz) => {
    if (!quiz._id) {
      dispatch(quizActions.create(quiz));
    } else {
      dispatch(quizActions.update(quiz));
    }
    setOpen(false);
  };

  const handleOpenDelete = (data) => {
    setSelected(data);
    setDelete(true);
  };

  const handleDelete = () => {
    dispatch(quizActions.remove(selected._id));
    setDelete(false);
  };

  const handleOpenPublish = (data) => {
    setSelected(data);
    setPublish(true);
  };

  const handlePublish = () => {
    dispatch(quizActions.publish(selected._id));
    setPublish(false);
  };

  const handleChangePage = (page, pageSize) => {
    dispatch(quizActions.getList({ page, pageSize }));
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Container maxWidth="xl">
        <Box sx={{ display: 'flex', justifyContent: 'space-between' }} my={2} px={2}>
          <Typography variant="h5">Quizzes</Typography>
          <Button
            sx={{ textTransform: 'capitalize' }}
            variant="contained"
            color="primary"
            onClick={handleOpenCreate}
          >
            New Quiz
          </Button>
        </Box>
        <Box display="flex" my={2}>
          <QuizGrid
            rows={quizzes}
            rowCount={totalCount}
            loading={loading}
            onPublish={handleOpenPublish}
            onEdit={handleOpenEdit}
            onDelete={handleOpenDelete}
            onChangePage={handleChangePage}
          />
        </Box>
      </Container>
      <QuizModal
        open={isOpen}
        onClose={() => setOpen(false)}
        onSubmit={handleSubmit}
        selected={selected}
      />
      <ConfirmDialog open={isDelete} onClose={() => setDelete(false)} onSubmit={handleDelete}>
        Are you sure you want to delete this quiz?
      </ConfirmDialog>
      <ConfirmDialog open={isPublish} onClose={() => setPublish(false)} onSubmit={handlePublish}>
        Are you sure you want to publish this quiz?
      </ConfirmDialog>
    </Box>
  );
}

export default Home;

import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import {
  Button,
  Box,
  Checkbox,
  Container,
  FormControlLabel,
  List,
  ListItem,
  ListItemText,
  Paper,
  Radio,
  Typography,
  RadioGroup,
} from '@mui/material';
import { quizActions } from '../../store';
import { QuestionTypes } from '../../constants';

function PublicQuiz() {
  const { pId } = useParams();
  const dispatch = useDispatch();
  const { public: data, loading, done, result: resultMsg } = useSelector((state) => state.quiz);
  const [result, setResult] = useState([]);
  const [step, setStep] = useState(-1);
  const [disableNext, setDisableNext] = useState(true);

  useEffect(() => {
    if (!pId) return;

    dispatch(quizActions.getByPermalink(pId));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pId]);

  const handleStart = () => {
    setStep(0);
    setDisableNext(true);
    dispatch(quizActions.startQuiz(pId));
  };

  const handleNext = () => {
    setStep(step + 1);
    setDisableNext(true);
  };

  const handleUpdateSingle = (qId, value) => {
    setResult((prevResult) => {
      let question = prevResult.find((pr) => pr.qId === qId);
      if (question) {
        question.answerIds = [value];
        return prevResult.map((pr) => (pr.qId === qId ? question : pr));
      } else {
        return [...prevResult, { qId, answerIds: [value] }];
      }
    });
    setDisableNext(false);
  };

  const handleUpdateMultiple = (qId, aId, value) => {
    setResult((prevResult) => {
      let question = prevResult.find((pr) => pr.qId === qId);
      if (question) {
        if (value && !question.answerIds.includes(aId)) question.answerIds.push(aId);

        if (!value && question.answerIds.includes(aId))
          question.answerIds = question.answerIds.filter((id) => id !== aId);

        setDisableNext(question.answerIds.length > 0 ? false : true);
        return prevResult.map((pr) => (pr.qId === qId ? question : pr));
      } else {
        setDisableNext(value ? false : true);
        return value ? [...prevResult, { qId, answerIds: [aId] }] : prevResult;
      }
    });
  };

  const handleSubmit = () => {
    dispatch(quizActions.submitResult({ pId, data: result }));
  };

  const renderStart = () => {
    return (
      <>
        <Typography textAlign="center">
          This quiz has <b>{data?.questions.length}</b> questions. You cannot pause the test once
          you started. <br></br>If you are ready, please click the "Start" button below.
        </Typography>
        <Button variant="contained" sx={{ width: 100, mt: 2 }} onClick={handleStart}>
          Start
        </Button>
      </>
    );
  };

  const renderDone = () => {
    return (
      <>
        <Typography variant="h4">Done!</Typography>
        <Typography variant="body1">{resultMsg}</Typography>
      </>
    );
  };

  const renderQuestion = (step) => {
    const question = data.questions[step];
    return (
      <>
        <Typography textAlign="center">{question.title}</Typography>
        {question.type === QuestionTypes.MULTIPLE && (
          <Typography textAlign="center" sx={{ fontSize: '0.8em', color: 'red' }}>
            Select all that apply
          </Typography>
        )}
        {question.type === QuestionTypes.SINGLE && (
          <RadioGroup
            aria-labelledby="answer-group-label"
            name="answer-group-label"
            onChange={(e) => handleUpdateSingle(question._id, e.target.value)}
          >
            {question.answers.map((answer) => (
              <FormControlLabel
                key={answer._id}
                value={answer._id}
                control={<Radio />}
                label={answer.value}
              />
            ))}
          </RadioGroup>
        )}
        {question.type === QuestionTypes.MULTIPLE && (
          <List>
            {question.answers.map((answer) => (
              <ListItem key={answer._id} sx={{ p: 0 }}>
                <Checkbox
                  onChange={(e) => handleUpdateMultiple(question._id, answer._id, e.target.checked)}
                  name="correct-radio"
                />

                <ListItemText>{answer.value}</ListItemText>
              </ListItem>
            ))}
          </List>
        )}
        {step < data.questions.length - 1 ? (
          <Button
            variant="contained"
            sx={{ width: 150, mt: 2 }}
            disabled={disableNext}
            onClick={handleNext}
          >
            Next ({step + 1}/{data.questions.length})
          </Button>
        ) : (
          <Button
            variant="contained"
            color="secondary"
            sx={{ width: 100, mt: 2 }}
            disabled={disableNext}
            onClick={handleSubmit}
          >
            Submit
          </Button>
        )}
      </>
    );
  };

  if (loading) return null;

  return (
    <>
      <Box sx={{ flexGrow: 1 }}>
        <Container maxWidth="md" sx={{ mt: 12 }}>
          <Typography variant="h4" textAlign="center" mb={2}>
            {data?.quiz.title}
          </Typography>
          <Paper
            elevation={6}
            sx={{
              display: 'flex',
              flexDirection: 'column',
              minHeight: 500,
              p: 5,
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            {done ? renderDone() : step === -1 ? renderStart() : renderQuestion(step)}
          </Paper>
        </Container>
      </Box>
    </>
  );
}

export default PublicQuiz;

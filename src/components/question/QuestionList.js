import React, { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Box, Typography } from '@mui/material';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import update from 'immutability-helper';
import QuestionListItem from './QuestionListItem';
import { questionActions } from '../../store';

function QuestionList(props) {
  const { quizId } = props;
  const dispatch = useDispatch();
  const questions = useSelector((state) => state.question.list);
  const { selected: quiz } = useSelector((state) => state.quiz);
  const [items, setItems] = useState([]);
  const [dropped, setDropped] = useState(false);

  useEffect(() => {
    if (!quizId) return;

    dispatch(questionActions.getList(quizId));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [quizId]);

  useEffect(() => {
    setItems(questions);
  }, [questions]);

  useEffect(() => {
    if (!dropped) return;

    const reordered = items.map((item, index) => ({ ...item, order: index + 1 }));
    dispatch(questionActions.reorder({ qzId: quizId, data: reordered }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dropped]);

  const handleMoveItem = useCallback((dragIndex, hoverIndex) => {
    setItems((prevItems) =>
      update(prevItems, {
        $splice: [
          [dragIndex, 1],
          [hoverIndex, 0, prevItems[dragIndex]],
        ],
      }),
    );
    setDropped(false);
  }, []);

  const handleDropItem = useCallback((dropIndex, hoverIndex) => {
    setItems((prevItems) =>
      update(prevItems, {
        $splice: [
          [dropIndex, 1],
          [hoverIndex, 0, prevItems[dropIndex]],
        ],
      }),
    );
    setDropped(true);
  }, []);

  const renderItem = useCallback((item, index) => {
    return (
      <QuestionListItem
        key={item._id}
        index={index}
        id={item._id}
        text={item.title}
        quizPublished={quiz.published}
        onMove={handleMoveItem}
        onDrop={handleDropItem}
      />
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <DndProvider backend={HTML5Backend}>
      {items.length === 0 ? (
        <Typography textAlign="center">There is no question in this quiz.</Typography>
      ) : (
        <Box>{items.map((item, i) => renderItem(item, i))}</Box>
      )}
    </DndProvider>
  );
}

export default QuestionList;

import React, { useRef } from 'react';
import { useDispatch } from 'react-redux';
import { useDrag, useDrop } from 'react-dnd';
import { ListItem, ListItemButton, ListItemText, ListItemIcon, Paper } from '@mui/material';
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { questionActions } from '../../store';

const QuestionListItem = (props) => {
  const { id, text, index, quizPublished, onMove, onDrop } = props;
  const ref = useRef(null);
  const dispatch = useDispatch();

  const [{ handlerId }, drop] = useDrop({
    accept: 'item',
    collect(monitor) {
      return {
        handlerId: monitor.getHandlerId(),
      };
    },
    hover(item, monitor) {
      if (!ref.current) {
        return;
      }

      const dragIndex = item.index;
      const hoverIndex = index;

      if (dragIndex === hoverIndex) {
        return;
      }

      const hoverBoundingRect = ref.current?.getBoundingClientRect();
      const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
      const clientOffset = monitor.getClientOffset();
      const hoverClientY = clientOffset.y - hoverBoundingRect.top;

      if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
        return;
      }

      if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
        return;
      }

      onMove(dragIndex, hoverIndex);
      item.index = hoverIndex;
    },
    drop(item) {
      onDrop(item.index, index);
    },
  });

  const [{ isDragging }, drag] = useDrag({
    type: 'item',
    canDrag: quizPublished ? false : true,
    item: () => {
      return { id, index };
    },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });
  const opacity = isDragging ? 0 : 1;
  drag(drop(ref));

  const handleEdit = () => {
    dispatch(questionActions.updateSelected({ id, editing: true }));
  };

  const handleDelete = () => {
    dispatch(questionActions.updateSelected({ id, deleting: true }));
  };

  return (
    <>
      <Paper
        elevation={5}
        sx={{ marginBottom: 2, opacity, cursor: !quizPublished ? 'move' : 'initial' }}
        ref={ref}
        data-handler-id={handlerId}
      >
        <ListItem>
          {!quizPublished && (
            <ListItemIcon>
              <DragIndicatorIcon />
            </ListItemIcon>
          )}
          <ListItemText sx={{ flexGrow: 1 }} primary={text} />
          {quizPublished ? (
            <ListItemButton sx={{ flexGrow: 'inherit' }} onClick={handleEdit}>
              <VisibilityIcon />
            </ListItemButton>
          ) : (
            <>
              <ListItemButton sx={{ flexGrow: 'inherit' }} onClick={handleEdit}>
                <EditIcon />
              </ListItemButton>
              <ListItemButton sx={{ flexGrow: 'inherit' }} onClick={handleDelete}>
                <DeleteIcon />
              </ListItemButton>
            </>
          )}
        </ListItem>
      </Paper>
    </>
  );
};

export default QuestionListItem;

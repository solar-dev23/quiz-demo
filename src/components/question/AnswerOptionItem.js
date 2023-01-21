import React from 'react';
import { Checkbox, ListItem, IconButton, Radio, TextField } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

import { QuestionTypes } from '../../constants';

function AnswerOptionItem(props) {
  const { option, index, type, correctValues, disabled, onChange, onChangeCorrect, onDelete } =
    props;

  return (
    <ListItem>
      <TextField
        sx={{ minWidth: 300, marginRight: 3 }}
        id="option"
        name="option"
        placeholder="Input answer option"
        variant="standard"
        value={option.value}
        disabled={disabled}
        onChange={(e) => onChange(index, e.target.value)}
      />
      {type === QuestionTypes.SINGLE && (
        <Radio
          checked={option.correct}
          disabled={disabled}
          onChange={(e) => onChangeCorrect(index, e.target.checked)}
          value={correctValues[0]}
          name="correct-radio"
        />
      )}
      {type === QuestionTypes.MULTIPLE && (
        <Checkbox
          checked={option.correct}
          disabled={disabled}
          onChange={(e) => onChangeCorrect(index, e.target.checked)}
          value={correctValues[index]}
          name="correct-checkbox"
        />
      )}
      <IconButton sx={{ width: 40 }} disabled={disabled} onClick={() => onDelete(index)}>
        <DeleteIcon />
      </IconButton>
    </ListItem>
  );
}

export default AnswerOptionItem;

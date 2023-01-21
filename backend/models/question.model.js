import mongoose from 'mongoose';
import { QuestionTypes } from '../core/constants';

const questionSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      required: true,
      enum: [QuestionTypes.SINGLE, QuestionTypes.MULTIPLE],
      default: QuestionTypes.SINGLE,
    },
    order: {
      type: Number,
      required: true,
    },
    quiz: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Quiz',
      required: true,
    },
    answers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Answer',
      },
    ],
  },
  {
    timestamps: true,
  },
);

const Question = mongoose.model('Question', questionSchema);

export default Question;

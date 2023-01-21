import mongoose from 'mongoose';

const answerSchema = new mongoose.Schema(
  {
    value: {
      type: String,
      required: true,
    },
    correct: {
      type: Boolean,
      required: true,
      default: false,
    },
    question: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Question',
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

const Answer = mongoose.model('Answer', answerSchema);

export default Answer;

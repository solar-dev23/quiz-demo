import mongoose from 'mongoose';

const quizSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    published: {
      type: Boolean,
      required: true,
      default: false,
    },
    permalinkId: {
      type: String,
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    online: {
      type: Number,
      default: 0,
    },
    questions: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Question',
      },
    ],
  },
  {
    timestamps: true,
  },
);

const Quiz = mongoose.model('Quiz', quizSchema);

export default Quiz;

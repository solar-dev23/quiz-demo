import Question from '../models/question.model';
import Answer from '../models/answer.model';
import Quiz from '../models/quiz.model';
import { to, ReS, ReE } from '../services/utils.service';
import { MAX_QUESTION_COUNT, QuestionTypes } from '../core/constants';

const questionController = {
  create: async (req, res) => {
    const { qzId } = req.params;
    let err, quiz, question, questions, answers;

    [err, quiz] = await to(Quiz.findById(qzId));
    if (err) return ReE(res, err.message, 400);
    if (!qzId || !quiz) return ReE(res, 'Quiz ID is invalid.', 400);

    const { answers: answersParam, ...data } = req.body;
    data.quiz = qzId;

    if (!answersParam || answersParam.length < 2) {
      return ReE(res, { message: 'Please choose at least 2 answer options.' }, 400);
    }
    const correctAnswers = answersParam.filter((answer) => answer.correct);
    if (correctAnswers.length === 0) {
      return ReE(res, { message: 'Please choose at least one correct answer.' }, 400);
    }

    if (data.type === QuestionTypes.SINGLE && correctAnswers.length > 1) {
      return ReE(
        res,
        { message: 'You should choose only one correct answer about this question.' },
        400,
      );
    }

    [err, questions] = await to(Question.find({ quiz: { $eq: qzId } }));
    if (err) return ReE(res, err.message, 400);
    if (questions.length === MAX_QUESTION_COUNT) {
      return ReE(
        res,
        { message: `You cannot add more than ${MAX_QUESTION_COUNT} questions ` },
        400,
      );
    }

    [err, question] = await to(Question.create(data));
    if (err) return ReE(res, err.message, 400);

    quiz.questions.push(question._id);
    [err, quiz] = await to(quiz.save());
    if (err) return ReE(res, err.message, 400);

    if (answersParam && answersParam.length > 0) {
      const answerData = answersParam.map((answer) => ({
        ...answer,
        question: question._id,
      }));

      [err, answers] = await to(Answer.insertMany(answerData));
      if (err) return ReE(res, err.message, 400);

      [err, question] = await to(
        Question.findByIdAndUpdate(
          question._id,
          {
            $set: {
              answers: answers.map((answer) => answer._id),
            },
          },
          { new: true },
        ).populate('answers'),
      );
    }
    if (err) return ReE(res, err.message, 400);

    return ReS(res, { data: question }, 201);
  },

  list: async (req, res) => {
    const { qzId } = req.params;
    let err, list, quiz;

    [err, quiz] = await to(Quiz.findById(qzId).lean());
    if (err) return ReE(res, err.message, 400);
    if (!qzId || !quiz) return ReE(res, 'Quiz ID is invalid.', 400);

    [err, list] = await to(
      Question.find({ quiz: { $eq: qzId } })
        .sort({ order: 1 })
        .populate('answers'),
    );
    if (err) return ReE(res, err.message, 400);

    return ReS(res, { data: list }, 200);
  },

  update: async (req, res) => {
    const { qzId, qsId } = req.params;
    let err, quiz, question, answers;

    [err, quiz] = await to(Quiz.findById(qzId).lean());
    if (err) return ReE(res, err.message, 400);
    if (!qzId || !quiz) return ReE(res, 'Quiz ID is invalid.', 400);

    const { answers: answersParam, ...data } = req.body;
    data.quiz = qzId;

    [err, question] = await to(Question.findById(qsId));
    if (!question) return ReE(res, 'This question does not exist.', 404);
    if (err) return ReE(res, err.message, 400);

    if (!answersParam || answersParam.length < 2) {
      return ReE(res, 'Please add at least 2 answer options.');
    }
    const correctAnswers = answersParam.filter((answer) => answer.correct);
    if (correctAnswers.length === 0) {
      return ReE(res, { message: 'Please choose at least one correct answer.' }, 400);
    }

    if (data.type === QuestionTypes.SINGLE && correctAnswers.length > 1) {
      return ReE(
        res,
        { message: 'You should choose only one correct answer about this question.' },
        400,
      );
    }

    // Remove and add answers
    [err] = await to(Answer.deleteMany({ question: question._id }));
    if (err) return ReE(res, err.message, 400);
    const answerData = answersParam.map((answer) => ({
      ...answer,
      question: question._id,
    }));
    [err, answers] = await to(Answer.insertMany(answerData));
    if (err) return ReE(res, err.message, 400);

    [err, question] = await to(
      Question.findByIdAndUpdate(
        qsId,
        {
          $set: { ...data, answers: answers.map((answer) => answer._id) },
        },
        { new: true },
      ).populate('answers'),
    );
    if (err) return ReE(res, err.message, 400);

    return ReS(res, { data: question }, 200);
  },

  remove: async (req, res) => {
    const { qzId, qsId } = req.params;
    let err, quiz, question;

    [err, quiz] = await to(Quiz.findById(qzId));
    if (err) return ReE(res, err.message, 400);
    if (!qzId || !quiz) return ReE(res, 'Quiz ID is invalid.', 400);

    [err, question] = await to(Question.findById(qsId));
    if (!question) return ReE(res, 'This question does not exist.', 404);
    if (err) return ReE(res, err.message, 400);

    quiz.questions = quiz.questions.filter((q) => q.toString() !== qsId);
    [err, quiz] = await to(quiz.save());
    if (err) return ReE(res, err.message, 400);

    [err] = await to(Answer.deleteMany({ question: { $eq: qsId } }));
    if (err) return ReE(res, err.message, 400);

    [err] = await to(question.remove());
    if (err) return ReE(res, err.message, 400);

    return ReS(res, { message: 'Question has been removed successfully.' }, 200);
  },

  reorder: async (req, res) => {
    const { qzId } = req.params;
    let err, quiz;

    [err, quiz] = await to(Quiz.findById(qzId).lean());
    if (err) return ReE(res, err.message, 400);
    if (!qzId || !quiz) return ReE(res, 'Quiz ID is invalid.', 400);

    let promises = [];
    const data = req.body;
    for (const question of data) {
      promises.push(
        await to(
          Question.findByIdAndUpdate(
            question._id,
            {
              $set: question,
            },
            { new: true },
          ).lean(),
        ),
      );
    }

    Promise.all(promises)
      .then((result) => {
        return ReS(res, { message: 'Questions were reordered successfully.' }, 200);
      })
      .catch((err) => {
        return ReE(res, err.message, 400);
      });
  },
};

export default questionController;

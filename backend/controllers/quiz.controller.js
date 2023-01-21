import randomstring from 'randomstring';
import Question from '../models/question.model';
import Quiz from '../models/quiz.model';
import Answer from '../models/answer.model';
import { to, ReS, ReE } from '../services/utils.service';
import { PAGE_SIZE } from '../core/constants';

const quizController = {
  create: async (req, res) => {
    const user = req.user;
    const data = req.body;
    data.author = user;

    let err, quiz;
    [err, quiz] = await to(Quiz.create(data));
    if (err) return ReE(res, err.message, 400);

    [err, quiz] = await to(quiz.populate('author', '-password'));
    if (err) return ReE(res, err.message, 400);

    return ReS(res, { data: quiz }, 201);
  },

  list: async (req, res) => {
    const user = req.user;
    const { page = 1, limit = PAGE_SIZE } = req.query;
    const skipIndex = (page - 1) * limit;

    let err, list, totalCount;
    [err, list] = await to(
      Quiz.find({ author: { $eq: user._id } })
        .limit(limit)
        .skip(skipIndex)
        .populate('author', '-password'),
    );
    if (err) return ReE(res, err.message, 400);

    [err, totalCount] = await to(Quiz.countDocuments({ author: { $eq: user._id } }));
    if (err) return ReE(res, err.message, 400);

    return ReS(res, { data: list, totalCount }, 200);
  },

  getOne: async (req, res) => {
    const { id } = req.params;

    let err, quiz;
    [err, quiz] = await to(Quiz.findById(id));
    if (!quiz) return ReE(res, 'This quiz does not exist.', 404);
    if (err) return ReE(res, err.message, 400);

    return ReS(res, { data: quiz }, 200);
  },

  update: async (req, res) => {
    const { id } = req.params;
    const data = req.body;

    let err, quiz;
    [err, quiz] = await to(Quiz.findById(id));
    if (!quiz) return ReE(res, 'This quiz does not exist.', 404);
    if (err) return ReE(res, err.message, 400);

    if (quiz.published) {
      return ReE(res, "You couldn't update the published quiz.", 400);
    }

    [err, quiz] = await to(
      Quiz.findByIdAndUpdate(
        id,
        {
          $set: data,
        },
        { new: true },
      ).populate('author', '-password'),
    );
    if (err) return ReE(res, err.message, 400);

    return ReS(res, { data: quiz }, 200);
  },

  publish: async (req, res) => {
    const { id } = req.params;

    let err, quiz;
    [err, quiz] = await to(Quiz.findById(id));
    if (!quiz) return ReE(res, 'This quiz does not exist.', 404);
    if (err) return ReE(res, err.message, 400);

    if (quiz.published && quiz.permalinkId) {
      return ReS(
        res,
        {
          data: { permalinkId: quiz.permalinkId },
          message: 'This quiz already has been published.',
        },
        200,
      );
    }

    if (quiz.questions.length === 0) {
      return ReS(
        res,
        {
          message: 'You should add at least 1 question to publish this quiz.',
        },
        400,
      );
    }

    const permalink = randomstring.generate(6);

    [err, quiz] = await to(
      Quiz.findByIdAndUpdate(
        id,
        {
          $set: { published: true, permalinkId: permalink },
        },
        { new: true },
      ),
    );
    if (err) return ReE(res, err.message, 400);

    return ReS(
      res,
      {
        data: { permalinkId: quiz.permalinkId },
        message: 'This quiz has been published successfully.',
      },
      200,
    );
  },

  remove: async (req, res) => {
    const { id } = req.params;

    let err, quiz, questions;
    [err, quiz] = await to(Quiz.findById(id));
    if (!quiz) return ReE(res, 'This quiz does not exist.', 404);
    if (err) return ReE(res, err.message, 400);

    if (quiz.online > 0) {
      return ReE(
        res,
        `This quiz cannot be removed because it's being processed by ${quiz.online} people now.`,
        400,
      );
    }

    [err, questions] = await to(Question.find({ quiz: id }).select('_id'));
    if (err) return ReE(res, err.message, 400);
    [err] = await to(Answer.deleteMany({ question: { $in: questions } }));

    [err] = await to(Question.deleteMany({ quiz: { $eq: id } }));
    if (err) return ReE(res, err.message, 400);

    [err] = await to(quiz.remove());
    if (err) return ReE(res, err.message, 400);

    return ReS(res, { message: 'Quiz has been removed successfully.' }, 200);
  },

  getPublished: async (req, res) => {
    const { pId } = req.params;
    if (!pId) return ReE(res, 'Permalink ID is required.', 400);

    let err, quiz, questions;
    [err, quiz] = await to(Quiz.findOne({ permalinkId: pId }));
    if (err) return ReE(res, err.message, 400);
    if (!quiz) return ReE(res, 'This quiz does not exist.', 404);

    [err, questions] = await to(
      Question.find({ quiz: quiz._id }).sort({ order: 1 }).populate('answers').lean(),
    );

    return ReS(res, { data: { quiz, questions } }, 200);
  },

  start: async (req, res) => {
    const { pId } = req.params;
    if (!pId) return ReE(res, 'Permalink ID is required.', 400);

    let err, quiz;
    [err, quiz] = await to(Quiz.findOne({ permalinkId: pId }));
    if (err) return ReE(res, err.message, 400);
    if (!quiz) return ReE(res, 'This quiz does not exist.', 404);

    if (!quiz.published) {
      return ReE(res, 'This quiz was not published yet.', 400);
    }

    quiz.online++;
    [err, quiz] = await to(quiz.save());
    if (err) return ReE(res, err.message, 400);

    return ReS(res, { message: 'The quiz was started.' }, 200);
  },

  evaluate: async (req, res) => {
    const { pId } = req.params;
    if (!pId) return ReE(res, 'Permalink ID is required.', 400);

    let err, quiz, questions;
    [err, quiz] = await to(Quiz.findOne({ permalinkId: pId }));
    if (err) return ReE(res, err.message, 400);
    if (!quiz) return ReE(res, 'This quiz does not exist.', 404);

    quiz.online--;
    [err, quiz] = await to(quiz.save());
    if (err) return ReE(res, err.message, 400);

    [err, questions] = await to(Question.find({ quiz: quiz._id }).populate('answers').lean());
    if (err) return ReE(res, err.message, 400);

    const data = req.body;
    let correctCount = 0;
    try {
      for (const q of data) {
        const question = questions.find((question) => question._id.toString() === q.qId);
        const correctAnswerIds = question.answers
          .filter((a) => a.correct)
          .map((answer) => answer._id.toString());
        const isCorrectMatched = correctAnswerIds.every((id) => q.answerIds.includes(id));

        if (isCorrectMatched) {
          correctCount++;
        }
      }
    } catch (error) {
      return ReE(res, { message: 'Your operation was failed.' }, 400);
    }

    return ReS(res, {
      message: `You answered ${correctCount}/${questions.length} questions correctly.`,
    });
  },
};

export default quizController;

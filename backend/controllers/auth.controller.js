import validator from 'validator';
import User from '../models/user.model';
import { to, ReS, ReE } from '../services/utils.service';

const authController = {
  login: async (req, res) => {
    const { email, password } = req.body;
    if (!email) ReE(res, 'Please enter an email to login', 400);
    if (!password) ReE(res, 'Please enter a password to login', 400);

    let user, err;
    if (validator.isEmail(email)) {
      [err, user] = await to(User.findOne({ email: email }));
      if (!user) return ReE(res, 'User does not exist!', 404);
      if (err) return ReE(res, err.message, 400);
    } else {
      return ReE(res, 'Invalid email was entered', 400);
    }

    [err, user] = await to(user.comparePassword(password));
    if (err) return ReE(res, err, 400);

    let userObj = user.toJSON();
    return ReS(
      res,
      {
        data: {
          _id: userObj._id,
          firstName: userObj.firstName,
          lastName: userObj.lastName,
          email: userObj.email,
          token: user.getJWT(),
        },
      },
      200,
    );
  },

  signup: async (req, res) => {
    const { firstName, lastName, email, password } = req.body;
    if (!firstName) ReE(res, 'Please enter a first name to signup', 400);
    if (!lastName) ReE(res, 'Please enter a last name to signup', 400);
    if (!email) ReE(res, 'Please enter an email to signup', 400);
    if (!password) ReE(res, 'Please enter a password to signup', 400);

    if (!validator.isEmail(email)) {
      return ReE(res, 'Invalid email was entered', 400);
    }

    let err, user;
    [err, user] = await to(User.findOne({ email: email }));

    if (user) return ReE(res, 'User already exists!', 409);
    if (err) return ReE(res, err.message, 400);

    [err, user] = await to(User.create({ firstName, lastName, email, password }));
    if (err) return ReE(res, err.message, 400);

    return ReS(res, { message: 'Successfully created a new user.' }, 201);
  },
};

export default authController;

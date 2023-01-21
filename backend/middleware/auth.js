import jwt from 'jsonwebtoken';
import User from '../models/user.model';
import config from '../core/config';
import { to, ReE } from '../services/utils.service';

export const isAuthenticated = async (req, res, next) => {
  const token = req.headers['authorization'];

  if (!token) {
    return ReE(res, 'A token is required for authentication.', 401);
  }

  try {
    const decoded = jwt.verify(token.split(' ')[1], config.JWT_SECRET);
    let err, user;
    [err, user] = await to(User.findById(decoded.id));
    if (!user) return ReE(res, 'User does not exist.', 404);
    if (err) return ReE(res, err.message, 400);

    user = user.toJSON();
    delete user.password;

    req.user = user;
  } catch (err) {
    return ReE(res, 'Invalid token.', 401);
  }

  return next();
};

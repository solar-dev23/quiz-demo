import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

import config from '../core/config';
import { to, TE } from '../services/utils.service';

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      validate: {
        validator: function (v) {
          return /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/.test(v);
        },
        message: () =>
          `Must Contain 8 Characters, One Uppercase, One Lowercase, One Number and One Special Case Character`,
      },
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

userSchema.pre('save', function (next) {
  const user = this;

  // only hash the password if it has been modified (or is new)
  if (!user.isModified('password')) return next();

  // generate a salt
  bcrypt.genSalt(parseInt(config.SALT_WORK_FACTOR, 10), (err, salt) => {
    if (err) return next(err);

    bcrypt.hash(user.password, salt, (err1, hash) => {
      if (err1) return next(err1);

      user.password = hash;
      next();
    });
  });
});

userSchema.methods.comparePassword = async function (password) {
  if (!this.password) TE('Password not set');

  const [err, pass] = await to(bcrypt.compare(password, this.password));
  if (err) TE(err);

  if (!pass) TE('Password is incorrect.');

  return this;
};

userSchema.methods.getJWT = function () {
  return (
    'Bearer ' +
    jwt.sign({ id: this.id }, config.JWT_SECRET, {
      expiresIn: config.JWT_EXPIRATION,
    })
  );
};

const User = mongoose.model('User', userSchema);

export default User;

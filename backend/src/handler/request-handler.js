import 'dotenv/config';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import dayjs from 'dayjs';
import AdvancedFormat from 'dayjs/plugin/advancedFormat.js';
import { response } from '../utils/response.js';
import { User, RefreshToken, Book } from '../model/models.js';
import { accessToken, refreshToken } from '../utils/jwt-generator.js';

dayjs.extend(AdvancedFormat);

export const Register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const checkUser = await User.findOne({ email: email });
    if (checkUser) {
      return response(401, {}, 'Email already used, try another email address!', res);
    }

    const salt = bcrypt.genSaltSync(13);
    const hashedPassword = await bcrypt.hash(password, salt);

    const addUser = new User({
      name: name,
      email: email,
      password: hashedPassword,
    });

    await addUser
      .save()
      .then((data) => response(201, data, 'Data added successfully!', res))
      .catch((error) => res.send(error));
  } catch (error) {
    console.log(error);
  }
};

export const Login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email: email });
    if (!user) {
      return response(400, {}, 'Email or password does not match!', res);
    }

    const matchUser = await bcrypt.compare(password, user.password);
    if (!matchUser) {
      return response(400, {}, 'Email or password does not match!', res);
    }

    const ACCESS_TOKEN = accessToken(email);
    const REFRESH_TOKEN = refreshToken(email);

    const addToken = new RefreshToken({
      token: REFRESH_TOKEN,
    });

    await addToken
      .save()
      .then(() => {
        res.cookie('ref_token', REFRESH_TOKEN, {
          sameSite: 'none',
          secure: true,
          maxAge: 7 * 24 * 60 * 60 * 1000,
        });
        response(201, ACCESS_TOKEN, 'Login success!', res);
      })
      .catch((error) => res.send(error));
  } catch (error) {
    console.log(error);
  }
};

export const Token = async (req, res) => {
  try {
    const refToken = req.cookies.ref_token;
    if (!refToken) {
      return response(401, {}, 'Ref token not found', res);
    }

    jwt.verify(refToken, process.env.SECRET_REFRESH_TOKEN, async (err, user) => {
      if (err) {
        console.log(err.message);
        return response(403, {}, 'bad request', res);
      }

      const refreshToken = await RefreshToken.findOne({ token: refToken });
      if (!refreshToken) {
        console.log('Ref token not found in database');
        return response(401, {}, 'Ref token not found in database', res);
      }

      const newAccessToken = accessToken(user.user);
      response(201, newAccessToken, 'New access token created!', res);
    });
  } catch (error) {
    console.log(error);
  }
};

export const Logout = async (req, res) => {
  try {
    const refToken = req.cookies.ref_token;
    if (!refToken) {
      return response(401, {}, 'Please login first', res);
    }

    const refreshToken = await RefreshToken.findOne({ token: refToken });
    if (!refreshToken) {
      return response(401, {}, 'Please login first', res);
    }

    await RefreshToken.deleteOne(refreshToken)
      .then(() => {
        res.clearCookie('ref_token', { sameSite: 'none', secure: true });
        response(200, {}, 'Logout success', res);
      })
      .catch((err) => res.send(err));
  } catch (error) {
    console.log(error);
  }
};

export const UserData = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.user.user });
    if (!user) {
      return response(401, null, 'Data not found!', res);
    }

    const { password, ...data } = user._doc;

    response(200, data, 'User found!', res);
  } catch (error) {
    console.log(error);
  }
};

export const Books = async (req, res) => {
  try {
    const books = await Book.find({ creator: req.user.user });
    response(200, books, 'Books found!', res);
  } catch (error) {
    console.log(eror);
  }
};

export const NewBook = async (req, res) => {
  try {
    const { title, author, published, genres, readed } = req.body;

    const addBook = new Book({
      book_id: dayjs().format('YYYYMMDDHHmmss'),
      creator: req.user.user,
      title,
      author,
      published: dayjs(published).format('MMMM Do YYYY'),
      genres,
      readed,
      issued: dayjs().format('DD-MMM-YYYY HH:mm:ss'),
      last_update: dayjs().format('DD-MMM-YYYY HH:mm:ss'),
    });

    await addBook
      .save()
      .then((data) => response(200, data, 'New book created successfully!', res))
      .catch((error) => res.send(error));
  } catch (error) {
    console.log(error);
  }
};

export const UpdateBook = async (req, res) => {
  try {
    const { book_id, title, author, published, genres, readed } = req.body;

    const book = await Book.findOne({ book_id, creator: req.user.user });
    if (!book) {
      return console.log('book not found');
    }

    book.title = title;
    book.author = author;
    book.published = published;
    book.genres = genres;
    book.readed = readed;
    book.last_update = dayjs().format('DD-MMM-YYYY HH:mm:ss');

    await book
      .save()
      .then((data) => response(201, data, 'Book data updated!', res))
      .catch((error) => res.send(error));
  } catch (error) {
    console.log(error);
  }
};

export const DeleteBook = async (req, res) => {
  try {
    const { book_id } = req.body;

    await Book.deleteOne({ book_id, creator: req.user.user });

    response(200, {}, 'Book deleted!', res);
  } catch (error) {
    console.log(error);
  }
};

import mongoose from 'mongoose';

export const User = mongoose.model('User', {
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
});

export const RefreshToken = mongoose.model('Token', {
  token: {
    type: String,
    required: true,
  },
});

export const Book = mongoose.model('Book', {
  book_id: {
    type: String,
    required: true,
  },
  creator: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  author: {
    type: String,
    required: true,
  },
  published: {
    type: String,
    required: true,
  },
  genres: {
    type: Array,
    required: true,
  },
  readed: {
    type: Boolean,
    required: true,
  },
  issued: {
    type: String,
    required: true,
  },
  last_update: {
    type: String,
    required: true,
  },
});

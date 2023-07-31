import express from 'express';
import { Register, Login, Logout, Token, UserData, NewBook, Books, UpdateBook, DeleteBook } from '../handler/request-handler.js';
import { authenticateToken } from '../utils/middlewares.js';
import { homeResponse } from '../utils/response.js';

const routes = express.Router();

routes.get('/api', (req, res) => homeResponse(200, res));

routes.post('/api/register', Register);
routes.post('/api/login', Login);
routes.post('/api/token', Token);

routes.delete('/api/logout', Logout);
routes.get('/api/dashboard', authenticateToken, UserData);
routes.get('/api/profile', authenticateToken, UserData);
routes.get('/api/books', authenticateToken, Books);
routes.post('/api/new-book', authenticateToken, NewBook);
routes.post('/api/update', authenticateToken, UpdateBook);
routes.post('/api/delete', authenticateToken, DeleteBook);

export default routes;

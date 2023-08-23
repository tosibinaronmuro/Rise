import express, { Request, Response, NextFunction } from 'express';
import request from 'supertest';
import authRouter from '../auth';  
import { register, login, logout, forgotPassword, resetPassword } from '../../controllers/auth-users';  

jest.mock('../../controllers/auth', () => ({
  register: jest.fn(),
  login: jest.fn(),
  logout: jest.fn(),
  forgotPassword: jest.fn(), 
  resetPassword: jest.fn(), 
}));

const app = express();
app.use('/', authRouter);

describe('Auth Routes', () => {
  it('should call register function when POST /register', async () => {
    (register as jest.Mock).mockImplementationOnce((req: Request, res: Response) => {
      res.send('register');
    });

    const response = await request(app).post('/register');
    expect(response.status).toBe(200);
    expect(register).toHaveBeenCalled();
  });

  it('should call login function when POST /login', async () => {
    (login as jest.Mock).mockImplementationOnce((req: Request, res: Response) => {
      res.send('login');
    });

    const response = await request(app).post('/login');
    expect(response.status).toBe(200);
    expect(response.text).toBe('login');
    expect(login).toHaveBeenCalled();
  });

  it('should call logout function when GET /logout', async () => {
    (logout as jest.Mock).mockImplementationOnce((req: Request, res: Response) => {
      res.send('logout');
    });

    const response = await request(app).get('/logout');
    expect(response.status).toBe(200);
    expect(response.text).toBe('logout');
    expect(logout).toHaveBeenCalled();
  });
  it('should call forgotPassword function when POST /forgot-password', async () => {
    (forgotPassword as jest.Mock).mockImplementationOnce((req, res) => {
      res.send('forgot-password');
    });

    const response = await request(app).post('/forgot-password');
    expect(response.status).toBe(200);
    expect(forgotPassword).toHaveBeenCalled();
  });
  it('should call resetPassword function when POST /reset-password', async () => {
    (resetPassword as jest.Mock).mockImplementationOnce((req, res) => {
      res.send('reset-password');
    });

    const response = await request(app).post('/reset-password');
    expect(response.status).toBe(200);
    expect(resetPassword).toHaveBeenCalled();
  });
});

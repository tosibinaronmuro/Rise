import allowedOrigins from './allowedOrigins';
import { CorsOptions } from 'cors';

// (origin: string, callback: (error: Error | null, success: boolean) => void) => void
const corsOptions: CorsOptions = {
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  optionsSuccessStatus: 200,
};

export default corsOptions;

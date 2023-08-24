import allowedOrigins from '../allowedOrigins';
import corsOptions from '../corsOptions';

describe('corsOptions', () => {
  const mockCallback = jest.fn();

  it('should allow requests from allowed origins', () => {
    const allowedOrigin = allowedOrigins[0];
    (corsOptions.origin as (origin: string, callback: (error: Error | null, success: boolean) => void) => void)(allowedOrigin, mockCallback);

    expect(mockCallback).toHaveBeenCalledWith(null, true);
  });

  it('should disallow requests from unallowed origins', () => {
    const unallowedOrigin = 'https://example.com';
    (corsOptions.origin as (origin: string, callback: (error: Error | null, success: boolean) => void) => void)(unallowedOrigin, mockCallback);

    expect(mockCallback).toHaveBeenCalledWith(new Error('Not allowed by CORS'));
  });
});

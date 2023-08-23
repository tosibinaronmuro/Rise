---

# RiseCloud Cloud Backup App API

The RiseCloud Cloud Backup App API is a backend service that powers a cloud backup system. It allows users to securely create accounts and manage their backups in the cloud. This API is built using TypeScript, Node.js, Express, PostgreSQL, and Jest for testing.

## Features

- User Registration: Users can create accounts with their email address, password, and full name.
- User login: Users can login to their accounts with their email address and password.
- User forgot-password: Users can initiate a forgot password feature which sends an authentication token to their provided emails.
- User reset-password: Users can reset their passwords by providing the authenticated token sent to their email and thereafter receive a confirmatory email.
- Account Authentication: Users can log in securely using their registered credentials.
- Secure Backup Storage: User files and data are securely stored in the cloud.
- Account Management: Users can manage their account details, including password reset.
- API Testing: Comprehensive unit tests are implemented using Jest.
- more features coming soon

## Prerequisites

- Node.js (v14 or higher)
- PostgreSQL database
- Docker (optional for containerization)
- Postman (for API testing)

## Installation

1. Clone the repository:

```bash
git clone https://github.com/your-username/risecloud-api.git
```

2. Navigate to the project directory:

```bash
cd risecloud-api
```

3. Install dependencies:

```bash
npm install
```

4. Create a `.env` file in the project root and set the following environment variables:

```env
# Database configuration
DB_HOST=your-db-host
DB_PORT=your-db-port
DB_USER=your-db-username
DB_PASSWORD=your-db-password
DB_DATABASE=your-db-name

# JWT secret key
SECRET_KEY=your-secret-key

# Google client
MY_PASSWORD=your-secret-key
MY_EMAIL=your-semail
```

5. Set up your PostgreSQL database with the provided configuration.

6. Run database migrations:

```bash
npm run migrate
```

7. Start the server:

```bash
npm run start
```

## API Endpoints

- `POST /api/v1/auth/register`: Register a new user account with email, password, and full name.
- `POST /api/v1/auth/login`: Log in using email and password.
- `POST /api/v1/auth/forgot-password`: provide email.
- `POST /api/v1/auth/reset-password`: provide new password.
- `POST /api/v1/bucket/upload`: Upload a file 
- `POST /api/v1/bucket/upload/:folderName: Upload a file to a specified folder from the req.body with the name folderName
- `POST /api/v1/bucket/download/:fileName`: download a file 
- `POST /api/v1/bucket/download/:folderName/:fileName`: download a file from a specidied folder 

- More endpoints  cominig soon

## Testing

The API includes unit tests implemented using Jest.

To run tests:

```bash
npm run test
```

## Postman Collection

You can find a Postman collection with example API requests in the `postman` directory. Import this collection into Postman to test the API endpoints.

## Dockerization (Optional)

The API will eventually be containerized using Docker. A Dockerfile is provided in the repository. To build and run the Docker container:

```bash
docker build -t risecloud-api .
docker run -p 3000:3000 -d risecloud-api
```

## Contributing

Contributions to this project are welcome! Feel free to submit issues and pull requests.
Also a list of possible upgrades/features are:
-make the reset password token a one time token  
For any inquiries or questions, feel free to contact [tosironj@gmail.com](mailto:tosironj@gmail.com).
## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

 

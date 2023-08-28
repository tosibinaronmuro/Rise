---

# RiseCloud Cloud Backup App API

The RiseCloud Cloud Backup App API is a backend service that powers a cloud backup system. It allows users to securely create accounts and manage their backups in the cloud. This API is built using TypeScript, Node.js, Express, PostgreSQL, and Jest for testing.

## Links
- Hosted API Base URL: https://risecloud2.onrender.com 
- Postman Collection: https://documenter.getpostman.com/view/15748545/2s9Y5YSNYg
## Features

- User Registration: Users can create accounts with their email address, password, and full name.
- User login: Users can login to their accounts with their email address and password.
- User logout: Users can logout to their accounts.
- User forgot-password: Users can initiate a forgot password feature which sends an authentication token to their provided emails.
- User reset-password: Users can reset their passwords by providing the authenticated token sent to their email and thereafter receive a confirmatory email.
- Upload files: Users can upload files, photos and videos of not more than 200mb.
- Download files: Users can download files they save.
- Stream photos and videos: Users can stream photos and videos from the cloud.
- View upload history: Users can view their upload history.
- Account Management: Users can manage their account details, including password reset.
- Delete files: Users can delete files they created.
- View Files: Users can view all the files they created.

- Admin Registration: Admins can create accounts with their email address, password, and full name.
- Admin login: Admins can login to their accounts with their email address and password.
- Admin logout: Admins can logout of their accounts  
- Admin forgot-password: Adsmin can initiate a forgot password feature which sends an authentication token to their provided emails.
- Admin reset-password: Admins can reset their passwords by providing the authenticated token sent to their email and thereafter receive a confirmatory email.
- Revokable session management: Admins can revoke the sessions of users with their id.
- View upload history: Admins can view the upload history of the entire application as well as the upload history of a single user.
- View Files: Admins can view all the files of the entire application.
- View Users: Admins can view all the active users of the app.
- Delete unsafe files: Admins can delete files and folders created by any user deemed unsafe
- Account Authentication: Admins can log in securely using their registered credentials.

- Secure Backup Storage: User files and data are securely stored in the cloud.
- Account Management: Admins can manage their account details, including password reset.
- API Testing: Comprehensive unit tests are implemented using Jest.
- more features coming soon


## API Endpoints
### User Auth
- `POST /api/v1/auth/register`: Register a new user account with email, password, and full name.
- `POST /api/v1/auth/login`: Log in using email and password.
- `POST /api/v1/auth/logout`: Logout user.
- `POST /api/v1/auth/forgot-password`: Provide email.
- `POST /api/v1/auth/reset-password`: Provide new password.

### Admin Auth
- `POST /api/v1/auth/admin/register`: Register a new user account with email, password, and full name.
- `POST /api/v1/auth/admin/login`: Log in using email and password.
- `POST /api/v1/auth/admin/logout`: Logout user.
- `POST /api/v1/auth/admin/forgot-password`: Provide email.
- `POST /api/v1/auth/admin/reset-password`: Provide new password.

### User   functionalities
- `POST /api/v1/bucket/upload`: Upload a file 
- `POST /api/v1/bucket/create-folder`: Create a folder for storing files 
- `POST /api/v1/bucket/upload/:folderName`: Upload a file to a specified folder from the req.body with the name folderName
- `GET /api/v1/bucket/download/:fileName`: Download a file 
- `GET /api/v1/bucket/download/:folderName/:fileName`: download a file from a specidied folder 
- `GET /api/v1/bucket/get-all-files`: Get all files created by the user 
- `DELETE /api/v1/bucket/delete/:fileName`: Delete a file created by the user 
- `GET /api/v1/admin/bucket/history`: Get all upload history of the user

### Admin   functionalities
- `DELETE /api/v1/admin/bucket/delete/:fileName`: Delete a file 
- `DELETE /api/v1/admin/bucket/delete-folder/:folderName`: Delete a folder and all files in it... Should be used with caution 
- `GET /api/v1/admin/bucket/get-all-files`: Get all files 
- `GET /api/v1/admin/bucket/history`: Get all upload history
- `GET /api/v1/admin/bucket/history/:userId`: Get all upload history by a user
- `GET /api/v1/admin/bucket/get-all-users`: Get all registered users 
- `PUT /api/v1/admin/bucket/terminate-session/:userId`: Allows the Admin to revoke a users session 


## Prerequisites

- Node.js (v14 or higher)
- PostgreSQL database
- Docker (for containerization)
- Postman (for API testing)

## Installation (manual)

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
JWT_SECRET=your-secret-key

# Google client
MY_PASSWORD=your-secret-key
MY_EMAIL=your-email
GOOGLE_KEY_FILE_NAME=your-key-file-name
GOOGLE_PROJECT_ID=your-project-id

#Download link
CONTENT_BASE_URL=http://${your-base-url}/api/v1/bucket/download
```

5. Database Setup:

   - Open pgAdmin and connect to your PostgreSQL server.
   - Create a new database named "risecloud".
   - Connect to the "risecloud" database.
   - Manually create the necessary tables using SQL scripts provided in the `database-scripts` folder.

6. Run database migrations:

```bash
npm run migrate
```

7. Start the server:

```bash
npm run start
```


## Testing

The API includes unit tests implemented using Jest.

To run tests:

```bash
npm run test
```

## Postman Collection

You can find a Postman collection with example API requests in the `postman` directory. Import this collection into Postman to test the API endpoints.

## Installation ( Docker) 

The API is containerized using Docker. A Dockerfile is provided in the repository. To build and run the Docker container:

```bash
docker build -t rise-cloud-node .
docker run -p 13000:8000 -d rise-cloud-node
```

## Contributing

Contributions to this project are welcome! Feel free to submit issues and pull requests.
Also a list of possible upgrades/features are:
-implement file compression
For any inquiries or questions, feel free to contact [tosironj@gmail.com](mailto:tosironj@gmail.com).
## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

 

# Full-Stack Application: Task Management System (Django + React)

This is a Task Management System full-stack application built with Django REST Framework for the backend and React for the frontend.

---

## Setup Instructions

### 1. Backend Setup (Django)

#### Prerequisites:
- Python 3.11 installed
- PostgreSQL installed and running

#### Steps:
1. Clone the repository:
   ```bash
   <!-- git clone https://github.com/your-repository.git -->
   cd your-repository/taskmgt


2. Create and activate a virtual environment:

    python -m venv env
    source env/bin/activate  # On Windows: env\Scripts\activate
    pip install -r requirements.txt

3. Set up the PostgreSQL database:
    CREATE DATABASE your_database_name;
    CREATE USER your_database_user WITH PASSWORD 'your_database_password';
    ALTER ROLE your_database_user SET client_encoding TO 'utf8';
    ALTER ROLE your_database_user SET default_transaction_isolation TO 'read committed';
    ALTER ROLE your_database_user SET timezone TO 'UTC';
    GRANT ALL PRIVILEGES ON DATABASE your_database_name TO your_database_user;

4. Run database migrations:
    python manage.py makemigrations
    python manage.py migrate

5. Run the server:
    

##### 2. Frontend Setup (React)
###### Prerequisites:
- Node.js installed
- npm or yarn installed

Steps:

1. Navigate to the frontend directory:
    cd ../task_management_ui

2. Install dependencies: Using npm:
    npm install
    npm i --save-dev dotenv

4. Run the React development server: Using npm:
    npm start

5. Access the application:

    Backend: http://127.0.0.1:8000
    Frontend: http://127.0.0.1:3000


##### Project Overview
    Architecture
        Backend: Django REST Framework for API development and PostgreSQL for database management.
        Frontend: React for building a responsive and dynamic user interface.

    Key Design Choices
        JWT authentication for secure user sessions.
        Environment variable management for sensitive data.
        Integration of React with Django for a seamless full-stack experience.

    Third-Party Libraries
        Django REST Framework: For building REST APIs.
        Simple JWT: For implementing JWT authentication.
        React: For building the frontend.
        Axios: For handling HTTP requests in React.
        PostgreSQL: For database management.

    Troubleshooting
        Ensure your PostgreSQL database is running and accessible with the credentials in your .env file.
        For frontend-backend communication issues, confirm the REACT_APP_API_URL is correctly set in the .env file.

    Deployment
        For production deployment, consider using:

         Backend: Gunicorn + Nginx.
         Frontend: Serve the React build files using Django or host them on a CDN (e.g., Netlify).
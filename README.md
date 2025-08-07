# E-commerce Headless REST API

This project is a headless REST API for an e-commerce platform, built using Express, Sequelize, and PostgreSQL. It follows a headless approach similar to Medusa.js, providing a flexible backend for managing products, orders, users, and other e-commerce related data.

## Features

*   RESTful API endpoints
*   Data persistence with PostgreSQL
*   Object-Relational Mapping (ORM) with Sequelize
*   Modular code structure
*   UUID primary keys for models

## Setup

To set up and run the project locally, follow these steps:

1.  **Clone the repository:**

    
```
bash
    git clone <repository_url>
    cd <repository_folder>
    
```
2.  **Install dependencies:**
```
bash
    npm install
    
```
3.  **Database Setup:**

    *   Ensure you have a PostgreSQL database running.
    *   Configure your database connection details in a configuration file (e.g., `.env` or a dedicated config file). You will need to specify the database name, username, password, host, and port.
    *   Run Sequelize migrations to create the necessary database tables. (Assuming you have Sequelize migrations set up. If not, you'll need to create and run them.)

    
```
bash
    npx sequelize-cli db:migrate
    
```
4.  **Environment Variables:**

    Create a `.env` file in the root of the project and add necessary environment variables, such as database connection details and any other configuration settings.
```
env
    DB_DATABASE=your_database_name
    DB_USERNAME=your_username
    DB_PASSWORD=your_password
    DB_HOST=your_db_host
    DB_PORT=your_db_port
    # Add other environment variables as needed
    
```
## Running the Application

To start the API server, run the following command:
```
bash
npm start
```
The API will be accessible at the specified port (default is usually 3000, but check your configuration).

## Technologies Used

*   **Express:** Fast, unopinionated, minimalist web framework for Node.js.
*   **Sequelize:** A promise-based Node.js ORM for Postgres, MySQL, MariaDB, SQLite and Microsoft SQL Server.
*   **PostgreSQL:** A powerful, open source object-relational database system.

## License

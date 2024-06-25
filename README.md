# MicroMotus-A-Microservices-Based-Online-Word-Game-Platform
## How it works ?
Download the github repository, open a terminal at the root of the project. Run the following command:

`docker-compose up -d --force-recreate` or `docker compose -f "docker-compose.yml" up -d --build`.

Now, you can go to http://localhost:3002 to register and login. 

Once you login you will be redirected to the HAProxy on http://localhost:3000 that will reroute you to the port 4000 where the Motus game is deployed.
## Overview

This web application features a motus game, an authentication system and a scoring system. It employs a microservice architecture with services for authentication, game logic, and score tracking. User information is stored in a PostgreSQL database, while game scores are managed in a Redis database.

### Services

- **Authentication Service**: Handles user registration and login.
- **Game Service**: Manages the Motus game logic.
- **Score API**: Tracks and retrieves player scores.
- **HAProxy Load Balancer**: Distributes incoming traffic between two instances of the Motus Game Service to ensure load balancing and high availability.
![Untitled diagram-2024-03-08-195949](https://github.com/mazen-gamdou/Microservices_Project/assets/67543487/af6135a4-0c20-4a4f-9ef1-c098f340ce64)

## Authentication Service

### Technologies

- **Database**: PostgreSQL
- **Backend**: NodeJS
- **Server**: Express.js
- **Security**: Bcrypt for password hashing, crypto for secure tokens
- **Session Management**: Express-session
- **Cross-Origin Resource Sharing**: CORS

### Endpoints

- `/register`: 
  - **Endpoint**: /register 
  - **Method**: POST
  - **Description**: Registers a new user by adding their details to the database.
  - **Body**: 
      ```json
    {
      "firstname": "Tokyo",
      "lastname": "Doan",
      "username": "toto",
      "password": "secure_password"
    }
    ```
  - **Response**:  A message confirming registration or an error message if registration fails.
  - **Success Response Example**:
     ```json
    {
     "message": "User registered successfully."
    }
    ```

  - **Error Response Example**:
    ```json
    {
     "message": "Registration failed."
     "message": "User already exists"
     "message": "Internal Server Error"
    }
    ```
- `/login`: 
  - **Endpoint**: /login
  - **Method**: POST
  - **Description**: Authenticates users by checking their credentials and creating a session.
  - **Body**: 
    ```json
    {
      "username": "toto",
      "password": "secure_password"
    }
    ```
  - **Response**: A redirection to the game's main page if successful or an error message if login fails.
  - **Error Response Example**:
    ```json
    {
      "error": "Invalid username or password."
    }
    ```
- **User Session Check**
  
  - **Endpoint**: /api/user
  - **Method**: GET
  - **Description**: Checks if the user is currently logged in and returns the username.
  - **Response**: JSON object with the username if the user is authenticated.
  - **Success Response Example**:
    ```json
     {
        "username": "toto"
     }
     ```
### Security Considerations

- **Passwords**: All passwords are hashed using bcrypt before being stored in the database.
- **Sessions**: Sessions are managed with express-session. Ensure to use the secure flag on cookies in production with HTTPS.
- **Environment Variables**: Do not hardcode sensitive information such as database credentials. Use environment variables.
- **CORS**: Configure CORS appropriately to ensure that the API only accepts requests from trusted origins.

## Game Service

### Game Logic

1. A random word is selected daily based on a generated random number.
2. Users have 6 attempts to guess the word.
3. Feedback provided for each guess:
   - Green highlight: Correct letter and placement.
   - Orange highlight: Correct letter, wrong placement.
   - No highlight: Incorrect letter.

### Technologies

- Backend: Node.js
- Backend web application framework: Express.js

## Score API

### Endpoints

- `/setscore`: Records a player's score.
  - **Method**: POST
  - **Body**:
    ```json
    {
      "username": "john_doe",
      "score": 100
    }
    ```
  - **Response**: Confirmation of score recording.

- `/getscore`: Retrieves a player's score.
  - **Method**: GET
  - **Query Parameters**: `username=john_doe`
  - **Response**:
    ```json
    {
      "username": "john_doe",
      "score": 100
    }
    ```

### Technologies

- Database: Redis
- Backend: Node.js / Express.js

## HAProxy Load Balancer

Distributes traffic to the Motus Game Service instances, enhancing application scalability and availability.

## Project Sequence Diagram

The sequence diagram below illustrates the interactions between the various components of our microservices architecture, including the Authentication Service, Game Service, Score API, and HAProxy Load Balancer. This visual representation helps to understand the flow of requests and data throughout the system.

```mermaid
sequenceDiagram
    participant U as User
    participant L as Login Service
    participant DB as PostgreSQL DB
    participant H as HAProxy
    participant M1 as Motus Service 1
    participant M2 as Motus Service 2
    participant S as Score Service
    participant R as Redis DB

    U->>L: Navigate to /login or /register
    L->>DB: Query user data
    DB-->>L: Return user data
    L->>U: Display login/register result
    alt Successful Login
        L->>U: Set session and redirect to HAProxy (/)
        U->>H: Request Motus game
        alt Load Balancing
            H->>M1: Route to Motus Service 1
            M1->>U: Serve game interface
            U->>M1: Play game, make guesses
            alt Correct Guess
                M1->>S: Call /setscore API
                S->>R: Update score in Redis
                R-->>S: Confirm score update
                S-->>M1: Return success response
                M1->>U: Display updated score
            end
        else
            H->>M2: Route to Motus Service 2
            M2->>U: Serve game interface
            U->>M2: Play game, make guesses
            alt Correct Guess
                M2->>S: Call /setscore API
                S->>R: Update score in Redis
                R-->>S: Confirm score update
                S-->>M2: Return success response
                M2->>U: Display updated score
            end
        end
    else Login/Register Failed
        L->>U: Display error message
    end
    U->>L: Request /logout
    L->>U: Clear session and redirect to /login

```

## Deployment

The application is deployed using Docker and Docker Compose, enabling streamlined setup and scalability. The `docker-compose.yml` file defines the services, networks, and volumes required for the application.

## Perspectives

1. **Implementation of Cookies Logic**: Incorporating cookies into the application would allow for enhanced user session management.

2. **Monitoring with Grafana**: Integrating monitoring tools like Grafana.

3. **Social Logins (Google and Facebook)**: Adding support for social logins through platforms like Google and Facebook could streamline the authentication process, making it easier for users to sign up and log in.

4. **OAuth Flow and Secure Session Management**: Future development will include completing the OAuth authentication flow, integrating secure session management, and enhancing user authentication with token-based mechanisms. 
---

This documentation provides a foundational overview of your web application's architecture, services, and endpoints. Adjust the technology stack, deployment instructions, and any additional details specific to your implementation as necessary.

# **Locale-API**

The Locale API is a backend service built using Node.js, Express, TypeScript, MongoDB, and Redis. It provides developers with access to information about regions, states, and local government areas (LGAs). The API supports authentication, search functionality, general data retrieval, caching, and rate limiting. Locale API gives details about a country expecially Nigeria in terms of knowing the region, state and local government area.

# **Table of Contents**

* Setup
* Authentication and Authorization
* Search Functionality
* General APIs
* Caching
* Rate Limiting

# **Setup**

To set up the development environment for the Locale API, follow these steps:

1) Install Node.js and TypeScript on your machine.
2) Initialize a new Node.js project.
3) Configure TypeScript for the project.

## **Folder structure**

```
\---.vscode
|
\---config
|   +---db.ts
|   +--index.ts
|   
\---node_modules
|
\---src
|   |
|   \---api
|   |   |
|   |   +---auth
|   |   |       auth.controller.ts
|   |   |       authRoutes.js
|   |   +---local
|   |   |       local.controller.ts
|   |   |       local.routes.ts         
|   |   |
|   |   +---profile
|   |   |       profile.controller.ts
|   |   |       profile.routes.ts
|   |   |
|   |   +---region
|   |   |       region.controller.ts
|   |   |       region.routes.ts
|   |   | 
|   |   +---state  
|   |   |       state.controller.ts
|   |   |       state.routes.ts
|   |   |
|   +---models
|   |       local.model.ts
|   |       region.model.ts
|   |       state.model.ts
|   |       user.model.ts
|   |
|   |
|   +---routes
|   |       index.ts
|   |
|   |
|   +---service
|   |        apiKey.service.ts
|   |
|   |
|   +---shared
|   |       |
|   |       +---middleware
|   |       |       auth.middleware.ts
|   |       |       cache.middleware.ts
|   |       |       error.middleware.ts
|   |       |       error.logger.ts
|   |       |       loginLimiter.ts
|   |       +---utils
|   |       |       db.ts
|   |       |       errors.ts
|   |       |       logger.ts
|   |       |       redis.client.ts
|   |                                   
|   +-----test
|   |       |
|   |       +---integrating
|   |       |
|   |       +---unit                  
|   |
|   |---app.js
|   
\---.env.example
|
\---.eslintignore
|
\---.eslintrc.js
|
\---.gitignore
|
\---.markdownlint.json
|
\---.prettierrc.js
|
\---.nodemon.json
|
\---package-lock.json
|
\---package.json
|
\---README.md
|
\---server.ts
|
\---tsconfig.json
|
```
## **Getting Started**

### **Prerequisites**

Before you can run the API, you will need to have the following installed:

- Node.js

- Mongodb localhost

### **Installing**

Clone the repository to your local machine.

In the root directory, create a .env file and add the
following environment variables:

1. Clone the repository to your local machine.
2. Install the required dependencies with npm install
3. In the root directory, create a **`.env`** file based on the **`.env.example`** file, and update the values as needed with the following variables

- MONGO_DB= **`mongodb localhost`**
- PORT= **`specified number`**
- Redis= **`cache (in memory database)`**
- NODE_ENV= **`stage of the project`**

4. Run **`npm install`** to install the required packages.
5. The API server will start running on http://localhost:8000. You can now send HTTP requests to the API endpoints.

## **E-Contributing**

If you'd like to contribute to the Project Name, follow these steps:

1. Fork the repository using this link: [GitHub](https://github.com/olaobey/Locale-API.git)

2. Create a new branch for your changes

3. Make your changes and commit them to your branch

4. Push your branch to your forked repository

5. Create a pull request to merge your changes into the main repository


## **Running**

To start the API, **`run npm start dev`**.

# **Authentication and Authorization**

The Locale API implements an authentication and authorization system to protect the API endpoints. Here's an overview of the process:

## **User Registration and API Key Generation**

1) Create an endpoint for user registration where developers can sign up.
1) Upon successful registration, generate a unique API key for each user.
3) Store the API key securely in the database associated with the user's account.

## **API Key Authentication**

1) Implement middleware to handle API key authentication for each request.
2) Developers should include their API key in the request headers.
3) Verify the API key against the stored keys in the database.
4) Deny access if the API key is invalid or not provided. 

# **Search Functionality**

The Locale API provides search functionality to retrieve information about Nigeria based on regions, states, and LGAs. Here's an overview of the process:

# **General APIs**
The Locale API provides general APIs to retrieve information about all regions, states, and LGAs in Nigeria. Here's an overview of the process:

## **Define API Endpoints**

1) Create endpoints for searching regions, states, and LGAs individually.
2) Use appropriate URL paths and HTTP methods to handle the requests.

### **Authentication**

- POST /auth/signup: `Register a new user.`
- POST /auth/signin: `Log in and generate a apiKey with expiration time.`
- POST /logout: `Log out to clear apiKey`

### **Local endpoint**
- POST /local/create: `Create a new local government area data`
- PUT /local/update/:id: ` update local government area data`
- GET /local/getAll:`Get all local government area data 
- GET /local/get/:id: `Get local government area data with id`
- DELETE /local/delete/:id: `Delete local government area data

### **Profile endpoint**

- PUT /profile/update/:id: `Update profile`
- GET /profile/get/:id: `Get profile by id`
- DELETE /profile/delete/:id: `Delete profile by id`

### **Region endpoint**

- POST /region/create/: `Create new region`
- PUT /region/update/:id: `Update region`
- GET /region/get/:id: `Get region by id`
- GET /region/getAll/: `Get all regions`
- DELETE /region/delete/:id: `Delete region by id`

### **State endpoint**

- POST /state/create/: `Create new state`
- PUT /state/update/:id: `Update state`
- GET /state/get/:id: `Get state by id`
- GET /state/getAll/: `Get all states`
- DELETE /state/delete/:id: `Delete state by id`

## **Built With**

### **Dependency**

 - bcrypt: "^5.1.0",
 - cors: "^2.8.5",
 - date-fns: "^2.30.0",
 - dotenv: "^16.1.4",
 - envalid: "^7.3.1",
 - eslint: "^8.42.0",
 - express: "^4.18.2",
 - express-paginate: "^1.0.2",
 - express-pino-logger: "^7.0.0",
 - express-rate-limit: "^6.7.0",
 - ioredis: "^5.3.2",
 - mongoose: "^7.2.2",
 - pino: "^8.14.1",
 - pino-http: "^8.3.3",
 - pino-pretty: "^10.0.0",
 - prettier: "^2.8.8",
 - redis: "^4.6.7",
 - rimraf: "^5.0.1",
 - ts-node: "^10.9.1",
 - tsconfig-paths: "^4.2.0",
 - uuid: "^9.0.0",
 - validator: "^13.9.0

## **Query the Database**

1) Implement database queries to retrieve the required information based on the search parameters.
2) Handle different scenarios where developers may want to search for regions with states, states with LGAs, or only specific regions/states/LGAs.

## **Return Metadata**

1) Fetch and include all relevant metadata associated with each region, state, or LGA in the API response.
2) Organize the data in a structured format (e.g. JSON) to make it easily consumable by developers.
 
## **Retrieve Data**
1) Implement database queries to fetch the required data for each API endpoint.
2) Ensure the data is properly formatted and returned in the API response.
 
# **Caching**

To improve performance and minimize database hits, the Locale API implements a caching mechanism using Redis. Here's an overview of the process:

Set Up Caching
1) Install and configure Redis in your project.
2) Initialize a connection to the Redis server.

## **Cache Query Results**

1) Before querying the database for search or general API requests, check if the data is already available in the cache.
2) If found, retrieve the data from the cache and return it as the API response.
3) If not found, query the database, store the result in the cache, and return it as the API response.

# **Rate Limiting**

To prevent abuse and ensure fair usage of the Locale API, rate limiting is implemented. Here's an overview of the process:

## **Set Up Rate Limiting Middleware**

1) Create middleware to track and limit the number of requests per time interval (e.g., per minute or per hour).
2) Identify the request source (e.g., IP address or API key) and track the number of requests made from that source.
3) Apply the rate limit rules to restrict access if the number of requests exceeds the defined limit.
# **Credits**

The Project Name was created by **`Ajeigbe Olaoluwa Samuel`**.
# **Authors**
The author of the project is **`Ajeigbe Olaoluwa Samuel`**.
# **License**

This project is licensed under the MIT License





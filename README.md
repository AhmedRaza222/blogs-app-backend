# Blog Application Backend

This project was built to fulfill the requirements of the assigned task, focusing on a scalable, modular, and high-performance backend architecture for a blog application. We prioritized clean code practices, separation of concerns, and robust feature implementation.

## Prerequisites

- **Node.js**: v20.18.2
- **MongoDB**: Local instance or Atlas connection

## Getting Started

Follow these instructions to set up and run the project locally.

### 1. Installation

Clone the repository and install the dependencies:

```bash
npm install
```

### 2. Environment Setup

Create a `.env` file in the root directory based on the example provided:

```bash
cp .env.example .env
```

Ensure your `.env` contains the correct MongoDB URI and Port:

```env
PORT=5001
MONGO_URI=mongodb://localhost:27017/SampleBlogs
```

### 3. Database Seeding

We have included a seed script to populate the database with diverse implementation data (Food, Tech, Travel, etc.) for testing pagination and filtering:

```bash
npm run seed
```

### 4. Running the Application

Start the development server:

```bash
npm run dev
```

The server will start on `http://localhost:5001`.

---

## Architecture: Layered Usage Pattern

We followed a clean **Controller-Service-Repository** pattern to ensure separation of concerns and maintainability.

- **Routes (`src/routes`)**: Define the endpoints and map them to controllers.
- **Controllers (`src/controllers`)**: Handle HTTP requests (parsing query params like `page`, `limit`, `search`) and responses. They act as the entry point.
- **Services (`src/services`)**: Contain the **business logic**. For example, deciding whether to run a simple fetch, a tag filter, or a complex search query happens here.
- **Repositories (`src/repositories`)**: Handle direct database access. They ensure business logic doesn't need to know _how_ to talk to MongoDB, just _what_ data it needs.
- **Models (`src/models`)**: Define the database schemas using Mongoose.

## Feature Implementation Details

### A. Global Search & Filtering

The core logic for searching lives in `BlogService.ts` inside `getBlogsWithPagination`.

- **Approach**: We use a **Dynamic Query Builder**.
- **Logic**:
  - The service accepts `tags` and `search` arguments.
  - It builds a MongoDB `filter` object dynamically.
  - **Tags**: If present, it adds `{ tags: { $in: [list] } }` to match any selected tags.
  - **Search**: If present, it adds an `$or` condition to check if the `search` string exists in the **Title** OR the **Content** using a case-insensitive regex (`$options: 'i'`).
  - This filter is passed to the Repository, ensuring we can search and filter simultaneously.

### B. Dynamic Pagination

- **Frontend Request**: Sends `page=1` and `limit=10`.
- **Backend Logic**:
  - **Skip Calculation**: `(page - 1) * limit`.
  - **Data Fetching**: The repository uses `.skip()` and `.limit()` on the Mongoose query to fetch only the requested chunk.
  - **Total Count**: We effectively run a second query (`countDocuments`) matching the same filter to tell the frontend the total number of pages available.

### C. Dynamic Tags API

- **Endpoint**: `GET /api/blogs/tags`.
- **Logic**: Instead of hardcoding tags, we use MongoDB's `.distinct('tags')` method in `BlogRepository`. This scans the entire blog collection and returns a list of all unique tags currently in use. This allows the frontend filter buttons to update automatically as new content is added.

### D. Security (Rate Limiting)

- **Implementation**: We added `express-rate-limit` middleware in `app.ts`.
- **Configuration**: It tracks IP addresses in memory. If a single IP exceeds **100 requests in 1 minute**, it blocks them with a `429 Too Many Requests` error. This protects the API from basic brute-force or denial-of-service attacks.

### E. System Health & Documentation

- **Swagger**: We integrated `swagger-jsdoc` to automatically generate API documentation at `/api-docs`. This scans JSDoc comments to build the UI, making it easy to test endpoints without a frontend.
- **Seeder**: The `seed.ts` script was architected to be "idempotent-ish" (it wipes valid data first) and generates deterministic random data across 5 distinct categories (Food, Tech, Travel, etc.) to ensure development is always visually rich and functionally testable.

### F. Unit Testing

We prioritized reliability by implementing comprehensive unit tests for the API endpoints.

- **Tools**: We used **Jest** as the testing framework and **Supertest** to simulate HTTP requests against the Express app.
- **Strategy**: We mocked the Service layer (`blogService`) to isolate the Controller logic. This allows us to test route handling, parameter parsing, and response codes (200, 404, 500) without relying on a live database connection during tests.
- **Running Tests**:
  ```bash
  npm test
  ```

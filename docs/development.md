# Development Guide

## Prerequisites

- Node.js (v18+ recommended)
- PostgreSQL (or your configured database)

## Setup

1. Clone the repository.
2. Install dependencies:
   ```sh
   npm install
   ```
3. Copy `.env.sample` to `.env` and adjust values as needed.
4. Generate Prisma client:
   ```sh
   npx prisma generate
   ```
5. Run database migrations:
   ```sh
   npx prisma migrate dev
   ```
6. Start the development server:
   ```sh
   npm run start:dev
   ```

## Code Structure & Conventions

- Source code is in the `src/` directory, organized by feature/module.
- Use dependency injection for all services.
- Configuration and secrets should never be hardcoded.
- Use DTOs and validation for all API inputs.

## Testing

- Run tests with:
  ```sh
  npm run test
  ```

## Linting

- Check code style:
  ```sh
  npm run lint
  ```

## Contributing

- Follow the existing code style and structure.
- Add or update documentation for new features.
- Write tests for new code where possible.

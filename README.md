# OAuth2 Implementation

This project is a modern OAuth2 authentication platform, featuring a Next.js web frontend and a NestJS-based API backend. It provides secure, scalable, and user-friendly authentication solutions, leveraging best practices and popular frameworks for both web and server-side development.

## Features

- OAuth2 Authorization and Authentication
- Next.js frontend for user interaction
- NestJS backend API for authentication logic
- Secure token management
- Extensible and modular architecture

## Requirements

- **Node.js**: v18.x or higher
- **pnpm**: v8.x or higher (for package management)
- **Database**: PostgreSQL (v13 or higher recommended)

## Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/mahyarkarimi/authwise
   cd authwise
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Configure environment variables**

   Copy the example environment files and update them with your configuration:
   ```bash
   cp .env.example .env
   # Edit .env with your database and secret values
   ```

4. **Set up the database**

   Ensure you have a running PostgreSQL instance. Update your `.env` file with the correct connection string.

   Run database migrations (if applicable):
   ```bash
   pnpm run migrate
   ```

5. **Start the development servers**

   - **All together**
   ```bash
     pnpm run dev
   ```

6. **Access the application**

   - Frontend: [http://localhost:3000](http://localhost:3000)
   - API: [http://localhost:4000](http://localhost:3001) (default ports)

## Dependencies

- [Node.js](https://nodejs.org/)
- [pnpm](https://pnpm.io/)
- [PostgreSQL](https://www.postgresql.org/)
- [Next.js](https://nextjs.org/)
- [NestJS](https://nestjs.com/)

## License

MIT

---

Feel free to open issues or contribute to the project!

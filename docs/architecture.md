# Project Architecture

The project is structured as a modular NestJS application, following best practices for scalability and maintainability.

## Directory Structure
- `src/app.module.ts`: Main application module, imports and configures all other modules.
- `src/auth/`: Authentication logic, strategies, and endpoints.
- `src/admin/`: Admin features and management endpoints.
- `src/prisma/`: Prisma ORM integration and database service.
- `src/utils/`: Utility functions and middleware (e.g., cookie handling, JWT config).
- `src/oauth2-model.ts`: Implements the OAuth2 model interface, handling token generation, validation, and user/client management.
- `src/load-keys.config.ts` or `src/keypair.config.ts`: Loads keypairs from files into the config system.

## Module Interactions
- **AppModule** wires together all modules and applies global middleware.
- **AuthModule** and **OAuth2ServerModule** handle authentication and OAuth2 flows.
- **PrismaModule** provides database access to services via dependency injection.
- **ConfigModule** loads environment variables and custom config (including keypairs) and makes them available via `ConfigService`.

## Key Services
- **OAuth2ModelService**: Implements the OAuth2 model, responsible for token issuance, validation, and user/client lookups. Uses `JwtService`, `PrismaService`, and `ConfigService`.
- **JwtService**: Handles signing and verifying JWTs using keys from config.
- **PrismaService**: Provides database access for users, clients, tokens, and codes.

The application uses dependency injection, middleware for cookie handling, and supports scalable, maintainable code organization.
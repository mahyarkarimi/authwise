# Configuration Guide

Configuration is managed using the NestJS ConfigModule. Environment variables are loaded from `.env` files, and custom config loaders can inject additional values (such as keypairs) at startup.

## Custom Config Loaders
Custom loaders (e.g., `keypair.config.ts`) can read files or perform logic at startup, returning an object that is merged into the config system. This allows you to load secrets, keys, or other computed values and access them via `ConfigService`.

Example loader:

```ts
import * as fs from 'node:fs';
export default () => ({
  jwtPrivateKey: fs.readFileSync(process.env.JWT_PRIVATE_KEY_PATH, 'utf8'),
  jwtPublicKey: fs.readFileSync(process.env.JWT_PUBLIC_KEY_PATH, 'utf8'),
});
```

## Accessing Config Values
In any service, inject `ConfigService` and use `get()` to retrieve values:

```ts
const privateKey = this.configService.get<string>('jwtPrivateKey');
```

## Example `.env` variables

```env
DATABASE_URL=postgres://user:pass@localhost:5432/db
JWT_PRIVATE_KEY_PATH=./private.pem
JWT_PUBLIC_KEY_PATH=./public.pem
JWT_EXPIRES_IN=3h
```

## Usage Patterns
- Use environment variables for secrets and file paths.
- Use custom loaders for computed or file-based config.
- Access all config via `ConfigService` for consistency and testability.

See the codebase for more details on configuration patterns.
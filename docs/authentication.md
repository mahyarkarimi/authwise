# Authentication & OAuth2

The project implements OAuth2 flows using JWT tokens for access and refresh tokens, following security best practices.

## OAuth2 Flows
- **Authorization Code Grant**: Used for web and mobile clients, supports PKCE.
- **Password Grant**: (If enabled) for trusted clients.
- **Refresh Token Grant**: Allows clients to obtain new access tokens without re-authenticating.

## JWT Handling
- **Access tokens**: JWTs signed with the private key, containing user, client, and scope claims. Lifetime is configurable.
- **Refresh tokens**: JWTs with separate keys and longer lifetimes.
- **Verification**: Tokens are verified using the public key, and claims (issuer, audience, etc.) are checked.

## Security Practices
- **Password Hashing**: User passwords are hashed with Argon2 before storage.
- **Key Management**: RSA keypairs are loaded from files at startup and never hardcoded.
- **Scopes**: Access is controlled via scopes, validated per client and user.
- **Middleware**: Auth cookies and other security middleware are applied globally.

## Implementation
- The `OAuth2ModelService` class implements all required OAuth2 model methods, handling token issuance, validation, and user/client lookups.
- JWT signing and verification use keys loaded via the config system.
- Prisma is used for all persistent data (users, clients, tokens, codes).

See the codebase and `OAuth2ModelService` for implementation details.
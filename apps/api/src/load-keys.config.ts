import * as fs from 'node:fs';
import * as path from 'node:path';

export default () => ({
  jwtPrivateKey: fs.readFileSync(path.resolve(process.env.JWT_SECRET_PRIVATE), 'utf8'),
  jwtPublicKey: fs.readFileSync(path.resolve(process.env.JWT_SECRET_PUBLIC), 'utf8'),
  jwtRefreshPrivateKey: fs.readFileSync(path.resolve(process.env.JWT_REFRESH_SECRET_PRIVATE), 'utf8'),
  jwtRefreshPublicKey: fs.readFileSync(path.resolve(process.env.JWT_REFRESH_SECRET_PUBLIC), 'utf8'),
  adminJwtPrivateKey: fs.readFileSync(path.resolve(process.env.ADMIN_JWT_SECRET_PRIVATE), 'utf8'),
  adminJwtPublicKey: fs.readFileSync(path.resolve(process.env.ADMIN_JWT_SECRET_PUBLIC), 'utf8'),
});
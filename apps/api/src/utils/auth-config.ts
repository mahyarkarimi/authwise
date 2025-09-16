import { SignOptions } from "jsonwebtoken";
import { ExtractJwt, StrategyOptions } from "passport-jwt";

export const jwtOpts: SignOptions = {
  issuer: 'authwise.com',
  audience: 'authwise.com',
  algorithm: 'RS256',
};

export const jwtStrategyOpts: Omit<StrategyOptions, 'secretOrKeyProvider'> = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  issuer: 'authwise.com',
  audience: 'authwise.com',
  algorithms: ['RS256'],
};


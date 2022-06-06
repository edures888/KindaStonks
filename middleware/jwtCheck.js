import { expressjwt } from "express-jwt";
import jwksRsa from 'jwks-rsa'
import { audience, domain } from "../utils/env.dev.js";

const jwtCheck = expressjwt({
  secret: jwksRsa.expressJwtSecret({
      cache: true,
      rateLimit: true,
      jwksRequestsPerMinute: 5,
      jwksUri: `https://${domain}/.well-known/jwks.json`
}),
  audience: audience,
  issuer: `https://${domain}/`,
  algorithms: ['RS256']
});

export default jwtCheck
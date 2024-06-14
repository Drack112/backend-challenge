import { User, UserDTO } from "@/domain/entities";
import * as jwt from "jsonwebtoken";
import config from "../config";

export type Jwt = string;

export function getSignedToken(user: User): Jwt {
  return jwt.sign(getTokenPayload(user), config.auth.jwtSecret, {
    expiresIn: config.auth.jwtExpires,
  });
}

export function validateToken(token: string) {
  return jwt.verify(token, config.auth.jwtSecret) as jwt.JwtPayload & UserDTO;
}

function getTokenPayload(user: User): UserDTO {
  return {
    id: user.id,
    username: user.username,
  };
}

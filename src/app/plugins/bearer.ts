import httpCodes from "@inip/http-codes";
import { preHandlerHookHandler, FastifyPlugin } from "fastify";
import { JwtPayload } from "jsonwebtoken";
import { getConnection } from "typeorm";
import fp from "fastify-plugin";

import BadRequestError from "@/lib/error/BadRequestErrors";
import { User, UserDTO } from "@/domain/entities";
import { validateToken } from "@/lib/jwt/jwt";

const bearerPlugin: FastifyPlugin = async function (
  instance,
  options,
  done,
): Promise<void> {
  instance.decorateRequest("user", null);
  instance.addHook("preHandler", bearerHook);
};

const bearerHook: preHandlerHookHandler = async function (
  request,
  reply,
): Promise<void> {
  const authHeader = request.headers["authorization"];
  if (!authHeader) {
    return;
  }

  const [scheme, token] = authHeader.split(/\s+/);
  if (scheme.toLowerCase() !== "bearer") {
    throw new BadRequestError("Invalid bearer scheme", httpCodes.BAD_REQUEST);
  }

  let decodedToken: JwtPayload & UserDTO;
  try {
    decodedToken = validateToken(token);
  } catch (error) {
    throw new BadRequestError("Não autorizado", httpCodes.UNAUTHORIZED);
  }

  const userRepository = getConnection().getRepository(User);
  const user = await userRepository.findOne({
    where: {
      username: decodedToken.username,
    },
  });

  if (!user) {
    throw new BadRequestError("Não autorizado", httpCodes.UNAUTHORIZED);
  }

  request.user = user;
};

export const bearer = fp(bearerPlugin);

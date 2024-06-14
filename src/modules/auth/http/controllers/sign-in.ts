import { FastifyPlugin } from "fastify";
import { RequestHandler } from "@/types/fastify";
import { UserRequestSigninBody } from "@/types/user";
import { UserRepository } from "@/modules/user/db/user.repository";
import BadRequestError from "@/lib/error/BadRequestErrors";
import httpCodes from "@inip/http-codes";
import { getSignedToken, Jwt } from "@/lib/jwt/jwt";

export const signIn: FastifyPlugin = async function (
  instance,
  options,
  done,
): Promise<void> {
  instance.route({
    method: "POST",
    url: "/login",
    schema,
    handler,
  });
};

export const handler: RequestHandler<UserRequestSigninBody> = async function (
  req,
  res,
): Promise<{ token: Jwt }> {
  const signPayload = req.body;
  const userRepository = new UserRepository();

  const userExists = await userRepository.userExists(signPayload.username);

  if (!userExists) {
    throw new BadRequestError("Usuário não existe", httpCodes.NOT_FOUND);
  }

  try {
    await userExists.comparePassword(signPayload.password);
  } catch (error) {
    throw new BadRequestError(
      "Usuário/Senha incorreta",
      httpCodes.UNAUTHORIZED,
    );
  }

  return {
    token: getSignedToken(userExists),
  };
};

const schema = {
  tags: ["Authentication"],
  body: {
    type: "object",
    properties: {
      username: { type: "string" },
      password: { type: "string" },
    },
    required: ["username", "password"],
  },
  response: {
    200: {
      type: "object",
      properties: {
        token: {
          type: "string",
        },
      },
    },
    400: {
      type: "object",
      properties: {
        error: { type: "string" },
        message: { type: "string" },
        statusCode: { type: "integer" },
      },
    },
    401: {
      type: "object",
      properties: {
        error: { type: "string" },
        message: { type: "string" },
        statusCode: { type: "integer" },
      },
    },
    404: {
      type: "object",
      properties: {
        error: { type: "string" },
        message: { type: "string" },
        statusCode: { type: "integer" },
      },
    },
    500: {
      type: "object",
      properties: {
        error: { type: "string" },
        message: { type: "string" },
        statusCode: { type: "integer" },
      },
    },
  },
};

import { FastifyPlugin } from "fastify";
import { RequestHandler } from "@/types/fastify";
import { UserRequestSignupBody } from "@/types/user";
import httpCodes from "@inip/http-codes";
import { UserRepository } from "@/modules/user/db/user.repository";
import BadRequestError from "@/lib/error/BadRequestErrors";

export const signUp: FastifyPlugin = async function (
  instance,
  options,
  done,
): Promise<void> {
  instance.route({
    method: "POST",
    url: "/registration",
    schema,
    handler,
  });
};

export const handler: RequestHandler<UserRequestSignupBody> = async function (
  req,
  res,
): Promise<{ message: string }> {
  const signupPayload = req.body;

  const userRepository = new UserRepository();

  const userExists = await userRepository.userExists(signupPayload.username);
  if (userExists) {
    throw new BadRequestError("Usuário já existe", httpCodes.BAD_REQUEST);
  }

  try {
    await userRepository.createUser({ ...signupPayload });
  } catch (error) {
    throw new BadRequestError(
      "Erro interno do servidor",
      httpCodes.INTERNAL_SERVER_ERROR,
    );
  }

  return {
    message: "Usuário registrado com sucesso",
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
        message: {
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

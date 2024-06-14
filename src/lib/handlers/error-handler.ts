import { FastifyReply, FastifyRequest } from "fastify";
import httpCodes from "@inip/http-codes";

export const errorHandler = (error, req: FastifyRequest, res: FastifyReply) => {
  if (error.validation) {
    res.status(httpCodes.BAD_REQUEST).send({
      message: "Dados de requisição inválidos",
      errors: error.validation,
    });
  } else {
    res.status(error.statusCode || httpCodes.INTERNAL_SERVER_ERROR).send({
      error: error,
      message: error.message || "Erro interno do servidor",
      statusCode: error.statusCode,
    });
  }
};

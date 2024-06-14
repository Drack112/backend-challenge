import { UserDTO } from "@/domain/entities";
import BadRequestError from "@/lib/error/BadRequestErrors";
import { preHandlerHookHandler } from "fastify";
import httpCodes from "@inip/http-codes";

export const authGuard: preHandlerHookHandler = async function (
  request,
  reply,
): Promise<void> {
  const user: UserDTO = request.user!;

  if (!user) {
    reply
      .code(httpCodes.UNAUTHORIZED)
      .send(new BadRequestError("Não autorizado", httpCodes.UNAUTHORIZED));
    return;
  }
};

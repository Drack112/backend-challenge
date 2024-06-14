import { FastifyPlugin } from "fastify";
import { TaskRepository } from "@/modules/task/db/task.repository";
import { RequestHandler } from "@/types/fastify";
import BadRequestError from "@/lib/error/BadRequestErrors";
import httpCodes from "@inip/http-codes";
import { TaskDTO } from "@/domain/entities";
import { authGuard } from "@/lib/decorators/auth-guard";

export const findTaskById: FastifyPlugin = async function (
  instance,
  options,
  done,
): Promise<void> {
  instance.route({
    method: "GET",
    url: "/:id",
    schema,
    handler,
    preHandler: authGuard,
  });
};

export const handler: RequestHandler<{ id: string }> = async function (
  req,
  res,
): Promise<TaskDTO> {
  const { id } = req.params as { id: string };
  const taskRepository = new TaskRepository();

  const task = await taskRepository.findOneTask(id);

  if (!task) {
    throw new BadRequestError("Task não encontrada", httpCodes.NOT_FOUND);
  }

  return task.toResultObject();
};

const schema = {
  tags: ["Task"],
  params: {
    type: "object",
    properties: {
      id: { type: "string" },
    },
    required: ["id"],
  },
  response: {
    200: {
      type: "object",
      properties: {
        id: { type: "string" },
        title: { type: "string" },
        description: { type: "string" },
        status: { type: "string" },
        createdAt: { type: "string", format: "date-time" },
        updatedAt: { type: "string", format: "date-time" },
      },
    },
    404: {
      type: "object",
      properties: {
        message: { type: "string" },
      },
    },
  },
};

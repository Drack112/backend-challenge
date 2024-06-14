import { RequestHandler } from "@/types/fastify";
import { TaskDeleteParams } from "@/types/task";
import { FastifyPlugin } from "fastify";
import { TaskRepository } from "../../db/task.repository";
import { authGuard } from "@/lib/decorators/auth-guard";
import BadRequestError from "@/lib/error/BadRequestErrors";
import httpCodes from "@inip/http-codes";

export const deleteTask: FastifyPlugin = async function (
  instance,
  options,
  done,
): Promise<void> {
  instance.route({
    method: "DELETE",
    url: "/:id",
    schema,
    handler,
    preHandler: authGuard,
  });
};

export const handler: RequestHandler<TaskDeleteParams> = async function (
  req,
  res,
): Promise<{ message: string }> {
  const { id } = req.params as TaskDeleteParams;
  const taskRepository = new TaskRepository();

  const task = await taskRepository.findOneTask(id);
  if (!task) {
    throw new BadRequestError("Task não encontrada", httpCodes.NOT_FOUND);
  }

  await taskRepository.deleteOne(task.id);
  return { message: "Tarefa deletada com sucesso" };
};

const schema = {
  tags: ["Task"],
  body: {
    type: "object",
    properties: {
      title: { type: "string" },
      description: { type: "string" },
      status: { type: "string" },
    },
    required: ["title", "description", "status"],
  },
  response: {
    200: {
      type: "object",
      properties: {
        message: { type: "string" },
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

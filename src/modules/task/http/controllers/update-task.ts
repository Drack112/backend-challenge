import { RequestHandler } from "@/types/fastify";
import { TaskUpdateBody, TaskUpdateParams } from "@/types/task";
import { TaskRepository } from "../../db/task.repository";
import BadRequestError from "@/lib/error/BadRequestErrors";
import httpCodes from "@inip/http-codes";
import { TaskDTO } from "@/domain/entities";
import { FastifyPlugin } from "fastify";
import { authGuard } from "@/lib/decorators/auth-guard";

export const updateTask: FastifyPlugin = async function (
  instance,
  options,
  done,
): Promise<void> {
  instance.route({
    method: "PUT",
    url: "/:id",
    schema,
    handler,
    preHandler: authGuard,
  });
};

export const handler: RequestHandler<TaskUpdateBody, TaskUpdateParams> =
  async function (req, res): Promise<TaskDTO> {
    const { id } = req.params as TaskUpdateParams;
    const updatePayload = req.body as TaskUpdateBody;
    const taskRepository = new TaskRepository();

    const existingTask = await taskRepository.findOneTask(id);

    if (!existingTask) {
      throw new BadRequestError("Task não encontrada", httpCodes.NOT_FOUND);
    }

    existingTask.title = updatePayload.title;
    existingTask.description = updatePayload.description;
    existingTask.status = updatePayload.status;

    try {
      const updatedTask = await taskRepository.updateOneTask(id, updatePayload);
      return updatedTask.toResultObject();
    } catch (error) {
      throw new BadRequestError(
        "Erro ao atualizar a task",
        httpCodes.INTERNAL_SERVER_ERROR,
      );
    }
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
    500: {
      type: "object",
      properties: {
        message: { type: "string" },
      },
    },
  },
};

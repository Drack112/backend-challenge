import { Task } from "@/domain/entities";
import { RequestHandler } from "@/types/fastify";
import { TaskCreateBody } from "@/types/task";
import { FastifyPlugin } from "fastify";
import { TaskRepository } from "../../db/task.repository";
import { authGuard } from "@/lib/decorators/auth-guard";

export const createTask: FastifyPlugin = async function (
  instance,
  options,
  done,
): Promise<void> {
  instance.route({
    method: "DELETE",
    url: "/",
    schema,
    handler,
    preHandler: authGuard,
  });
};

export const handler: RequestHandler<TaskCreateBody> = async function (
  req,
  res,
): Promise<Task> {
  const taskPayload = req.body;
  const taskRepository = new TaskRepository();

  const task = await taskRepository.createTask({ ...taskPayload });
  return task;
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
        id: { type: "string" },
        title: { type: "string" },
        description: { type: "string" },
        status: { type: "string" },
        createdAt: { type: "string", format: "date-time" },
        updatedAt: { type: "string", format: "date-time" },
      },
    },
  },
};

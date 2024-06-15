import { TaskDTO } from "@/domain/entities";
import { RequestHandler } from "@/types/fastify";
import { PaginationInfo, PaginationParams } from "@/types/request";
import { FastifyPlugin } from "fastify";
import { TaskRepository } from "../../db/task.repository";
import { authGuard } from "@/lib/decorators/auth-guard";

export const getAllTasks: FastifyPlugin = async function (
  instance,
  options,
  done,
): Promise<void> {
  instance.route({
    method: "GET",
    url: "/",
    schema,
    handler,
    preHandler: authGuard,
  });
};

export const handler: RequestHandler<null, PaginationParams> = async function (
  req,
  res,
): Promise<{ tasks: TaskDTO[]; pagination: PaginationInfo }> {
  const taskRepository = new TaskRepository();
  const { page = 1, limit = 10 } = req.query as PaginationParams;

  const [tasks, totalTasks] = await Promise.all([
    taskRepository.findTasks(page, limit, req.user!),
    taskRepository.countTasks(req.user!),
  ]);

  const totalPages = Math.ceil(totalTasks / limit);

  const taskDTOs = tasks.map(task => task.toResultObject());

  const paginationInfo: PaginationInfo = {
    page,
    limit,
    totalPages,
    totalTasks,
  };

  return {
    tasks: taskDTOs,
    pagination: paginationInfo,
  };
};

const schema = {
  tags: ["Task"],
  querystring: {
    type: "object",
    properties: {
      page: { type: "number", default: 1 },
      limit: { type: "number", default: 10 },
    },
    required: [],
  },
  response: {
    200: {
      type: "object",
      properties: {
        tasks: {
          type: "array",
          items: {
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
        pagination: {
          type: "object",
          properties: {
            page: { type: "number" },
            limit: { type: "number" },
            totalPages: { type: "number" },
            totalTasks: { type: "number" },
          },
        },
      },
    },
  },
};

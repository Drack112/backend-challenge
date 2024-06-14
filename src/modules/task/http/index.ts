import { FastifyPlugin } from "fastify";
import { createTask } from "./controllers/create-task";
import { getAllTasks } from "./controllers/get-tasks";
import { findTaskById } from "./controllers/find-one-task";
import { updateTask } from "./controllers/update-task";
import { deleteTask } from "./controllers/delete-task";

export const task: FastifyPlugin = async (
  instance,
  options,
  done,
): Promise<void> => {
  instance.register(createTask);
  instance.register(getAllTasks);
  instance.register(findTaskById);
  instance.register(updateTask);
  instance.register(deleteTask);
};

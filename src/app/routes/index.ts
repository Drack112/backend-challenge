import { FastifyPlugin } from "fastify";
import { auth } from "@/modules/auth/http";
import { task } from "@/modules/task/http";

export const routes: FastifyPlugin = async function (
  instance,
  options,
  done,
): Promise<void> {
  instance.register(auth, { prefix: "/auth" }),
    instance.register(task, { prefix: "/task" });
};

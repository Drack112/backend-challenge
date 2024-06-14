import { FastifyCore } from "@/app";
import { initORM } from "@/infra/db";

const server = async () => {
  await initORM();
  const app = new FastifyCore();

  await app.listen();
};

server();

import { User } from "@/domain/entities";

declare module "fastify" {
  interface FastifyInstance {
    authGuard(request: FastifyRequest, reply: FastifyReply): void;
  }

  interface FastifyRequest {
    user?: User;
  }
}

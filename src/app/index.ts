import "@/app/augmentations/fastify";

import fastify, { FastifyInstance } from "fastify";
import fastifySwagger from "@fastify/swagger";
import fastifySwaggerUi from "@fastify/swagger-ui";
import fastifyCors from "@fastify/cors";
import helmet from "@fastify/helmet";

import config from "../lib/config";
import { IncomingMessage, Server, ServerResponse } from "http";

import { requestSerializer, responseSerializer } from "./serializers";
import { routes } from "./routes";
import { errorHandler } from "@/lib/handlers/error-handler";
import { bearer } from "./plugins/bearer";

export class FastifyCore {
  private readonly server: FastifyInstance<
    Server,
    IncomingMessage,
    ServerResponse
  >;

  constructor() {
    this.server = fastify({
      logger: {
        level: config.logger.level,
        redact: ["req.headers.authorization"],
        serializers: {
          res: responseSerializer,
          req: requestSerializer,
        },
      } as any,
    });

    // Core plugins
    this.server.register(helmet, config.helmet);
    this.server.register(fastifyCors);
    this.server.register(bearer);

    // Documentations
    this.server.register(fastifySwagger, {
      swagger: {
        info: {
          title: config.swagger.info.title,
          version: config.swagger.info.version,
        },
        host: config.swagger.host,
        schemes: config.swagger.schemes,
        consumes: config.swagger.consumes,
        produces: config.swagger.produces,
        securityDefinitions: {
          bearerAuth: {
            type: "apiKey",
            name: "Authorization",
            in: "header",
            description: "Enter your JWT token in the format 'Bearer {token}'",
          },
        },
        security: [{ bearerAuth: [] }],
      },
    });
    this.server.register(fastifySwaggerUi, {
      routePrefix: "/docs",
    });

    // Handlers
    this.server.setErrorHandler(errorHandler);

    // Routes
    this.server.register(routes);

    this.server.ready(() => {
      console.log(this.server.printRoutes());
    });
  }

  async listen(): Promise<unknown> {
    try {
      return this.server.listen({ port: config.port, host: "0.0.0.0" });
    } catch (err) {
      this.server.log.error(err);
      process.exit(1);
    }
  }
}

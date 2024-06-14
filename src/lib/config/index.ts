const config = {
  port: 8080,
  logger: {
    prettyPrint: true,
    level: "info",
  },
  typeORM: {
    type: "postgres",
    host: "localhost",
    port: 5432,
    username: "postgres",
    password: "deger",
    database: "unknown_db",
    synchronize: true,
    logging: true,
  },
  auth: {
    jwtSecret: "gtrpohgkeropk12k3k124oi23j4oifefe",
    jwtExpires: "1d",
  },
  helmet: {
    contentSecurityPolicy: {
      directives: {
        defaultSrc: [`'self'`],
        styleSrc: [`'self'`, `'unsafe-inline'`],
        imgSrc: [`'self'`, "data:", "validator.swagger.io"],
        scriptSrc: [`'self'`, `https: 'unsafe-inline'`],
      },
    },
  },
  swagger: {
    info: {
      title: "TODO Clean Arch Fastify API",
      version: "0.1.0",
    },
    host: "localhost:8080",
    schemes: ["http"],
    consumes: ["application/json"],
    produces: ["application/json"],
    securityDefinitions: {
      bearer: {
        type: "http",
        scheme: "bearer",
        name: "Authorization token",
        bearerFormat: "JWT",
      },
    },
  },
};

export default config;

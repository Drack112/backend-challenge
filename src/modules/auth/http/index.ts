import { FastifyPlugin } from "fastify";

import { signUp } from "./controllers/sign-up";
import { signIn } from "./controllers/sign-in";

export const auth: FastifyPlugin = async (
  instance,
  options,
  done,
): Promise<void> => {
  instance.register(signUp);
  instance.register(signIn);
};

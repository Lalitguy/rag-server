import { ENV } from "./config/env";
import { createServer } from "./config/fastify";

const app = createServer();

app.ready(() => {
  app.listen({ port: Number(ENV.PORT) }, (err, address) => {
    if (err) {
      app.log.error(err);
      process.exit(1);
    }
    console.log(`Server running at ${address}`);
  });
});

import { bootstrap } from "./app";
import orm from "./config/db";


const PORT = 8081;

(
  async function () {
    try {
      const server = await bootstrap(PORT)

      const gracefulShutdown = () => {
        orm.close();
        server.close();
      }

      process.on('SIGINT', gracefulShutdown);
      process.on('SIGTERM', gracefulShutdown);

    } catch (err) {
      process.stderr.write(`failed to start app: ${(err as Error).message}`)
    }
  }
)();
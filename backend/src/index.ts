import { ApolloServer } from "apollo-server-express";
import "reflect-metadata";
import { buildSchema } from "type-graphql";
import dotenv from "dotenv";
import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import { createServer } from "http";
import resolvers from "./resolvers";
import { AppDataSource } from "./data-source";

dotenv.config();

const main = async () => {
  const schema = await buildSchema({ resolvers });

  const server = new ApolloServer({
    schema,
    csrfPrevention: true,
  });

  await server.start();

  const app = express();
  const httpServer = createServer(app);
  app.use(cookieParser());

  //TODO:  Change it in production
  app.use(
    cors({
      credentials: false,
    })
  );

  server.applyMiddleware({ app, cors: false });

  httpServer.listen(process.env.PORT || 8000, () =>
    console.log(`Server running: http://localhost:${process.env.PORT || 8000}`)
  );
};

AppDataSource.initialize()
  .then(() => {
    console.log("Data Source has been initialized!");
    main();
  })
  .catch((err) => {
    console.error("Error during Data Source initialization", err);
  });

import { ApolloServer } from "apollo-server-express";
import "reflect-metadata";
import { buildSchema } from "type-graphql";
import dotenv from "dotenv";
import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import jwt from "jsonwebtoken";
import { createServer } from "http";
import resolvers from "./resolvers";
import { AppDataSource } from "./data-source";
import User from "./entities/User";
import authChecker from "./utils/authchecker";

dotenv.config();

const main = async () => {
  const schema = await buildSchema({ resolvers, authChecker });

  const server = new ApolloServer({
    schema,
    csrfPrevention: true,
    context: async ({
      req,
      res,
    }: {
      req: express.Request;
      res: express.Response;
    }) => {
      let user;
      const token = req.cookies.token;
      if (token) {
        try {
          const decoded: any = jwt.verify(token, process.env.JWT_SECRET!);
          user = await User.findOne({ where: { id: decoded } });
        } catch (e) {
          console.log(e);
        }
      }
      return { req, res, user };
    },
  });

  await server.start();

  const app = express();
  const httpServer = createServer(app);
  app.use(cookieParser());

  //TODO:  Change it in production
  app.use(
    cors({
      credentials: true,
      origin: ["https://studio.apollographql.com"],
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

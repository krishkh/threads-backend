import express from "express";
import { expressMiddleware } from "@apollo/server/express4";
import createApolloGraphqlServer from "./graphql";
import UserService from "./services/user";
async function init() {
  const app = express();
  const PORT = Number(process.env.PORT) || 8000;

  app.use(express.json());

  // createApolloGraphqlServer() returns an ApolloServer instance
  const server = await createApolloGraphqlServer();
  const graphqlMiddleware = expressMiddleware(server, {
    context: async ({ req }) => {
      const token = req.headers.authorization?.split(" ")[1];
      console.log("token:", token);
      if (!token) {
        return { message: "no  token", token: 0 };
      }
      try {
        const user = await UserService.decodeJWTToken(token as string);
        return { user };
      } catch (error) {
        console.log("ERROR: at line 24 src/index.ts \n\n", error);
        return { message: "Invalid token" };
      }
    },
  });
  app.use("/graphql", graphqlMiddleware as express.Express);

  app.get("/", (req, res) => {
    res.send("root routee");
  });

  app.listen(PORT, () => console.log(`Server running at ${PORT}`));
}

init();

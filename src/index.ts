import express from "express";
import { expressMiddleware } from "@apollo/server/express4";
import createApolloGraphqlServer from "./graphql";
async function init() {
  const app = express();
  const PORT = Number(process.env.PORT) || 8000;

  app.use(express.json());

  // createApolloGraphqlServer() returns an ApolloServer instance
  const server = await createApolloGraphqlServer();
  const graphqlMiddleware = expressMiddleware(server);
  app.use("/graphql", graphqlMiddleware as express.Express);

  app.get("/", (req, res) => {
    res.send("root routee");
  });

  app.listen(PORT, () => console.log(`Server running at ${PORT}`));
}

init();

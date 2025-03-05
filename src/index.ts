import express from "express";
import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";

async function init() {
  const app = express();
  const PORT = Number(process.env.PORT) || 8000;

  app.use(express.json());

  const gqlServer = new ApolloServer({
    typeDefs: `
      type Query {
        hello: String
        say(name: String): String
      }
    `,
    resolvers: {
      Query: {
        hello: () => "Hello, world!",
        say: (_, { name }) => `Hello, ${name}!`,
      },
    },
  });

  await gqlServer.start();

  app.use("/graphql", expressMiddleware(gqlServer) as express.Express);

  app.get("/", (req, res) => {
    res.send("root route");
  });

  const server = app.listen(PORT, () =>
    console.log(`Server running at ${PORT}`)
  );
}

init();

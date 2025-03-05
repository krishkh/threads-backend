import { ApolloServer } from "@apollo/server";
import { prismaClient } from "../lib/db";
import { User } from "./user";

async function createApolloGraphqlServer() {
  const gqlServer = new ApolloServer({
    typeDefs: `
      type Query{
       say(name: String): String
      }
      type Mutation{
        ${User.mutations}
      }
    `,
    resolvers: {
      Query: {
        ...User.resolvers.queries,
      },
      Mutation: {
        ...User.resolvers.mutations,
      },
    },
  });

  await gqlServer.start();
  return gqlServer;
}
export default createApolloGraphqlServer;

const queries = {};
const mutations = {
  createUser: async (_: any, {}: any) => {
    return "User Created";
  },
};

export const resolvers = { queries, mutations };

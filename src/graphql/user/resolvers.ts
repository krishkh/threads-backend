import UserService, {
  CreateUserPayload,
  GetUserTokenPayload,
} from "../../services/user";

const queries = {
  getUserToken: async (_: any, payload: GetUserTokenPayload) => {
    const res = await UserService.getUserToken(payload);
    return res;
  },
  getCurrentLoggedInUser: async (_: any, parameters: any, context: any) => {
    console.log(context);
    return UserService.getUserById(context.user.id);
  },
};
const mutations = {
  createUser: async (_: any, payload: CreateUserPayload) => {
    const res = await UserService.createUser(payload);
    return res.id;
  },
};

export const resolvers = { queries, mutations };

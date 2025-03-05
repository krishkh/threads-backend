import { createHmac, randomBytes } from "node:crypto";
import { prismaClient } from "../lib/db";
import JWT from "jsonwebtoken";
export interface CreateUserPayload {
  firstName: string;
  lastName?: string;
  email: string;
  password: string;
}

export interface GetUserTokenPayload {
  email: string;
  password: string;
}

const JWT_SECRET = "mysecret";

class UserService {
  private static async getUserByEmail(email: string) {
    return await prismaClient.user.findUnique({
      where: { email },
    });
  }
  private static generateHash(salt: string, password: string) {
    const hashedPassword = createHmac("sha256", salt)
      .update(password)
      .digest("hex");
    return hashedPassword;
  }
  public static createUser(payload: CreateUserPayload) {
    const { firstName, lastName, email, password } = payload;
    const salt = randomBytes(16).toString("hex");
    const hashedPassword = this.generateHash(salt, password);
    return prismaClient.user.create({
      data: {
        firstName,
        lastName,
        email,
        password: hashedPassword,
        salt,
      },
    });
  }

  public static async getUserToken(payload: GetUserTokenPayload) {
    const { email, password } = payload;
    const user = await this.getUserByEmail(email);
    if (!user) {
      throw new Error("User not found");
    }
    const userSalt = user.salt;
    const hashedPassword = await this.generateHash(userSalt, password);
    if (hashedPassword !== user.password) {
      throw new Error("Invalid  password");
    }
    const token = JWT.sign({ email }, JWT_SECRET, { expiresIn: "1h" });
    return token;
  }
}
export default UserService;

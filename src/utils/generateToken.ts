import jwt, { SignOptions } from "jsonwebtoken";
import { UserType } from "../interfaces/user.type";

export const generateToken = (
  userData: UserType,
  expiresIn: any,
  jwt_secret: string
): string => {
  const payload = {
    id: userData.id,
    name: userData.name,
    email: userData.email,
    role: userData.role,
  };

  const options: SignOptions = { expiresIn };

  // TypeScript now accepts JWT_SECRET as Secret
  const token = jwt.sign(payload, jwt_secret, options);

  return token;
};

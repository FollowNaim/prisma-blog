import { NextFunction, Request, Response } from "express";
import auth from "../lib/auth";
declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        email: string;
        name: string;
        role: string;
        emailVerified: boolean;
      };
    }
  }
}

export enum UserRole {
  admin = "admin",
  user = "user",
}

const authMiddleware = (...roles: UserRole[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    console.log("middleware!!!");
    const session = await auth.api.getSession({
      headers: req.headers as any,
    });
    if (!session) {
      return res.status(401).json({
        success: false,
        message: "You are not authorized!",
      });
    }
    if (!session.user.emailVerified) {
      return res.status(403).json({
        success: false,
        message: "Email verification is required, Please verify your email",
      });
    }
    req.user = {
      id: session.user.id,
      name: session.user.name,
      email: session.user.email,
      role: session.user.role as string,
      emailVerified: session.user.emailVerified,
    };
    if (roles.length && !roles.includes(session.user.role as UserRole)) {
      console.log(session);
      return res.status(403).json({
        success: false,
        message: "Forbidden! You don't have permission to access the resources",
      });
    }

    next();
  };
};

export default authMiddleware;

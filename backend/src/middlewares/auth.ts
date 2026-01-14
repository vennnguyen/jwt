import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import "dotenv/config";

import { findUserById } from "../service/user.service";

export const protectedRoute = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  //authorization -xác minh user là ai
  try {
    //lấy token từ header
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1]; //Bearer <token>

    if (!token) {
      return res.status(401).json({ message: "Không tìm thấy token" });
    }
    //xác nhận token hợp lệ
    jwt.verify(
      token,
      process.env.ACCESS_TOKEN_SECRET,
      async (err, decodeUser) => {
        if (err) {
          console.error(err);
          return res
            .status(403)
            .json({ message: "Token không đúng hoặc hết hạn" });
        }
        // tìm user
        const user = await findUserById(
          (decodeUser as { userId: string }).userId
        );
        if (!user) {
          return res.status(403).json({ message: "Người dùng không tồn tại" });
        }
        //trả về trong req
        req.user = {
          id: user.id,
          email: user.email,
          username: user.username,
        };
        next();
      }
    );
  } catch (error) {
    console.error("Lỗi khi xác minh");
    return res.status(500).json({ message: "Lỗi hệ thống" });
  }
};

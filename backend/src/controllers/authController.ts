import e, { Request, Response } from "express";
import {
  createSession,
  createUser,
  deleteSession,
  findUser,
  isUserExits,
} from "../service/auth";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import "dotenv/config";
const ACCESS_TOKEN_TTL = "30m";
const REFRESH_TOKEN_TTL = 14 * 24 * 60 * 60 * 1000;

const signUpController = async (req: Request, res: Response) => {
  try {
    const { username, password, email, lastName, firstName } = req.body;
    if (!username || !password || !email || !lastName || !firstName) {
      return res.status(401).json({
        message:
          "Không được thiếu username, password, email, lastName, firstName",
      });
    }
    //kiểm tra user tồn tại chưa
    const duplicate = await isUserExits(username);
    if (duplicate) {
      return res.status(409).json({ message: "Username đã tồn tại" });
    }
    //mã hóa password
    const hashedPassWord = await bcrypt.hash(password, 10); //salt = 10

    // tạo user mới
    const fullName = firstName + " " + lastName;
    await createUser(username, hashedPassWord, email, fullName);

    return res.status(204).json({
      message: "Tạo mới người dùng thành công",
    });
  } catch (error) {
    console.error("Lỗi khi gọi signUp", error);
    return res.status(500).json({ message: "Lỗi hệ thống" });
  }
};

const signInController = async (req: Request, res: Response) => {
  try {
    //lấy input
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ message: "Thiếu username hoặc password" });
    }
    const user = await findUser(username);
    if (!user)
      return res
        .status(401)
        .json({ message: "Username hoặc password không chính xác" });
    //lấy hashpassword để so sánh input
    const passwordCorrect = await bcrypt.compare(password, user.password);
    if (!passwordCorrect) {
      return res
        .status(401)
        .json({ message: "Username hoặc mật khẩu không chính xác" });
    }
    //nếu khợp tạo access_token
    const access_token = jwt.sign(
      { userId: user.id },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: ACCESS_TOKEN_TTL }
    ); // payload,secret,expiresIn
    // tạo refresh_token
    const refresh_token = crypto.randomUUID().toString();
    //tạo session để lưu ref_token
    await createSession(user.id, refresh_token, REFRESH_TOKEN_TTL);
    //trả access_token về cookies
    return res
      .status(201)
      .json({ message: "Đăng nhập thành công", access_token });
  } catch (error) {
    console.error("Lỗi khi gọi signIn", error);
    return res.status(500).json({ message: "Lỗi hệ thống" });
  }
};

const signOutController = async (req: Request, res: Response) => {
  try {
    // lấy acc_token cookies
    const token = req.cookies?.refresh_token;
    if (token) {
      //xóa ref_token trong db
      await deleteSession(token);
      //xóa cookie
      res.clearCookie("refreshToken");
    }
    return res.sendStatus(204);
  } catch (error) {
    console.error("Lỗi khi gọi signIn", error);
    return res.status(500).json({ message: "Lỗi hệ thống" });
  }
};
export { signUpController, signInController, signOutController };

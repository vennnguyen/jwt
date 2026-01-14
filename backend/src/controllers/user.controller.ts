import { Request, Response } from "express";
const authMe = (req: Request, res: Response) => {
  try {
    const user = req.user;
    return res.status(201).json({ user });
  } catch (error) {
    console.error("Lỗi khi gọi auth me", error);
    return res.status(500).json({ message: "Lỗi hệ thống" });
  }
};
export { authMe };

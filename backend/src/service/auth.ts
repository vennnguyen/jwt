import { prisma } from "../config/client";

const isUserExits = async (username: string) => {
  return await prisma.user.findUnique({
    where: {
      username: username,
    },
  });
};
const findUser = async (username: string) => {
  return await prisma.user.findUnique({
    where: {
      username,
    },
  });
};

const createUser = async (
  username: string,
  password: string,
  email: string,
  fullName: string
) => {
  await prisma.user.create({
    data: {
      username: username,
      password: password,
      email: email,
      displayName: fullName,
    },
  });
  return;
};

const createSession = async (
  userId: number,
  refresh_token: string,
  expiresIn: number
) => {
  return await prisma.session.create({
    data: {
      userId: userId,
      refreshToken: refresh_token,
      expiresAt: new Date(Date.now() + expiresIn),
    },
  });
};
const deleteSession = async (ref_token: string) => {
  return await prisma.session.delete({
    where: {
      refreshToken: ref_token,
    },
  });
};
export { isUserExits, createUser, findUser, createSession, deleteSession };

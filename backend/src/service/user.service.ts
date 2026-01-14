import { prisma } from "../config/client";

const findUserById = async (id: string) => {
  return await prisma.user.findUnique({
    where: {
      id: +id,
    },
    select: {
      id: true,
      username: true,
      email: true,
      avatarId: true,
      avatarUrl: true,
      displayName: true,
      phone: true,
    },
  });
};
export { findUserById };

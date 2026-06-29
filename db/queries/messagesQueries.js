import prisma from "../pool.js";

async function getAllMessages() {
  const rows = await prisma.messages.findMany({ include: { users: true } });
  return rows;
}

async function getSingleMessage(id) {
  const message = await prisma.messages.findFirst({
    where: {
      id: Number(id),
    },
    include: {
      users: true,
    },
  });

  return message;
}

async function newMessage(id, title, text) {
  await prisma.messages.create({
    data: {
      user_id: Number(id),
      title: title,
      text: text,
    },
  });

  return;
}

async function getUserMessages(id) {
  const rows = await prisma.messages.findMany({
    where: {
      user_id: Number(id),
    },
    include: {
      users: true,
    },
  });

  return rows;
}

async function deleteMessagePost(id) {
  await prisma.messages.delete({
    where: {
      id: Number(id),
    },
  });

  return;
}

export {
  getAllMessages,
  getSingleMessage,
  newMessage,
  getUserMessages,
  deleteMessagePost,
};

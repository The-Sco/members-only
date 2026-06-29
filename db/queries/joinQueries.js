import prisma from "../pool.js";

async function setMember(id) {
  await prisma.users.update({
    where: {
      id: Number(id),
    },
    data: {
      is_member: true,
    },
  });

  return;
}

async function setAdmin(id) {
  await prisma.users.update({
    where: {
      id: Number(id),
    },
    data: {
      is_admin: true,
    },
  });

  return;
}

async function reset(id) {
  await prisma.users.update({
    where: {
      id: Number(id),
    },
    data: {
      is_admin: false,
      is_member: false,
    },
  });

  return;
}

export { setAdmin, setMember, reset };

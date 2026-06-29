import prisma from "../pool.js";
import bcrypt from "bcryptjs";

async function checkIfUserExists(username) {
  const rows = await prisma.users.findFirst({
    where: {
      username: username,
    },
  });

  if (rows) {
    return true;
  }

  return false;
}

async function newUser(first_name, last_name, username, password) {
  const hashedPassword = await bcrypt.hash(password, 10);
  const rows = await prisma.users.createManyAndReturn({
    data: {
      first_name: first_name,
      last_name: last_name,
      username: username,
      password: hashedPassword,
    },
  });

  return rows[0];
}

export { newUser, checkIfUserExists };

import { PrismaClient } from "@prisma/client";

// This should work if Prisma is generating the correct client
const client = new PrismaClient();
console.log(client);


client.$connect()
  .then(() => console.log("Prisma Client connected"))
  .catch((err) => console.error("Failed to connect Prisma Client", err));


export default client;

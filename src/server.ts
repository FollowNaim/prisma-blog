import { Request, Response } from "express";
import app from "../app";
import { prisma } from "../lib/prisma";

const port = process.env.PORT || 5000;

async function main() {
  try {
    await prisma.$connect();
    console.log("client connected successfully");
    app.get("/", (req: Request, res: Response) => {
      res.send("wow working");
    });
    app.listen(port, () => {
      console.log(`server is running on port ${port}`);
    });
  } catch (err) {
    console.log(err);
    await prisma.$disconnect();
    process.exit(1);
  }
}

main();

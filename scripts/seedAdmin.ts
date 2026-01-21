import { prisma } from "../lib/prisma";

console.log("🔥 seedAdmin.ts file loaded");

(async () => {
  console.log("🚀 createAdmin started");

  try {
    const adminUser = {
      name: "naim admin",
      email: "naim@123.com",
      password: "admin123",
    };

    const isExists = await prisma.user.findUnique({
      where: { email: adminUser.email },
    });

    console.log("User exists?", !!isExists);

    if (isExists) {
      console.log("⚠️ Admin already exists");
      return;
    }

    const response = await fetch(
      "http://localhost:5000/api/auth/sign-up/email",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Origin: "http://localhost:5000",
        },
        body: JSON.stringify(adminUser),
      },
    );

    if (response.ok) {
      await prisma.user.update({
        where: {
          email: adminUser.email,
        },
        data: { emailVerified: true },
      });
    }

    const data = await response.json();
  } catch (err) {
  } finally {
    await prisma.$disconnect();
    process.exit(0);
  }
})();

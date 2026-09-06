import express from "express";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "@repo/backend-common/config";
import { middleware } from "./middleware";
import { CreateRoomSchema, CreateUserSchema, SigninSchema } from "@repo/common/types";
import { prismaClient } from "@repo/db/client";
import bcrypt from "bcrypt";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

app.post("/signup", async (req, res) => {
  const parsedData = CreateUserSchema.safeParse(req.body);
  if (!parsedData.success) {
    res.status(400).json({
      message: parsedData.error.issues[0]?.message || "Incorrect input",
    });
    return;
  }

  try {
    const hashedPassword = await bcrypt.hash(parsedData.data.password, 10);

    const user = await prismaClient.user.create({
      data: {
        email: parsedData.data.username,
        password: hashedPassword,
        name: parsedData.data.name,
      },
    });

    res.json({
      userId: user.id,
    });
  } catch (e: any) {
    if (e?.code === "P2002") {
      res.status(409).json({
        message: "An account with this email already exists. Please sign in instead.",
      });
      return;
    }
    console.error("Error creating user:", e);
    res.status(500).json({
      message: "Something went wrong. Please try again.",
    });
  }
});

app.post("/signin", async (req, res) => {
  const parsedData = SigninSchema.safeParse(req.body);
  if (!parsedData.success) {
    res.status(400).json({
      message: parsedData.error.issues[0]?.message || "Incorrect inputs",
    });
    return;
  }

  const user = await prismaClient.user.findFirst({
    where: {
      email: parsedData.data.username,
    },
  });

  if (!user) {
    res.status(403).json({
      message: "No account found with this email. Please sign up first.",
    });
    return;
  }

  const validPassword = await bcrypt.compare(parsedData.data.password, user.password);

  if (!validPassword) {
    res.status(403).json({
      message: "Incorrect password. Please try again.",
    });
    return;
  }

  const token = jwt.sign(
    {
      userId: user?.id,
    },
    JWT_SECRET
  );

  res.json({
    token,
  });
});

app.post("/room", middleware, async (req, res) => {
  const parsedData = CreateRoomSchema.safeParse(req.body);
  if (!parsedData.success) {
    res.status(400).json({
      message: parsedData.error.issues[0]?.message || "Incorrect inputs",
    });
    return;
  }

  const userId = req.userId;
  try {
    const room = await prismaClient.room.create({
      data: {
        slug: parsedData.data.name,
        adminId: userId,
      },
    });
    res.json({
      roomId: room.id,
    });
  } catch (e) {
    res.status(500).json({
      message: "Could not create room. Please try again.",
    });
  }
});

app.get("/chats/:roomId", async (req, res) => {
  try {
    const roomId = Number(req.params.roomId);
    const messages = await prismaClient.chat.findMany({
      where: {
        roomId: roomId,
      },
      orderBy: {
        id: "desc",
      },
      take: 1000,
    });

    res.json({
      messages,
    });
  } catch (e) {
    console.error("Error fetching chats:", e);
    res.json({
      messages: [],
    });
  }
});

app.get("/room/:slug", async (req, res) => {
  const slug = req.params.slug;
  const room = await prismaClient.room.findFirst({
    where: {
      slug,
    },
  });

  res.json({
    room,
  });
});

app.listen(3001, () => {
  console.log("HTTP server running on port 3001");
});
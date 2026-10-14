
require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { z } = require("zod");
const Lead = require("./models/Lead");

const app = express();

app.disable("x-powered-by");
app.use(helmet());
app.use(
  cors({
    origin: process.env.CLIENT_URL,
    methods: ["GET", "POST", "PATCH", "OPTIONS"],
  })
);
app.use(express.json({ limit: "10kb" }));

const leadLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 5,
  standardHeaders: true,
  legacyHeaders: false,
});

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 5,
  standardHeaders: true,
  legacyHeaders: false,
});

const leadSchema = z.object({
  name: z.string().trim().min(2).max(100),
  email: z.string().trim().email().max(254),
  phone: z.string().trim().max(20).optional().default(""),
  company: z.string().trim().max(120).optional().default(""),
  service: z.string().trim().min(2).max(100),
  message: z.string().trim().min(10).max(3000),
  website: z.string().max(0).optional(),
});

function authenticate(req, res, next) {
  const header = req.headers.authorization || "";
  const token = header.startsWith("Bearer ")
    ? header.slice(7)
    : "";

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);

    if (payload.role !== "admin") {
      throw new Error("Invalid role");
    }

    req.admin = payload;
    next();
  } catch {
    return res.status(401).json({
      message: "Authentication required",
    });
  }
}

app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});

app.post("/api/leads", leadLimiter, async (req, res, next) => {
  try {
    const parsed = leadSchema.safeParse(req.body);

    if (!parsed.success) {
      return res.status(400).json({
        message: "Please check the form fields and try again.",
        errors: parsed.error.flatten().fieldErrors,
      });
    }

    if (parsed.data.website) {
      return res.status(400).json({
        message: "Invalid submission",
      });
    }

    const { website, ...data } = parsed.data;
    const lead = await Lead.create(data);

    return res.status(201).json({
      message: "Thanks! Your enquiry has been received.",
      id: lead._id,
    });
  } catch (error) {
    next(error);
  }
});

app.post("/api/admin/login", loginLimiter, async (req, res) => {
  const { username, password } = req.body || {};

  if (
    typeof username !== "string" ||
    typeof password !== "string" ||
    username.length > 100 ||
    password.length > 200
  ) {
    return res.status(400).json({
      message: "Invalid credentials",
    });
  }

  try {
    const valid =
      username === process.env.ADMIN_USERNAME &&
      await bcrypt.compare(
        password,
        process.env.ADMIN_PASSWORD_HASH
      );

    if (!valid) {
      return res.status(401).json({
        message: "Invalid credentials",
      });
    }

    const token = jwt.sign(
      { role: "admin" },
      process.env.JWT_SECRET,
      { expiresIn: "2h" }
    );

    return res.json({ token, expiresIn: 7200 });
  } catch {
    return res.status(500).json({
      message: "Login failed",
    });
  }
});

app.get("/api/admin/leads", authenticate, async (req, res, next) => {
  try {
    const leads = await Lead.find()
      .sort({ createdAt: -1 })
      .limit(200)
      .lean();

    return res.json({ leads });
  } catch (error) {
    next(error);
  }
});

app.patch(
  "/api/admin/leads/:id",
  authenticate,
  async (req, res, next) => {
    try {
      const parsed = z
        .object({
          status: z.enum([
            "new",
            "contacted",
            "qualified",
            "closed",
          ]),
        })
        .safeParse(req.body);

      if (!parsed.success) {
        return res.status(400).json({
          message: "Invalid lead status",
        });
      }

      const lead = await Lead.findByIdAndUpdate(
        req.params.id,
        { status: parsed.data.status },
        { new: true, runValidators: true }
      );

      if (!lead) {
        return res.status(404).json({
          message: "Lead not found",
        });
      }

      return res.json({ lead });
    } catch (error) {
      if (error.name === "CastError") {
        return res.status(400).json({
          message: "Invalid lead ID",
        });
      }

      next(error);
    }
  }
);

app.use((error, req, res, next) => {
  console.error(error.message);

  if (res.headersSent) {
    return next(error);
  }

  return res.status(500).json({
    message: "Something went wrong. Please try again.",
  });
});

async function startServer() {
  const required = [
    "MONGODB_URI",
    "CLIENT_URL",
    "JWT_SECRET",
    "ADMIN_USERNAME",
    "ADMIN_PASSWORD_HASH",
  ];

  const missing = required.filter(
    (key) => !process.env[key]
  );

  if (missing.length) {
    console.error("Missing environment variables:", missing.join(", "));
    process.exit(1);
  }

  try {
    await mongoose.connect(process.env.MONGODB_URI);

    const port = process.env.PORT || 5000;

    app.listen(port, () => {
      console.log(`API running on port ${port}`);
    });
  } catch (error) {
    console.error("Database connection failed:", error.message);
    process.exit(1);
  }
}

startServer();

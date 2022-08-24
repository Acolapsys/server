const Router = require("express");
const { User, File } = require("../models/models");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { check, validationResult } = require("express-validator");
const authMiddleware = require("../middlewares/auth.middleware");
const FileService = require("../services/file.service");

const router = new Router();

router.post(
  "/register",
  [
    check("email", "Incorrect email").isEmail(),
    check(
      "password",
      "PAssword must be longer the 2 and shorter then 13"
    ).isLength({ min: 3, max: 12 })
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        return res.status(400).json({ message: "Incorrect request", errors });
      }

      const { email, password } = req.body;

      const candidate = await User.findOne({
        where: { email }
      });

      if (candidate) {
        return res
          .status(400)
          .json({ message: `User with email ${email} already exist` });
      }

      const hashPassword = await bcrypt.hash(password, 8);

      const user = await User.create({ email, password: hashPassword });
      await FileService.createDir(
        await File.create({
          userId: user.dataValues.id,
          name: "",
          type: "dir",
          rootUserId: user.dataValues.id
        })
      );
      return res.json({ message: "User was created" });
    } catch (e) {
      console.log(e);
      res.send({ message: "Server error!" });
    }
  }
);

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({
      where: { email },
      include: { model: File, as: "rootDir" }
    });
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    const isPassValid = bcrypt.compareSync(password, user.password);
    if (!isPassValid) {
      return res.status(400).json({ message: "Wrong password" });
    }

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET_KEY, {
      expiresIn: "1h"
    });
    return res.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        diskSpace: user.diskSpace,
        usedSpace: user.usedSpace,
        avatar: user.avatar,
        rootDirId: user.rootDir.id
      }
    });
  } catch (e) {
    console.log(e);
    res.send({ message: "Server error!" });
  }
});

router.get("/auth", authMiddleware, async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id, {
      include: { model: File, as: "rootDir" }
    });
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET_KEY, {
      expiresIn: "1h"
    });
    return res.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        diskSpace: user.diskSpace,
        usedSpace: user.usedSpace,
        avatar: user.avatar,
        rootDirId: user.rootDir.id
      }
    });
  } catch (e) {
    console.log(e);
    res.send({ message: "Server error!" });
  }
});

module.exports = router;

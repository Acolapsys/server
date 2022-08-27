const { File, User } = require("../models/models");
const FileService = require("../services/file.service");

class FileController {
  async createDir(req, res) {
    try {
      const { name, type, parentId } = req.body;

      const file = new File({
        name,
        type,
        parentId,
        userId: req.user.id
      });

      const parentFile = parentId
        ? await File.findOne({ where: { id: parentId } })
        : null;
      if (!parentFile) {
        file.path = name;
      } else {
        file.path = `${parentFile.path}\\${file.name}`;
      }
      await FileService.createDir(file);
      await file.save();
      return res.json(file);
    } catch (e) {
      return res.status(400).json(e);
    }
  }
  async getFiles(req, res) {
    try {
      const files = await File.findAll({
        where: {
          userId: req.user?.id || null,
          parentId: req.query?.parentId || null
        },
        include: { model: File, as: "children" }
      });
      return res.json(files);
    } catch (e) {
      return res.status(500).json(e);
    }
  }
  async getFileById(req, res) {
    try {
      const file = await File.findByPk(req.query.id);
      return res.json(file);
    } catch (e) {
      return res.status(500).json(e);
    }
  }
  async uploadFile(req, res) {
    try {
      const file = req.files.file;
      const parent = await File.findByPk(req.body.parentId);
      const user = await User.findByPk(req.user.id);

      if (user.usedSpace + file.size > user.diskSpace) {
        return res.status(400).json({ message: "Out of space" });
      }

      user.usedSpace += file.size;


      file.path = parent ? `${parent.path}\\${file.name}` : file.name;
      file.userId = user.id;
      const type = file.name.split(".").pop();

      const dbFile = await File.create({
        name: file.name,
        type,
        path: parent?.path,
        size: file.size,
        parentId: parent?.id,
        userId: req.user.id
      });

      await FileService.createFile(file);

      await user.save();
      return res.json(dbFile);
    } catch (e) {
      return res.status(400).json(e);
    }
  }
}

module.exports = new FileController();

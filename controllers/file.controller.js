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
}

module.exports = new FileController();

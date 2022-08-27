const fs = require("fs");
const { File } = require("../models/models");

class FileService {
  createDir(file) {
    return new Promise((resolve, reject) => {
      try {
        const filePath = `${process.env.FILE_PATH}\\${file.userId}\\${file.path}`;
        if (!fs.existsSync(filePath)) {
          fs.mkdirSync(filePath);
          return resolve({ message: "Directory was created" });
        } else {
          return reject({ message: "Directory is already exist" });
        }
      } catch (e) {
        return reject({ message: "File error" });
      }
    });
  }
  createFile(file) {
    return new Promise((resolve, reject) => {
      try {
        const filePath = `${process.env.FILE_PATH}\\${file.userId}\\${file.path}`;
        if (!fs.existsSync(filePath)) {
          file.mv(filePath);
          return resolve({ message: "File was created" });
        } else {
          return reject({ message: "File is already exist" });
        }
      } catch (e) {
        return reject({ message: "File error" });
      }
    });
  }
}

module.exports = new FileService();

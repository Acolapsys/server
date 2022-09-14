const fs = require("fs");
const path = require("path");

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
  deleteFile(file) {
    return new Promise((resolve, reject) => {
      try {
        if (file.type === "dir") {
          return reject({ message: "This is a directory" });
        }
        const filePath = path.join(
          process.env.FILE_PATH,
          String(file.userId),
          file.path,
          file.name
        );
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }

        return resolve({ message: "File deleted" });
      } catch (e) {
        return reject({ message: "Delete file error" });
      }
    });
  }
  deleteDir(dir) {
    return new Promise((resolve, reject) => {
      try {
        if (dir.type !== "dir") {
          return reject({ message: "This is not directory" });
        }
        const dirPath = path.join(
          process.env.FILE_PATH,
          String(dir.userId),
          dir.path,
          dir.name
        );
        if (fs.existsSync(dirPath)) {
          fs.rmSync(dirPath, { recursive: true, force: true });
        }

        return resolve({ message: "Directory deleted" });
      } catch (e) {
        console.log("12");
        return reject({ message: "Delete directory service error" });
      }
    });
  }
}

module.exports = new FileService();

const fs = require("fs");
const path = require("path");

class FileService {
  getPath(fileOrDir) {
    return path.join(
      process.env.FILE_PATH,
      String(fileOrDir.userId),
      fileOrDir.path
    );
  }

  createDir(dir) {
    return new Promise((resolve, reject) => {
      try {
        const dirPath = this.getPath(dir);
        if (!fs.existsSync(dirPath)) {
          fs.mkdirSync(dirPath);
          return resolve({ message: "Directory was created" });
        } else {
          return reject({ message: "Directory is already exist" });
        }
      } catch (e) {
        return reject({ message: "Directory creation serevice error" });
      }
    });
  }
  createFile(file) {
    return new Promise((resolve, reject) => {
      try {
        const filePath = this.getPath(file);
        if (!fs.existsSync(filePath)) {
          file.mv(filePath);
          return resolve({ message: "File was created" });
        } else {
          return reject({ message: "File is already exist" });
        }
      } catch (e) {
        return reject({ message: "File creation service error" });
      }
    });
  }
  deleteFile(file) {
    return new Promise((resolve, reject) => {
      try {
        if (file.type === "dir") {
          return reject({ message: "This is a directory" });
        }
        const filePath = this.getPath(file);
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }

        return resolve({ message: "File deleted" });
      } catch (e) {
        return reject({ message: "Delete file service error" });
      }
    });
  }
  deleteDir(dir) {
    return new Promise((resolve, reject) => {
      try {
        if (dir.type !== "dir") {
          return reject({ message: "This is not directory" });
        }
        const dirPath = this.getPath(dir)
        if (fs.existsSync(dirPath)) {
          fs.rmSync(dirPath, { recursive: true, force: true });
        }

        return resolve({ message: "Directory deleted" });
      } catch (e) {
        return reject({ message: "Delete directory service error" });
      }
    });
  }
}

module.exports = new FileService();

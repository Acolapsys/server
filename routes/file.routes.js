const Router = require("express");
const { File } = require("../models/models");
const authMiddleware = require("../middlewares/auth.middleware");
const FileController = require("../controllers/file.controller")

const router = new Router();

router.post('', authMiddleware, FileController.createDir)
router.get('', authMiddleware, FileController.getFiles)
router.get('/file', authMiddleware, FileController.getFileById)


module.exports = router;

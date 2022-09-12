const Router = require("express");
const authMiddleware = require("../middlewares/auth.middleware");
const FileController = require("../controllers/file.controller")

const router = new Router();

router.post('', authMiddleware, FileController.createDir)
router.post('/upload', authMiddleware, FileController.uploadFile)
router.get('', authMiddleware, FileController.getFiles)
router.get('/file', authMiddleware, FileController.getFileById)
router.get('/download', authMiddleware, FileController.downloadFile)


module.exports = router;

require("dotenv").config({ path: '.env.local' });;

const express = require("express");
const sequelize = require("./db");
const cors = require("cors")
const fileUpload = require("express-fileupload")
const  authRouter = require("./routes/auth.routes")
const  fileRouter = require("./routes/file.routes")

const PORT = process.env.PORT || 5000;

const app = express();
app.use(cors()).use(express.json());
app.use(fileUpload({}));

app.use('/api/auth', authRouter);
app.use('/api/files', fileRouter);



const start = async () => {
  try {
    await sequelize.authenticate();
    await sequelize.sync();
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (e) {
    console.log(e);
  }
};

start()
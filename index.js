const express = require("express");
const multer = require("multer");
const stream = require("stream");
const app = express();
const PORT = process.env.PORT || 8000;
const GoogleDriveService = require("./GoogleDriveService");
const CLIENT_ID ="";
const CLIENT_SECRET = "";
const REFRESH_TOKEN = "";
const REDIRECT_URL = "https://developers.google.com/oauthplayground";

//-------------------------------
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const upload = multer({
  fileFilter: (req, file, cb) => {
    if (
      file.mimetype == "image/png" ||
      file.mimetype == "image/jpg" ||
      file.mimetype == "image/jpeg"
    ) {
      cb(null, true);
    } else {
      cb(null, false);
      return cb(new Error("Only .png, .jpg and .jpeg format allowed!"));
    }
  },
});

app.post("/createFolder", async (req, res) => {
  const googleDriveService = new GoogleDriveService(
    CLIENT_ID,
    CLIENT_SECRET,
    REDIRECT_URL,
    REFRESH_TOKEN
  );
  await googleDriveService
    .createFolder(req.body.nama_folder)
    .then(function (resp) {
      return res.status(200).json({
        status: 1,
        message: resp.data,
      });
    })
    .catch(function (error) {
      return res.status(500).json({
        status: 0,
        message: error.errors,
      });
    });
});

app.post("/getFolder", async (req, res) => {
  const googleDriveService = new GoogleDriveService(
    CLIENT_ID,
    CLIENT_SECRET,
    REDIRECT_URL,
    REFRESH_TOKEN
  );
  await googleDriveService
    .getFolder(req.body.nama_folder)
    .then(function (resp) {
      return res.status(200).json({
        status: 1,
        message: resp.data.files,
      });
    })
    .catch(function (error) {
      return res.status(500).json({
        status: 0,
        message: error.errors,
      });
    });
});

app.post("/allFolder", async (req, res) => {
  const googleDriveService = new GoogleDriveService(
    CLIENT_ID,
    CLIENT_SECRET,
    REDIRECT_URL,
    REFRESH_TOKEN
  );
  await googleDriveService
    .allFolder()
    .then(function (resp) {
      return res.status(200).json({
        status: 1,
        message: resp.data.files,
      });
    })
    .catch(function (error) {
      return res.status(500).json({
        status: 0,
        message: error.errors,
      });
    });
});

app.post("/getFile", async (req, res) => {
  const googleDriveService = new GoogleDriveService(
    CLIENT_ID,
    CLIENT_SECRET,
    REDIRECT_URL,
    REFRESH_TOKEN
  );
  await googleDriveService
    .getFile(req.body.id_folder)
    .then(function (resp) {
      return res.status(200).json({
        status: 1,
        message: resp.data.files,
      });
    })
    .catch(function (error) {
      return res.status(500).json({
        status: 0,
        message: error.errors,
      });
    });
});

app.post("/firstFile", async (req, res) => {
  const googleDriveService = new GoogleDriveService(
    CLIENT_ID,
    CLIENT_SECRET,
    REDIRECT_URL,
    REFRESH_TOKEN
  );
  await googleDriveService
    .firstFile(req.body.id_file)
    .then(function (resp) {
      return res.status(200).json({
        status: 1,
        message: resp.data,
      });
    })
    .catch(function (error) {
      return res.status(500).json({
        status: 0,
        message: error.errors,
      });
    });
});

app.post("/CrateFile", upload.single("my_file"), async (req, res) => {
  const googleDriveService = new GoogleDriveService(
    CLIENT_ID,
    CLIENT_SECRET,
    REDIRECT_URL,
    REFRESH_TOKEN
  );
  let file = req.file;
  const bufferStream = new stream.PassThrough();
  bufferStream.end(file.buffer);
  await googleDriveService
    .CrateFile(
      file.originalname,
      bufferStream,
      file.mimetype,
      req.body.id_folder
    )
    .then(function (resp) {
      return res.status(200).json({
        status: 1,
        message: resp.data,
      });
    })
    .catch(function (error) {
      return res.status(500).json({
        status: 0,
        message: error.errors,
      });
    });
});

app.post("/UpdateFile", upload.single("my_file"), async (req, res) => {
  const googleDriveService = new GoogleDriveService(
    CLIENT_ID,
    CLIENT_SECRET,
    REDIRECT_URL,
    REFRESH_TOKEN
  );
  let file = req.file;
  const bufferStream = new stream.PassThrough();
  bufferStream.end(file.buffer);
  await googleDriveService
    .UpdateFile(
      file.originalname,
      bufferStream,
      file.mimetype,
      req.body.id_file
    )
    .then(function (resp) {
      return res.status(200).json({
        status: 1,
        message: resp.data,
      });
    })
    .catch(function (error) {
      return res.status(500).json({
        status: 0,
        message: error.errors,
      });
    });
});

app.post("/deleteFile", async (req, res) => {
  const googleDriveService = new GoogleDriveService(
    CLIENT_ID,
    CLIENT_SECRET,
    REDIRECT_URL,
    REFRESH_TOKEN
  );
  await googleDriveService
    .deleteFile(req.body.id_file)
    .then(function (resp) {
      return res.status(200).json({
        status: 1,
        message: resp.data,
      });
    })
    .catch(function (error) {
      return res.status(500).json({
        status: 0,
        message: error.errors,
      });
    });
});

app.post("/createPermission", async (req, res) => {
  const googleDriveService = new GoogleDriveService(
    CLIENT_ID,
    CLIENT_SECRET,
    REDIRECT_URL,
    REFRESH_TOKEN
  );
  await googleDriveService
    .createPermission(req.body.id_file, req.body.email)
    .then(function (resp) {
      return res.status(200).json({
        status: 1,
        message: resp.data,
      });
    })
    .catch(function (error) {
      return res.status(500).json({
        status: 0,
        message: error.errors,
      });
    });
});

app.post("/createGeneaterUrl", async (req, res) => {
  const googleDriveService = new GoogleDriveService(
    CLIENT_ID,
    CLIENT_SECRET,
    REDIRECT_URL,
    REFRESH_TOKEN
  );
  await googleDriveService
    .createGeneaterUrl(req.body.id_file)
    .then(function (resp) {
      return res.status(200).json({
        status: 1,
        message: resp.data,
      });
    })
    .catch(function (error) {
      return res.status(500).json({
        status: 0,
        message: error.errors,
      });
    });
});


app.use((req, res, next) => {
  const error = new Error("Not Found");
  error.status = 404;
  next(error);
});

app.use((error, req, res, next) => {
  res.status = error.status || 500;
  res.json({
    error: error.message,
  });
});

app.listen(PORT, () => {
  console.log(`server running in http://localhost:${PORT}`);
});

import multer from "multer";
import path from "path";

// Allowed file types
const FILE_TYPES = [".csv", ".xls", ".xlsx"];

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname).toLowerCase();
    const uniqueName = Date.now() + "-" + Math.round(Math.random() * 1e9) + ext;
    cb(null, uniqueName);
  },
});

const fileFilter = (req, file, cb) => {
  const ext = path.extname(file.originalname).toLowerCase();
  if (FILE_TYPES.includes(ext)) {
    cb(null, true);
  } else {
    cb(new Error("Only CSV and Excel files are allowed"), false);
  }
};

export const upload = multer({
  storage,
  fileFilter,
});

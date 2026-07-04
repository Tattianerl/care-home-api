import multer from "multer";
import path from "path";

const uploadPath = path.resolve(process.cwd(), "uploads");

console.log("UPLOAD PATH:", uploadPath);
console.log("CWD MULTER:", process.cwd());

export default {
  storage: multer.diskStorage({
    destination(request, file, callback) {
      callback(null, uploadPath);
    },

    filename(request, file, callback) {
      const timestamp = Date.now();

      const safeName = file.originalname
        .replace(/\s/g, "_")
        .replace(/[^a-zA-Z0-9._-]/g, "");

      callback(null, `${timestamp}-${safeName}`);
    },
  }),
};
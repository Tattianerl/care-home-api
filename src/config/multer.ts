import multer from "multer";
import path from "path";

export default {
  storage: multer.diskStorage({
    destination: path.resolve(process.cwd(), "../../uploads"),

    filename(request, file, callback) {
      const timestamp = Date.now();

      const safeName = file.originalname
      .replace(/\s/g, "_")
      .replace(/[^a-zA-Z0-9._-]/g, "");

      callback(null, `${timestamp}-${safeName}`);
    },
  }),
};
import multer from "multer";
import path from "path";

export default {
  storage: multer.diskStorage({
    destination: path.resolve(__dirname, "../../uploads"),

    filename(request, file, callback) {
      const timestamp = Date.now();

      callback(null, `${timestamp}-${file.originalname}`);
    },
  }),
};
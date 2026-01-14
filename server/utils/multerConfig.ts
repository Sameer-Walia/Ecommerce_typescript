import { Request } from "express";
import multer, { StorageEngine } from "multer";

let mystorage: StorageEngine = multer.diskStorage({
  destination: (req: Request, file: Express.Multer.File, cb) =>
  {
    cb(null, 'public/uploads');
  },
  filename: (req: Request, file: Express.Multer.File, cb) =>
  {
    const picname = Date.now() + '-' + file.originalname;
    cb(null, picname);
  }
});
let upload = multer({ storage: mystorage })


export default upload;
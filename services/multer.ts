const multer = require("multer");

export const uploadImages = multer({
    storage: multer.diskStorage({
        destination: (req: Request, file: any, callback: Function) => {
            callback(null, "uploads/images");
        },
        filename: (req: Request, file: any, callback: Function) => {
            callback(null, new Date().getTime() + "-" + file.originalname);
        }
    }),
    fileFilter: (req: Request, file: any, callback: Function) => {
        if (file.originalname.match(/\.(png|jpg|gif|jpeg|mp4)$/)) {
            callback(null, true);
        } else {
            callback(new Error("File format is not supported!"));
        }
    }
});
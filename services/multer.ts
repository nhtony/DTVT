const multer = require("multer");

export const uploadImages = (type: string) => multer({
    storage: multer.diskStorage({
        destination: (req: Request, file: any, callback: Function) => {
            callback(null, `uploads/images/${type}`);
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

export const uploadAttachment = (type: string) => multer({
    storage: multer.diskStorage({
        destination: (req: Request, file: any, callback: Function) => {
            callback(null, `uploads/attach/${type}`);
        },
        filename: (req: Request, file: any, callback: Function) => {
            callback(null, new Date().getTime() + "-" + file.originalname);
        }
    }),
    fileFilter: (req: Request, file: any, callback: Function) => {
        if (file.originalname.match(/\.(pdf|docx|xlsx)$/)) {
            callback(null, true);
        } else {
            callback(new Error("File format is not supported!"));
        }
    }
});
import multer from "multer";

const storage = multer.memoryStorage();
export const uploadSingle = multer({ storage }).single("avatar");
// field name 'avatar' tương ứng FormData key trên client

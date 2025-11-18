export class AppError extends Error {
  constructor(statusCode, message, errorCode) {
    super(message);
    this.errorCode = errorCode; // Mã lỗi, tự định nghĩa theo nhu cầu, có thể thêm nhiều mã trong tương lai
    this.statusCode = statusCode; // Status code HTTP
    this.isOperational = true;
  }
}

import "express";

// src/types/express.d.ts
declare global {
    namespace Express {
        export interface Request {
            role?: "ADMIN" | "USER";
            userId?: string;
        }
    }
}

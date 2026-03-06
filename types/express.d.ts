import "express";

declare global {
    namespace Express {
        interface Request {
            routeData?: any;
        }
    }
}
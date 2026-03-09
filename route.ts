import { Request, Response } from 'express';

export interface Route {
    path: string;
}

export interface Backend extends Route {
    method: 'get' | 'post' | 'put' | 'delete' | 'all';
    handler: (req: Request, res: Response) => void;
    data: Record<string, any>;
}
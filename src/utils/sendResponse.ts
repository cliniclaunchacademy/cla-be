import { Response } from 'express';

export const sendResponse = (res: Response, status: number, data: object): Response => {
  console.log(`[Response ${status}]`, JSON.stringify(data));
  return res.status(status).json(data);
};

export const sendError = (res: Response, status: number, message: string): Response => {
  console.log(`[Error ${status}]`, message);
  return res.status(status).json({ success: false, error: message });
};

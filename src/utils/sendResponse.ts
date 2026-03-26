import { Response } from 'express';

export const sendResponse = (res: Response, status: number, data: object): Response => {
  console.log(`[Response ${status}]`, JSON.stringify(data));
  return res.status(status).json(data);
};

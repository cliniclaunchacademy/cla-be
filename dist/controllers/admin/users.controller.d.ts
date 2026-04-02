import { Response } from 'express';
import { ExpressRequest } from '../../types/types';
export declare const getUsers: (req: ExpressRequest, res: Response) => Promise<void>;
export declare const createUser: (req: ExpressRequest, res: Response) => Promise<void>;
export declare const updateUser: (req: ExpressRequest, res: Response) => Promise<void>;
export declare const banUser: (req: ExpressRequest, res: Response) => Promise<void>;
export declare const unbanUser: (req: ExpressRequest, res: Response) => Promise<void>;
export declare const resendWelcomeEmail: (req: ExpressRequest, res: Response) => Promise<void>;
export declare const deleteUser: (req: ExpressRequest, res: Response) => Promise<void>;
//# sourceMappingURL=users.controller.d.ts.map
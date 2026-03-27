import { Request, Response, NextFunction } from 'express';
import { Role } from '../constants/roles';
export declare const authenticate: (role?: Role) => (req: Request, res: Response, next: NextFunction) => void;
//# sourceMappingURL=auth.middleware.d.ts.map
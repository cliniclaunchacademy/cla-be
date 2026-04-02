import { Response, NextFunction } from 'express';
import { ExpressRequest } from '../types/types';
import { Role } from '../constants/roles';
export declare const authenticate: (role?: Role) => (req: ExpressRequest, res: Response, next: NextFunction) => void;
//# sourceMappingURL=auth.middleware.d.ts.map
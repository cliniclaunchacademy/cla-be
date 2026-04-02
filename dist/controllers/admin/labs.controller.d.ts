import { Response } from 'express';
import { ExpressRequest } from '../../types/types';
export declare const getLabs: (_req: ExpressRequest, res: Response) => Promise<void>;
export declare const createLab: (req: ExpressRequest, res: Response) => Promise<void>;
export declare const uploadLabLogo: (req: ExpressRequest, res: Response) => Promise<void>;
export declare const updateLab: (req: ExpressRequest, res: Response) => Promise<void>;
export declare const deleteLab: (req: ExpressRequest, res: Response) => Promise<void>;
export declare const reorderLabs: (req: ExpressRequest, res: Response) => Promise<void>;
export declare const getLabApplications: (req: ExpressRequest, res: Response) => Promise<void>;
export declare const getLabApplicationDetail: (req: ExpressRequest, res: Response) => Promise<void>;
export declare const updateApplicationStatus: (req: ExpressRequest, res: Response) => Promise<void>;
//# sourceMappingURL=labs.controller.d.ts.map
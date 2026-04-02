import { Response } from 'express';
import { ExpressRequest } from '../../types/types';
export declare const addResource: (req: ExpressRequest, res: Response) => Promise<void>;
export declare const updateResource: (req: ExpressRequest, res: Response) => Promise<void>;
export declare const deleteResource: (req: ExpressRequest, res: Response) => Promise<void>;
export declare const reorderResources: (req: ExpressRequest, res: Response) => Promise<void>;
export declare const getAllResources: (_req: ExpressRequest, res: Response) => Promise<void>;
export declare const getResourcesByCourse: (req: ExpressRequest, res: Response) => Promise<void>;
//# sourceMappingURL=resources.controller.d.ts.map
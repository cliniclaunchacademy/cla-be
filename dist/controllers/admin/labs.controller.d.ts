import { Request, Response } from 'express';
export declare const getLabs: (_req: Request, res: Response) => Promise<void>;
export declare const createLab: (req: Request, res: Response) => Promise<void>;
export declare const uploadLabLogo: (req: Request, res: Response) => Promise<void>;
export declare const updateLab: (req: Request, res: Response) => Promise<void>;
export declare const deleteLab: (req: Request, res: Response) => Promise<void>;
export declare const reorderLabs: (req: Request, res: Response) => Promise<void>;
export declare const getLabApplications: (req: Request, res: Response) => Promise<void>;
export declare const getLabApplicationDetail: (req: Request, res: Response) => Promise<void>;
export declare const updateApplicationStatus: (req: Request, res: Response) => Promise<void>;
//# sourceMappingURL=labs.controller.d.ts.map
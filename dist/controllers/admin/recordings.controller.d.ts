import { Response } from 'express';
import { ExpressRequest } from '../../types/types';
export declare const getRecordingCategories: (_req: ExpressRequest, res: Response) => Promise<void>;
export declare const createRecordingCategory: (req: ExpressRequest, res: Response) => Promise<void>;
export declare const updateRecordingCategory: (req: ExpressRequest, res: Response) => Promise<void>;
export declare const deleteRecordingCategory: (req: ExpressRequest, res: Response) => Promise<void>;
export declare const reorderRecordingCategories: (req: ExpressRequest, res: Response) => Promise<void>;
export declare const getRecordings: (req: ExpressRequest, res: Response) => Promise<void>;
export declare const createRecording: (req: ExpressRequest, res: Response) => Promise<void>;
export declare const updateRecording: (req: ExpressRequest, res: Response) => Promise<void>;
export declare const deleteRecording: (req: ExpressRequest, res: Response) => Promise<void>;
export declare const reorderRecordings: (req: ExpressRequest, res: Response) => Promise<void>;
//# sourceMappingURL=recordings.controller.d.ts.map
import { Response } from 'express';
import { ExpressRequest } from '../../types/types';
export declare const getBanners: (_req: ExpressRequest, res: Response) => Promise<void>;
export declare const getActiveBanners: (_req: ExpressRequest, res: Response) => Promise<void>;
export declare const createBanner: (req: ExpressRequest, res: Response) => Promise<void>;
export declare const updateBanner: (req: ExpressRequest, res: Response) => Promise<void>;
export declare const reorderBanners: (req: ExpressRequest, res: Response) => Promise<void>;
export declare const deleteBanner: (req: ExpressRequest, res: Response) => Promise<void>;
//# sourceMappingURL=banners.controller.d.ts.map
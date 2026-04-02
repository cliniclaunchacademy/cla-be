import multer from 'multer';
export declare const imageUpload: multer.Multer;
export declare const resourceFileUpload: multer.Multer;
export declare const uploadToCloudinary: (buffer: Buffer, folder: string, resourceType?: "image" | "raw" | "auto") => Promise<string>;
//# sourceMappingURL=upload.d.ts.map
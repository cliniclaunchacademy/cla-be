import { Response } from 'express';
import { ExpressRequest } from '../../types/types';
export declare const getCourses: (_req: ExpressRequest, res: Response) => Promise<void>;
export declare const createCourse: (req: ExpressRequest, res: Response) => Promise<void>;
export declare const uploadCourseThumbnail: (req: ExpressRequest, res: Response) => Promise<void>;
export declare const uploadCourseBanner: (req: ExpressRequest, res: Response) => Promise<void>;
export declare const updateCourse: (req: ExpressRequest, res: Response) => Promise<void>;
export declare const reorderCourses: (req: ExpressRequest, res: Response) => Promise<void>;
export declare const deleteCourse: (req: ExpressRequest, res: Response) => Promise<void>;
export declare const getCourseEditor: (req: ExpressRequest, res: Response) => Promise<void>;
export declare const createModule: (req: ExpressRequest, res: Response) => Promise<void>;
export declare const updateModule: (req: ExpressRequest, res: Response) => Promise<void>;
export declare const reorderModules: (req: ExpressRequest, res: Response) => Promise<void>;
export declare const deleteModule: (req: ExpressRequest, res: Response) => Promise<void>;
export declare const createLesson: (req: ExpressRequest, res: Response) => Promise<void>;
export declare const updateLesson: (req: ExpressRequest, res: Response) => Promise<void>;
export declare const reorderLessons: (req: ExpressRequest, res: Response) => Promise<void>;
export declare const deleteLesson: (req: ExpressRequest, res: Response) => Promise<void>;
//# sourceMappingURL=courses.controller.d.ts.map
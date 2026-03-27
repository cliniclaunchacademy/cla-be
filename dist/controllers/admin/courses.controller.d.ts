import { Request, Response } from 'express';
export declare const getCourses: (_req: Request, res: Response) => Promise<void>;
export declare const createCourse: (req: Request, res: Response) => Promise<void>;
export declare const uploadCourseThumbnail: (req: Request, res: Response) => Promise<void>;
export declare const updateCourse: (req: Request, res: Response) => Promise<void>;
export declare const reorderCourses: (req: Request, res: Response) => Promise<void>;
export declare const deleteCourse: (req: Request, res: Response) => Promise<void>;
export declare const getCourseEditor: (req: Request, res: Response) => Promise<void>;
export declare const createModule: (req: Request, res: Response) => Promise<void>;
export declare const updateModule: (req: Request, res: Response) => Promise<void>;
export declare const reorderModules: (req: Request, res: Response) => Promise<void>;
export declare const deleteModule: (req: Request, res: Response) => Promise<void>;
export declare const createLesson: (req: Request, res: Response) => Promise<void>;
export declare const updateLesson: (req: Request, res: Response) => Promise<void>;
export declare const reorderLessons: (req: Request, res: Response) => Promise<void>;
export declare const deleteLesson: (req: Request, res: Response) => Promise<void>;
//# sourceMappingURL=courses.controller.d.ts.map
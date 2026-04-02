export declare const sendWelcomeEmail: (to: string, firstName: string, lastName: string, password: string) => Promise<void>;
export declare const sendWelcomeSetPasswordEmail: (to: string, firstName: string, lastName: string, resetToken: string) => Promise<void>;
export declare const sendPasswordResetEmail: (to: string, resetToken: string) => Promise<void>;
//# sourceMappingURL=email.d.ts.map
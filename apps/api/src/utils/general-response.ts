export class GeneralResponse<T> {
    success: boolean;
    data: T | null;
    message: string | null;
    exception: any;
    constructor(success: boolean, payload: Partial<{ data: T; message:string; exception: any; }> = {}) {
        const { data = null, message = null, exception = null } = payload;
        this.success = success;
        this.data = data;
        this.message = message;
        this.exception = exception;
    }
}
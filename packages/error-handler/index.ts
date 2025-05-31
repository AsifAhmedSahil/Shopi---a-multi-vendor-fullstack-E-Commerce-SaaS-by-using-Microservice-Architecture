export class AppError extends Error {
    public readonly statusCode : number;
    public readonly isOperational : boolean;
    public readonly details?:any

    constructor(message:string,statusCode:number,isOperational = true,details?:any ){
        super(message),
        this.statusCode = statusCode,
        this.isOperational = isOperational,
        this.details = details;
        Error.captureStackTrace(this)
    }

}
//not Found Error
export class NotFoundError extends AppError {
    constructor(message="Resources not found!"){
        super(message,404)
    }
}

export class ValidationError extends AppError {
    constructor(message = "Invalid data",details?:any){
        super(message,400,true,details)
    }
}

// *Authentication Error
export class AuthenticationError extends AppError {
    constructor(message="Unauthorized!"){
        super(message,401)
    }
}

//* Forbidden Error(insufficient access)
export class ForbiddenError extends AppError{
    constructor(message="Forbidden - permission denined!"){
        super(message,403)
    }
}

// Database Error
export class DatabaseError extends AppError {
    constructor(message = "Database Error",details?:any){
        super(message,500,true,details)
    }
}

// Rate limit error
export class RateLimitError extends AppError {
    constructor(message="Too many request, please try it again!"){
        super(message,429)
    }
}

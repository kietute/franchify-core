import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  HttpException,
} from '@nestjs/common';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

@Injectable()
export class CustomResponseInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const response = context.switchToHttp().getResponse();
    const statusCode = response.statusCode;

    return next.handle().pipe(
      map((data) => ({
        statusCode,
        message: statusCode >= 400 ? 'Error' : 'Success',
        success: statusCode < 400,
        error: statusCode >= 400 ? response.message : null,
        timestamp: Date.now(),
        version: 'v2',
        path: request.url,
        data,
      })),
      catchError((err) => {
        console.log('err', err);
        const statusCode = err instanceof HttpException ? err.getStatus() : 500;
        const errorMessage = Array.isArray(err?.response?.message)
          ? err.response.message[0]
          : err?.response?.message || err.message || 'Internal server error';
        const errorResponse = {
          statusCode,
          success: statusCode < 400,
          message: errorMessage,
          error: err.name || 'Error',
          timestamp: Date.now(),
          version: 'v2',
          path: request.url,
          data: {},
        };
        return throwError(() => new HttpException(errorResponse, statusCode));
      }),
    );
  }
}

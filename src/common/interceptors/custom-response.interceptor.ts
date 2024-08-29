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
      map((data) => this.formatResponse(statusCode, request.url, data)),
      catchError((err) => this.handleError(err, request.url)),
    );
  }

  private formatResponse(statusCode: number, url: string, data: any) {
    return {
      statusCode,
      message: statusCode >= 400 ? 'Error' : 'Success',
      success: statusCode < 400,
      error: statusCode >= 400 ? data.message : null,
      timestamp: Date.now(),
      version: 'v2',
      path: url,
      data,
    };
  }

  private handleError(err: any, url: string) {
    const statusCode = this.getStatusCode(err);
    const errorMessage = this.getErrorMessage(err);
    const errorResponse = this.createErrorResponse(
      statusCode,
      errorMessage,
      err.name,
      url,
    );

    return throwError(() => new HttpException(errorResponse, statusCode));
  }

  private getStatusCode(err: any): number {
    return err?.response?.errorCode
      ? err.response.errorCode
      : err instanceof HttpException
        ? err.getStatus()
        : 500;
  }

  private getErrorMessage(err: any): string {
    return Array.isArray(err?.response?.message)
      ? err.response.message[0]
      : err?.response?.message || err.message || 'Internal server error';
  }

  private createErrorResponse(
    statusCode: number,
    message: string,
    errorName: string,
    url: string,
  ) {
    return {
      statusCode,
      success: statusCode < 400,
      message,
      error: errorName || 'Error',
      timestamp: Date.now(),
      version: 'v2',
      path: url,
      data: {},
    };
  }
}

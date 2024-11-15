import { CanActivate, ExecutionContext } from '@nestjs/common';

export class ManagerGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    if (!request.currentUser) {
      return false;
    }
    return (
      request.currentUser.role == 'admin' ||
      request.currentUser.role == 'manager'
    );
  }
}

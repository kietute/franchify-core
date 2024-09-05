import { CanActivate, ExecutionContext } from '@nestjs/common';

export class StaffGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    if (!request.currentUser) {
      return false;
    }
    return (
      request.currentUser.role == 'staff' || request.currentUser.role == 'admin'
    );
  }
}

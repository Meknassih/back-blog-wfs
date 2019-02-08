import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import { Reflector } from '@nestjs/core';
import { UserService } from '../services/user.service';
import { UserType } from '../entities/user.entity';
import { ResponseService } from '../services/response.service';

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly userService: UserService,
    private readonly responseService: ResponseService
  ) { }

  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    const roles = this.reflector.get<UserType[]>('roles', context.getHandler());
    if (!roles)
      return true;

    for (const role of roles) {
      if (this.userService.getCurrentUser().type >= role)
        return true;
    }

    this.responseService.unsufficientPrivileges();
    return false;
  }
}

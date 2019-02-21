import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import { UserService } from '../services/user.service';
import { ResponseService } from '../services/response.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly userService: UserService,
    private readonly responseService: ResponseService
  ) { }

  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    if (this.userService.getCurrentUser() !== undefined)
      return true;

    this.responseService.notLoggedIn();
    return false;
  }
}

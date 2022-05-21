import { ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
<<<<<<< HEAD
import { IS_PUBLIC_KEY } from '../decorators/public.decorator';
=======

import { IS_PUBLIC_KEY } from './../decorators/public.decorator';
import { IS_PUBLIC_PRIVATE_KEY } from './../decorators/public-private.decorator';
>>>>>>> 3f7d588e62b04a815ebbd5eca0100c35aa43d1a7

@Injectable()
export class JwtGuard extends AuthGuard('jwt') {
  constructor(private reflector: Reflector) {
    super();
  }

  canActivate(context: ExecutionContext) {
<<<<<<< HEAD
    const isPublic = this.reflector.getAllAndOverride(IS_PUBLIC_KEY, [
=======
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
>>>>>>> 3f7d588e62b04a815ebbd5eca0100c35aa43d1a7
      context.getHandler(),
      context.getClass(),
    ]);

<<<<<<< HEAD

    if (isPublic) return true;

    return super.canActivate(context);
  }
=======
    const isContainToken = this.isContainToken(context);
    const isPublicPrivate = this.reflector.getAllAndOverride<boolean>(
      IS_PUBLIC_PRIVATE_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (isPublic || (!isContainToken && isPublicPrivate)) {
      return true;
    }

    return super.canActivate(context);
  }

  private isContainToken(context: ExecutionContext): any {
    return !!context.switchToHttp().getRequest()?.headers?.authorization;
  }
>>>>>>> 3f7d588e62b04a815ebbd5eca0100c35aa43d1a7
}
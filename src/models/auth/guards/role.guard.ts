import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UserRole } from 'src/models/users/entities/user.entity';
import { ROLES_KEY } from '../decorators/roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
    constructor(private reflector: Reflector) { }

    // canActivate(context: ExecutionContext): boolean {

    //     const requiredRoles = this.reflector.getAllAndOverride<UserRole[]>(ROLES_KEY, [
    //         context.getHandler(),
    //         context.getClass(),
    //     ]);
    //     console.log('requiredRoles : ', requiredRoles)
    //     if (!requiredRoles) {
    //         return true;
    //     }
    //     console.log('context : ', context)

    //     const { user } = context.switchToHttp().getRequest();
    //     console.log('user : ', user)
    //     return requiredRoles.some((role) => user.roles?.includes(role));
    // }
    canActivate(
        context: ExecutionContext,
    ): boolean | Promise<boolean> | any {
        const requiredRoles = this.reflector.getAllAndOverride<UserRole[]>(ROLES_KEY, [
            context.getHandler(),
            context.getClass(),
        ]);
        if (!requiredRoles) {
            return true;
        }
        const { user } = context.switchToHttp().getRequest();
        console.log('user : ', user)
       // return requiredRoles.some((role) => user.role?.includes(role));
    }
}
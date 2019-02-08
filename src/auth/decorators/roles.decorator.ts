import { ReflectMetadata } from '@nestjs/common';
import { UserType } from '../entities/user.entity';

export const Roles = (...roles: UserType[]) => ReflectMetadata('roles', roles);

import { SetMetadata } from '@nestjs/common';
import { Role } from '@prisma/client';

export const ROLES_KEY = 'roles';
export const ROLES_EXCLUDED_KEY = 'rolesExcluded';
export const Roles = (...roles: Role[]) => SetMetadata(ROLES_KEY, roles);
export const RolesExcluded = (...roles: Role[]) => SetMetadata(ROLES_EXCLUDED_KEY, roles);

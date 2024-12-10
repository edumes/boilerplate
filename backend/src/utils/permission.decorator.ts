import { permissionService } from '@modules/permissions/permission.service';

export function RequirePermission(resource: string, action: string) {
  return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value;

    descriptor.value = async function (...args: any[]) {
      const [request] = args;
      const user = request.user;

      await permissionService.requirePermission(user, resource, action);
      return originalMethod.apply(this, args);
    };

    return descriptor;
  };
}

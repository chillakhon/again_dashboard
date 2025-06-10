import { PermissionsData } from '@/constants/PermissionsData';

interface UserWithPermissions {
    id: number;
    role?: {
        id: number;
        name: string;
    };
    permissions: number[];
}

export class ModulePermissions {
    private readonly user: UserWithPermissions | null;
    private readonly permissionsSet: Set<number>;
    private static readonly SUPER_ADMIN_ROLE_ID = 1;

    constructor(userOrPermissions: UserWithPermissions | number[] = []) {
        if (Array.isArray(userOrPermissions)) {
            this.user = null;
            this.permissionsSet = new Set(userOrPermissions);
        } else {
            this.user = userOrPermissions;
            this.permissionsSet = new Set(userOrPermissions.permissions);
        }
    }

    private get isSuperAdmin(): boolean {
        return this.user?.role?.id === ModulePermissions.SUPER_ADMIN_ROLE_ID;
    }

    private checkPermission(permissionId: PermissionsData): boolean {
        return this.isSuperAdmin || this.permissionsSet.has(permissionId);
    }

    // User permissions
    get canViewUsers(): boolean { return this.checkPermission(PermissionsData.USERS_VIEW); }
    get canCreateUsers(): boolean { return this.checkPermission(PermissionsData.USERS_CREATE); }
    get canEditUsers(): boolean { return this.checkPermission(PermissionsData.USERS_EDIT); }
    get canDeleteUsers(): boolean { return this.checkPermission(PermissionsData.USERS_DELETE); }

    // Role permissions
    get canManageRoles(): boolean { return this.checkPermission(PermissionsData.ROLES_MANAGE); }

    // Permission management
    get canManagePermissions(): boolean { return this.checkPermission(PermissionsData.PERMISSIONS_MANAGE); }

    // Order permissions
    get canViewOrders(): boolean { return this.checkPermission(PermissionsData.ORDERS_VIEW); }
    get canManageOrders(): boolean { return this.checkPermission(PermissionsData.ORDERS_MANAGE); }

    // Product permissions
    get canViewProducts(): boolean { return this.checkPermission(PermissionsData.PRODUCTS_VIEW); }
    get canManageProducts(): boolean { return this.checkPermission(PermissionsData.PRODUCTS_MANAGE); }

    // Client permissions
    get canViewClients(): boolean { return this.checkPermission(PermissionsData.CLIENTS_VIEW); }
    get canManageClients(): boolean { return this.checkPermission(PermissionsData.CLIENTS_MANAGE); }

    // Settings permissions
    get canManageSettings(): boolean { return this.checkPermission(PermissionsData.SETTINGS_MANAGE); }

    // Combined permissions
    get canManageUsers(): boolean { return this.checkPermission(PermissionsData.MANAGE_USERS); }
    get canManageAllClients(): boolean { return this.checkPermission(PermissionsData.MANAGE_CLIENTS); }
    get canViewReports(): boolean { return this.checkPermission(PermissionsData.VIEW_REPORTS); }

    // Generic permission check
    has(permission: PermissionsData): boolean {
        return this.checkPermission(permission);
    }

    // Bulk permission check
    hasAll(...permissions: PermissionsData[]): boolean {
        return permissions.every(p => this.checkPermission(p));
    }

    // Any permission check
    hasAny(...permissions: PermissionsData[]): boolean {
        return permissions.some(p => this.checkPermission(p));
    }

    // Get all permissions the user has
    get grantedPermissions(): PermissionsData[] {
        if (this.isSuperAdmin) {
            return Object.values(PermissionsData).filter(v => typeof v === 'number') as PermissionsData[];
        }
        return Array.from(this.permissionsSet) as PermissionsData[];
    }

    // Check if user has exactly these permissions (no more, no less)
    hasExactly(...permissions: PermissionsData[]): boolean {
        if (this.isSuperAdmin) return false; // Super admin always has all permissions
        const expected = new Set(permissions);
        return (
            this.permissionsSet.size === expected.size &&
            Array.from(this.permissionsSet).every(p => expected.has(p))
        );
    }
}
// permissions-data.ts
export enum PermissionsData {
    USERS_VIEW = 1,
    USERS_CREATE = 2,
    USERS_EDIT = 3,
    USERS_DELETE = 4,
    ROLES_MANAGE = 5,
    PERMISSIONS_MANAGE = 6,
    ORDERS_VIEW = 7,
    ORDERS_MANAGE = 8,
    PRODUCTS_VIEW = 9,
    PRODUCTS_MANAGE = 10,
    CLIENTS_VIEW = 11,
    CLIENTS_MANAGE = 12,
    SETTINGS_MANAGE = 13,
    MANAGE_USERS = 14,
    MANAGE_CLIENTS = 15,
    VIEW_REPORTS = 16
}

// export type Permission = keyof typeof PermissionsData;
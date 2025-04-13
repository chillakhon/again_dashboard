import { UserProfile} from "@/models/user/Profile";
import {UserRole} from "@/models/user/Role";
import {UserPermission} from "@/models/user/Permission";

export class User {
  public id: number | null;
  public email: string | null;
  public email_verified_at: string | null;
  public created_at: string | null;
  public updated_at: string | null;
  public deleted_at: string | null;
  public profile: UserProfile | null;
  public roles: UserRole[];
  public permissions: UserPermission[];

  constructor(data: Partial<User> = {}) {
    this.id = data.id ?? null;
    this.email = data.email ?? null;
    this.email_verified_at = data.email_verified_at ?? null;
    this.created_at = data.created_at ?? null;
    this.updated_at = data.updated_at ?? null;
    this.deleted_at = data.deleted_at ?? null;
    this.profile = data.profile ? new UserProfile(data.profile) : null;
    this.roles = Array.isArray(data.roles) ? data.roles.map(role => new UserRole(role)) : [];
    this.permissions = Array.isArray(data.permissions) ? data.permissions.map(perm => new UserPermission(perm)) : [];
  }

  get fullName(): string | null {
    if (this.profile?.first_name && this.profile?.last_name) {
      return `${this.profile.first_name} ${this.profile.last_name}`;
    }
    return this.profile?.first_name ?? this.profile?.last_name ?? null;
  }

  get isSuperAdmin(): boolean {
    return this.roles.some(role => role.id === 1);
  }

  get isVerified(): boolean {
    return this.email_verified_at !== null;
  }

  get isActive(): boolean {
    return this.deleted_at === null;
  }

  get getPhone(): string | null {
    return this.profile?.phone ??  null;
  }


  get getRoleNames(): string | null {
    if (this.roles.length > 0) {
      return this.roles.map(role => role.name).join(", ");
    }
    return null;
  }


  public static fromJson(json: any): User {
    return new User({
      id: json.id ?? null,
      email: json.email ?? null,
      email_verified_at: json.email_verified_at ?? null,
      created_at: json.created_at ?? null,
      updated_at: json.updated_at ?? null,
      deleted_at: json.deleted_at ?? null,
      profile: json.profile ? new UserProfile(json.profile) : new UserProfile({}),
      roles: Array.isArray(json.roles) ? json.roles.map((role: any) => new UserRole(role)) : [],
      permissions: Array.isArray(json.permissions) ? json.permissions.map((perm: any) => new UserPermission(perm)) : []
    });
  }

  public toJson(): any {
    return {
      id: this.id,
      email: this.email,
      email_verified_at: this.email_verified_at,
      created_at: this.created_at,
      updated_at: this.updated_at,
      deleted_at: this.deleted_at,
      profile: this.profile ? {
        id: this.profile.id,
        user_id: this.profile.user_id,
        first_name: this.profile.first_name,
        last_name: this.profile.last_name,
        phone: this.profile.phone,
        address: this.profile.address
      } : null,
      roles: this.roles.map(role => ({
        id: role.id,
        name: role.name,
        slug: role.slug,
        description: role.description
      })),
      permissions: this.permissions.map(perm => ({
        id: perm.id,
        name: perm.name,
        slug: perm.slug,
        description: perm.description
      }))
    };
  }
}
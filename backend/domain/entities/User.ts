// ============================================================================
// Domain Layer - User Entity
// ============================================================================

export type UserRole = 'admin' | 'user';

export interface User {
    id: string;
    email: string;
    role: UserRole;
    name: string;
    createdAt: Date;
}

// ============================================================================
// Domain Layer - Auth Repository Interface (Contract)
// ============================================================================

import { User } from '../entities/User';

export interface IAuthRepository {
    // Auth operations
    signIn(email: string, password: string): Promise<User | null>;
    signOut(): Promise<void>;
    getCurrentUser(): Promise<User | null>;

    // User management (admin only)
    createUser(email: string, password: string, name: string, role: User['role']): Promise<User | null>;
}

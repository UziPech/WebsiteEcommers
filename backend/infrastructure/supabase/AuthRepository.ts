// ============================================================================
// Infrastructure Layer - Supabase Auth Repository
// ============================================================================

import { supabase } from './client';
import { User, UserRole, IAuthRepository } from '../../domain';

// Map Supabase user to domain User entity
const mapSupabaseUserToUser = async (supabaseUser: { id: string; email?: string }): Promise<User | null> => {
    // Get user profile from profiles table
    const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', supabaseUser.id)
        .single();

    if (!profile) {
        return null;
    }

    return {
        id: supabaseUser.id,
        email: supabaseUser.email || '',
        role: profile.role as UserRole,
        name: profile.name || '',
        createdAt: new Date(profile.created_at),
    };
};

export class SupabaseAuthRepository implements IAuthRepository {
    async signIn(email: string, password: string): Promise<User | null> {
        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        if (error || !data.user) {
            console.error('Error signing in:', error);
            return null;
        }

        return mapSupabaseUserToUser(data.user);
    }

    async signOut(): Promise<void> {
        const { error } = await supabase.auth.signOut();
        if (error) {
            console.error('Error signing out:', error);
        }
    }

    async getCurrentUser(): Promise<User | null> {
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            return null;
        }

        return mapSupabaseUserToUser(user);
    }

    async createUser(
        email: string,
        password: string,
        name: string,
        role: UserRole
    ): Promise<User | null> {
        // Note: This requires admin privileges or Supabase Auth settings
        const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: {
                    name,
                    role,
                },
            },
        });

        if (error || !data.user) {
            console.error('Error creating user:', error);
            return null;
        }

        // Create profile entry
        const { error: profileError } = await supabase
            .from('profiles')
            .insert({
                id: data.user.id,
                name,
                role,
            });

        if (profileError) {
            console.error('Error creating profile:', profileError);
        }

        return mapSupabaseUserToUser(data.user);
    }

    async resetPasswordForEmail(email: string): Promise<boolean> {
        // Get the correct redirect URL based on environment
        const getRedirectUrl = () => {
            // Check if we're in production (Vercel deployment)
            const isProduction = window.location.hostname !== 'localhost' &&
                window.location.hostname !== '127.0.0.1';

            if (isProduction) {
                // Use the production Vercel URL
                return 'https://vivero-balam.vercel.app/reset-password';
            }
            // In development, use current origin
            return `${window.location.origin}/reset-password`;
        };

        const { error } = await supabase.auth.resetPasswordForEmail(email, {
            redirectTo: getRedirectUrl(),
        });

        if (error) {
            console.error('Error sending password reset email:', error);
            return false;
        }

        return true;
    }

    async updatePassword(newPassword: string): Promise<boolean> {
        const { error } = await supabase.auth.updateUser({
            password: newPassword,
        });

        if (error) {
            console.error('Error updating password:', error);
            return false;
        }

        return true;
    }

    async resendConfirmationEmail(email: string): Promise<boolean> {
        const { error } = await supabase.auth.resend({
            type: 'signup',
            email,
        });

        if (error) {
            console.error('Error resending confirmation email:', error);
            return false;
        }

        return true;
    }
}

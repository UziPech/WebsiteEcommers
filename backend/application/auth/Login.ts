// ============================================================================
// Application Layer - Login Use Case
// ============================================================================

import { User, IAuthRepository } from '../../domain';

export class LoginUseCase {
    constructor(private authRepository: IAuthRepository) { }

    async execute(email: string, password: string): Promise<User | null> {
        return this.authRepository.signIn(email, password);
    }
}

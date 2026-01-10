// ============================================================================
// Application Layer - Get Current User Use Case
// ============================================================================

import { User, IAuthRepository } from '../../domain';

export class GetCurrentUserUseCase {
    constructor(private authRepository: IAuthRepository) { }

    async execute(): Promise<User | null> {
        return this.authRepository.getCurrentUser();
    }
}

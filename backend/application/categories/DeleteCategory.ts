// ============================================================================
// Application Layer - Delete Category Use Case
// ============================================================================

import { ICategoryRepository } from '../../domain';

export class DeleteCategoryUseCase {
    constructor(private categoryRepository: ICategoryRepository) { }

    async execute(id: string): Promise<boolean> {
        return this.categoryRepository.delete(id);
    }
}

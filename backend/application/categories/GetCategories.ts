// ============================================================================
// Application Layer - Get Categories Use Case
// ============================================================================

import { Category, ICategoryRepository } from '../../domain';

export class GetCategoriesUseCase {
    constructor(private categoryRepository: ICategoryRepository) { }

    async execute(): Promise<Category[]> {
        return this.categoryRepository.getAll();
    }
}

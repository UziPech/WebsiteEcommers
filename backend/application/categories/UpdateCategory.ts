// ============================================================================
// Application Layer - Update Category Use Case
// ============================================================================

import { Category, ICategoryRepository } from '../../domain';

export interface UpdateCategoryInput {
    name?: string;
    description?: string | null;
}

export class UpdateCategoryUseCase {
    constructor(private categoryRepository: ICategoryRepository) { }

    async execute(id: string, input: UpdateCategoryInput): Promise<Category | null> {
        return this.categoryRepository.update(id, input);
    }
}

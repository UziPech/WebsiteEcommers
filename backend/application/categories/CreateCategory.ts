// ============================================================================
// Application Layer - Create Category Use Case
// ============================================================================

import { Category, ICategoryRepository } from '../../domain';

export interface CreateCategoryInput {
    name: string;
    description?: string | null;
}

export class CreateCategoryUseCase {
    constructor(private categoryRepository: ICategoryRepository) { }

    async execute(input: CreateCategoryInput): Promise<Category> {
        return this.categoryRepository.create({
            name: input.name,
            description: input.description || null,
        });
    }
}

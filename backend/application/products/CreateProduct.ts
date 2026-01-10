// ============================================================================
// Application Layer - Create Product Use Case
// ============================================================================

import { Product, IProductRepository } from '../../domain';

export interface CreateProductInput {
    name: string;
    price: number;
    imageUrl: string;
    tag?: string;
    category: Product['category'];
    status: Product['status'];
    description?: string;
}

export class CreateProductUseCase {
    constructor(private productRepository: IProductRepository) { }

    async execute(input: CreateProductInput): Promise<Product> {
        return this.productRepository.create({
            name: input.name,
            price: input.price,
            imageUrl: input.imageUrl,
            tag: input.tag || null,
            category: input.category,
            status: input.status,
            description: input.description || null,
        });
    }
}

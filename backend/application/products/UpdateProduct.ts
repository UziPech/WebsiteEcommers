// ============================================================================
// Application Layer - Update Product Use Case
// ============================================================================

import { Product, ProductStatus, IProductRepository } from '../../domain';

export interface UpdateProductInput {
    name?: string;
    price?: number;
    imageUrl?: string;
    tag?: string | null;
    category?: Product['category'];
    status?: ProductStatus;
    description?: string | null;
}

export class UpdateProductUseCase {
    constructor(private productRepository: IProductRepository) { }

    async execute(id: string, input: UpdateProductInput): Promise<Product | null> {
        return this.productRepository.update(id, input);
    }

    async updateStatus(id: string, status: ProductStatus): Promise<Product | null> {
        return this.productRepository.updateStatus(id, status);
    }
}

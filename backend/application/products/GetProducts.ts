// ============================================================================
// Application Layer - Get Products Use Case
// ============================================================================

import { Product, ProductCategory, IProductRepository } from '../../domain';

export class GetProductsUseCase {
    constructor(private productRepository: IProductRepository) { }

    async execute(): Promise<Product[]> {
        return this.productRepository.getAll();
    }

    async byCategory(category: ProductCategory): Promise<Product[]> {
        return this.productRepository.getByCategory(category);
    }

    async byId(id: string): Promise<Product | null> {
        return this.productRepository.getById(id);
    }
}

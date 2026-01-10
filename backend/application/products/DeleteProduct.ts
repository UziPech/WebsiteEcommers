// ============================================================================
// Application Layer - Delete Product Use Case
// ============================================================================

import { IProductRepository } from '../../domain';

export class DeleteProductUseCase {
    constructor(private productRepository: IProductRepository) { }

    async execute(id: string): Promise<boolean> {
        return this.productRepository.delete(id);
    }
}

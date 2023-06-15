import { Product } from '@prisma/client';

export type ProductSubset = Omit<
	Product,
	'id' | 'createdAt' | 'updatedAt' | ''
>;

export type ProductUpdateSubset = Partial<ProductSubset> & {
	id: number;
};

export type ProductCreateSubset = Omit<ProductSubset, 'userId' | 'supplierId'>;

export interface ProductSaleSubset {
	id: number;
	quantity: number;
}

export type ProductApiSubset = Product & {
	quantity: number;
};

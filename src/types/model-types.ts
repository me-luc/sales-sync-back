import { Product } from '@prisma/client';

export type ProductSubset = Omit<
	Product,
	'id' | 'createdAt' | 'updatedAt' | ''
>;

export type ProductUpdateSubset = Partial<ProductSubset> & {
	id: number;
};

export type ProductCreateSubset = Omit<ProductSubset, 'userId' | 'supplierId'>;

import { prisma } from 'config/database';

async function getUserById(id: number) {
	return await prisma.user.findUnique({ where: { id } });
}
export const userRepository = { getUserById };

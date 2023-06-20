import { prisma } from '../config/database';

async function createUser(email: string, password: string, name: string) {
	return await prisma.user.create({
		data: {
			email,
			password,
			name,
		},
	});
}

async function getUserByEmail(email: string) {
	return await prisma.user.findUnique({
		where: {
			email,
		},
	});
}

async function getToken(token: string) {
	return await prisma.session.findUnique({
		where: {
			token,
		},
	});
}

export const authenticationRepository = {
	createUser,
	getUserByEmail,
	getToken,
};

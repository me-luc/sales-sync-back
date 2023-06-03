import { prisma } from '../config/database';

async function createSession(userId: number, token: string) {
	return await prisma.session.create({
		data: {
			token,
			userId,
		},
	});
}

async function deleteSession(token: string) {
	return await prisma.session.delete({
		where: {
			token,
		},
	});
}

async function getSessionByToken(token: string) {
	return await prisma.session.findUnique({
		where: {
			token,
		},
	});
}

const sessionRepository = {
	createSession,
	deleteSession,
	getSessionByToken,
};
export default sessionRepository;

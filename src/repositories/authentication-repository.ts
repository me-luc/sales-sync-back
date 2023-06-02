import { db } from '../config/database';

async function createUser(email: string, password: string, name: string) {
	return await db.user.create({
		data: {
			email,
			password,
			name,
		},
	});
}

async function getUserByEmail(email: string) {
	return await db.user.findUnique({
		where: {
			email,
		},
	});
}

const authenticationRepository = {
	createUser,
	getUserByEmail,
};

export default authenticationRepository;

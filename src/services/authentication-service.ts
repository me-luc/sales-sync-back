import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { InvalidCredentialsError, UnauthorizedError } from '../errors/';
import { authenticationRepository, sessionsRepository } from '../repositories';

async function signIn(email: string, password: string) {
	const user = await authenticationRepository.getUserByEmail(email);
	if (!user) throw UnauthorizedError('Invalid credentials!');

	const passwordIsValid = await validatePassword(password, user.password);
	if (!passwordIsValid) throw UnauthorizedError('Invalid credentials!');

	const token = createToken(String(user.id));
	await createSession(user.id, token);
	return token;
}

async function signUp(email: string, password: string, name: string) {
	const user = await authenticationRepository.getUserByEmail(email);
	if (user) throw InvalidCredentialsError();

	const hashedPassword = await bcrypt.hash(password, 10);
	const newUser = await authenticationRepository.createUser(
		email,
		hashedPassword,
		name
	);
	const token = await createToken(String(newUser.id));
	await createSession(newUser.id, token);
	return token;
}

async function checkToken(token: string) {
	const session = await authenticationRepository.getToken(token);
	if (!session) throw UnauthorizedError('Invalid token!');

	const { userId } = jwt.verify(
		token,
		process.env.ACCESS_TOKEN_SECRET as string
	) as { userId: string };

	if (Number(userId) !== session.userId)
		throw UnauthorizedError('Invalid token!');
}

const authenticationService = {
	signIn,
	signUp,
	checkToken,
};

export default authenticationService;

async function validatePassword(password: string, hashedPassword: string) {
	return await bcrypt.compare(password, hashedPassword);
}

function createToken(userId: string) {
	return jwt.sign({ userId }, process.env.ACCESS_TOKEN_SECRET as string);
}

async function createSession(userId: number, token: string) {
	await sessionsRepository.createSession(userId, token);
}

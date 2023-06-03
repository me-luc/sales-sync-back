import { Request } from 'express';

interface ApplicationError {
	name: string;
	message: string;
}

type AuthenticatedRequest = Request & JWTPayload;

type JWTPayload = {
	userId: number;
};

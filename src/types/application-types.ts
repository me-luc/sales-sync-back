import { Request } from 'express';

export interface ApplicationError {
	name: string;
	message: string;
}

export type AuthenticatedRequest = Request & JWTPayload;

export type JWTPayload = {
	userId: number;
};

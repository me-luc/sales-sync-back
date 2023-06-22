import { stripe } from 'config/stripe';
import { NextFunction, Request, Response } from 'express';
import express from 'express';
import axios from 'axios';
import Stripe from 'stripe';
import dotenv from 'dotenv';

dotenv.config();

const webhookSecret: string = process.env.STRIPE_WEBHOOK_SECRET;

const app = express();

// Use JSON parser for all non-webhook routes
app.use((req: Request, res: Response, next: NextFunction): void => {
	if (req.originalUrl === '/webhook') {
		next();
	} else {
		express.json()(req, res, next);
	}
});

app.post(
	'/webhook',
	express.raw({ type: 'application/json' }),
	async (req: express.Request, res: express.Response): Promise<void> => {
		const sig = req.headers['stripe-signature'];

		let event: Stripe.Event;

		try {
			event = stripe.webhooks.constructEvent(
				req.body,
				sig,
				webhookSecret
			);
		} catch (err) {
			console.log(`❌ Error message: ${err.message}`);
			res.status(400).send(`Webhook Error: ${err.message}`);
			return;
		}

		console.log('✅ Success:', event.id);

		if (event.type === 'payment_intent.succeeded') {
			const stripeObject: Stripe.PaymentIntent = event.data
				.object as Stripe.PaymentIntent;
			console.log(`💰 PaymentIntent status: ${stripeObject.status}`);
		} else if (event.type === 'charge.succeeded') {
			const charge = event.data.object as Stripe.Charge;
			console.log(`💵 Charge id: ${charge.id}`);
		} else {
			console.warn(`🤷‍♀️ Unhandled event type: ${event.type}`);
		}

		console.log('🔔  Webhook received!\n\n', event);

		switch (event.type) {
			case 'checkout.session.completed':
				const checkoutSession = event.data
					.object as Stripe.Checkout.Session;
				await axios.post(
					`${process.env.LOCAL_API_URL}/webhooks/payment-success`,
					checkoutSession
				);
			case 'payment_intent.created':
				const paymentIntentCreated = event.data.object;
				await axios.post(
					`${process.env.LOCAL_API_URL}/webhooks/payment-intent`,
					paymentIntentCreated
				);
				break;
			// case 'payment_intent.succeeded':
			// 	const paymentIntentSucceeded = event.data.object;
			// 	await axios.post(
			// 		`${process.env.LOCAL_API_URL}/webhooks/payment-success`,
			// 		paymentIntentSucceeded
			// 	);
			// 	break;
			case 'payment_intent.cancelled':
				const paymentIntentCancelled = event.data.object;
				await axios.post(
					`${process.env.LOCAL_API_URL}/webhooks/payment-cancel`,
					paymentIntentCancelled
				);
				break;
			case 'account.updated':
				const accountUpdated = event.data.object;
				await axios.post(
					`${process.env.LOCAL_API_URL}/webhooks/account-updated`,
					accountUpdated
				);
				break;
			default:
				console.log(`Unhandled event type ${event.type}`);
		}

		// Return a response to acknowledge receipt of the event
		res.json({ received: true });
	}
);

app.listen(4242, () => {
	console.log('Running on port 4242');
});

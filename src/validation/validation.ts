import { z } from 'zod';

export const TokenOptionsSchema = z
	.object({
		algorithm: z
			.enum([
				'SHA-1',
				'SHA-224',
				'SHA-256',
				'SHA-384',
				'SHA-512',
				'SHA3-224',
				'SHA3-256',
				'SHA3-384',
				'SHA3-512',
			])
			.optional(),
		period: z.number().optional(),
		digits: z.number().optional(),
		timestamp: z.union([z.date(), z.number().positive().finite()]).optional(),
	})
	.optional();

export const Base32Schema = z.string().regex(/^[A-Z2-7]+=*$/);

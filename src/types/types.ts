import { z } from 'zod';
import { TokenOptionsSchema } from '../validation/validation';

export type TokenOptions = z.infer<typeof TokenOptionsSchema>;
export type HashAlgorithm =
	| 'SHA-1'
	| 'SHA-224'
	| 'SHA-256'
	| 'SHA-384'
	| 'SHA-512'
	| 'SHA3-224'
	| 'SHA3-256'
	| 'SHA3-384'
	| 'SHA3-512';
export type Timestamp = number | Date;

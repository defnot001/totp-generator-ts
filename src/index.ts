import jsSHA from 'jssha';
import { HashAlgorithm, Timestamp, TokenOptions } from './types/types';
import { Base32Schema, TokenOptionsSchema } from './validation/validation';

/**
 * The token generator class which is used to generate tokens.
 * It takes an optional options object as a parameter.
 *
 * ```ts
 * const tokenGen = new TokenGenerator();
 * ```
 */
export class TokenGenerator {
	public algorithm: HashAlgorithm;
	public period: number;
	public digits: number;
	public timestamp: number | Date;

	/**
	 * @param options - The optional options for the token generator.
	 * @param options.algorithm - The algorithm to use for the token generation. Defaults to SHA1.
	 * @param options.period - The period of the token. Defaults to 30.
	 * @param options.digits - The number of digits of the token. Defaults to 6.
	 * @param options.timestamp - The timestamp to use for the token generation. Defaults to the current time. Can only be 10 or 13 digits or a Date object.
	 *
	 * @example
	 * ```ts
	 * const gen = new TokenGenerator({
	 * 	algorithm: 'SHA256',
	 * 	period: 60,
	 * 	digits: 8,
	 * 	timestamp: 1234567890
	 * });
	 * ```
	 */
	constructor(options?: TokenOptions) {
		TokenOptionsSchema.parse(options);

		const { algorithm, period, digits, timestamp } = options ?? {};

		this.algorithm = algorithm ?? 'SHA-1';
		this.period = period ?? 30;
		this.digits = digits ?? 6;
		this.timestamp = timestamp ?? Math.floor(Date.now() / 1000);
	}

	/**
	 * Generates a new token based on the provided key.
	 * @param key Key to generate the token from.
	 * @returns The generated token.
	 * @throws Will throw an error if the key is not a valid base32 string.
	 * @example
	 * ```ts
	 * const tokenGen = new TokenGenerator();
	 * gen.getToken('JBSWY3DPEHPK3PXP');
	 * ```
	 * If lower case letters are used, they will be converted to upper case.
	 */
	public getToken(key: string): string {
		this.validateKey(key);

		const hexKey = this.base32toHex(key);
		const unixTimestamp = this.getUnixTimestamp(this.timestamp);

		const time = this.decimalToHex(
			Math.floor(unixTimestamp / this.period)
		).padStart(16, '0');

		const shaObj = new jsSHA(this.algorithm, 'HEX');
		shaObj.setHMACKey(hexKey, 'HEX');
		shaObj.update(time);
		const hmac = shaObj.getHMAC('HEX');

		const doubleOffset = this.hexToDecimal(hmac.substring(hmac.length - 1)) * 2;

		const otp = (
			this.hexToDecimal(hmac.substring(doubleOffset, doubleOffset + 8)) &
			this.hexToDecimal('7fffffff')
		).toString(10);

		const max = Math.max(otp.length - this.digits, 0);

		return otp.substring(max, max + this.digits);
	}

	private getUnixTimestamp(timestamp: Timestamp) {
		if (timestamp instanceof Date) {
			return Math.floor(timestamp.getTime() / 1000);
		} else if (timestamp.toString().length === 13) {
			return Math.floor(timestamp / 1000);
		} else if (timestamp.toString().length === 10) {
			return timestamp;
		} else {
			throw new Error('Invalid timestamp!');
		}
	}

	private validateKey(key: string) {
		key = key.toUpperCase();
		if (key === '') {
			throw new Error('Empty base32 key!');
		}

		const validated = Base32Schema.safeParse(key);

		if (!validated.success) {
			throw new Error('Invalid base32 key!');
		}
	}

	private hexToDecimal(hex: string) {
		return parseInt(hex, 16);
	}

	private decimalToHex(decimal: number) {
		return decimal.toString(16);
	}

	private base32toHex(base32: string) {
		const base32chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';
		let bits = '';
		let hex = '';

		base32 = base32.replace(/=+$/, '');

		for (let i = 0; i < base32.length; i++) {
			const char = base32.charAt(i).toUpperCase();
			const val = base32chars.indexOf(char);
			bits += val.toString(2).padStart(5, '0');
		}

		for (let i = 0; i + 8 <= bits.length; i += 8) {
			const chunk = bits.substring(i, i + 8);

			const hexString = parseInt(chunk, 2).toString(16);
			hex += hexString.padStart(2, '0');
		}

		return hex;
	}
}

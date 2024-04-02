import { describe, expect, it } from 'vitest';
import { TokenGenerator } from '..';

const tokenGen = new TokenGenerator();
describe('TokenGenerator', () => {
	it('should generate the correct token using defaults at UNIX time 0.', () => {
		tokenGen.timestamp = new Date(0);
		expect(tokenGen.getToken('JBSWY3DPEHPK3PXP')).toBe('282760');
	});

	it('should generate the correct token using defaults at 2023-02-02T07:46:03.119Z', () => {
		tokenGen.timestamp = new Date('2023-02-02T07:46:03.119Z');
		expect(tokenGen.getToken('JBSWY3DPEHPK3PXP')).toBe('338417');
	});

	it('should generate the correct token at the end of a 30 second period', () => {
		tokenGen.timestamp = 1675324259;
		expect(tokenGen.getToken('JBSWY3DPEHPK3PXP')).toBe('680081');
	});

	it('should generate the correct token at the beginning of a 30 second period', () => {
		tokenGen.timestamp = 1675324260;
		expect(tokenGen.getToken('JBSWY3DPEHPK3PXP')).toBe('858066');
	});

	it('should generate a token with a leading 0', () => {
		tokenGen.timestamp = 1365324707000;
		expect(tokenGen.getToken('JBSWY3DPEHPK3PXP')).toBe('089029');
	});

	it('should generate a token from a padded base32 string', () => {
		tokenGen.timestamp = 1465324707000;
		expect(tokenGen.getToken('CI2FM6EQCI2FM6EQKU======')).toBe('984195');
	});

	it('should generate a token that lasts for 60 seconds', () => {
		tokenGen.timestamp = 1675325019;
		tokenGen.period = 60;
		expect(tokenGen.getToken('CI2FM6EQCI2FM6EQKU======')).toBe('762533');
	});

	it('should generate a token that lasts for 60 seconds and has 8 digits', () => {
		tokenGen.period = 60;
		tokenGen.digits = 8;
		tokenGen.timestamp = 1675325104;

		expect(tokenGen.getToken('CI2FM6EQCI2FM6EQKU')).toBe('30348533');
	});

	it('should generate a token using SHA512', () => {
		tokenGen.algorithm = 'SHA-512';
		tokenGen.period = 30;
		tokenGen.digits = 6;
		tokenGen.timestamp = 1465324707000;

		expect(tokenGen.getToken('JBSWY3DPEHPK3PXP')).toBe('093730');
	});

	it('should throw an error if the timestamp is in a wrong format', () => {
		tokenGen.algorithm = 'SHA-1';
		tokenGen.timestamp = 14653247070000;
		expect(() => tokenGen.getToken('JBSWY3DPEHPK3PXP')).toThrowError(
			/^Invalid timestamp!$/
		);

		tokenGen.timestamp = 146532470700;
		expect(() => tokenGen.getToken('JBSWY3DPEHPK3PXP')).toThrowError(
			/^Invalid timestamp!$/
		);
	});

	it('should throw an error if the base32 key contains invalid characters', () => {
		expect(() => tokenGen.getToken('1')).toThrowError(/^Invalid base32 key!$/);
	});

	it('should throw an error if the base32 key is an empty string', () => {
		expect(() => tokenGen.getToken('')).toThrowError(/^Empty base32 key!$/);
	});

	it('should generate a different token after the previous one has expired', async () => {
		const firstGen = new TokenGenerator();
		const firstToken = firstGen.getToken('LN4EE52GEZFEEJRPMESHAVCAO4');

		await new Promise(resolve => setTimeout(resolve, 30000));

		const secondGen = new TokenGenerator();
		const secondToken = secondGen.getToken('LN4EE52GEZFEEJRPMESHAVCAO4');

		expect(firstToken).not.toBe(secondToken);
	}, { timeout: 35000 });
});

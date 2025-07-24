const { validate } = require('zod');

test('hello world!', () => {
	expect(validate('test')).toBe('test');
});
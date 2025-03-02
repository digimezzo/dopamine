jest.mock('jimp', () => ({ exec: jest.fn() }));
jest.mock('@electron/remote', () => ({ exec: jest.fn() }));

global.crypto = {
    getRandomValues: (arr) => require('crypto').randomBytes(arr.length),
};

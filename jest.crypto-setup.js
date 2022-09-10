global.crypto = {
    getRandomValues: (arr) => require('crypto').randomBytes(arr.length),
};

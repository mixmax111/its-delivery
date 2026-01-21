const bcrypt = require('bcryptjs');

const hashPassword = async (password) => {
    return await bcrypt.hash(password, 10);
};

const comparePassword = async (inputPassword, savedHash) => {
    return await bcrypt.compare(inputPassword, savedHash);
};

module.exports = { hashPassword, comparePassword };
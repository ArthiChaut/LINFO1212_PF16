const { User, Clothes } = require("./models");
const bcrypt = require('bcryptjs');
const { Op } = require("sequelize");
const function_extension = require('./function_extension')

describe("Check if account already exists in database", () => {
    test("account exists", async () => {
        const resultUsername = await function_extension.accountExist('velkiz')
        const resultEmail = await function_extension.accountExist('velkiz')
     expect(resultUsername).toBe(true);
     expect(resultEmail).toBe(true);
    });
    test("account doesnt exist", async () => {
        const resultUsername = await function_extension.accountExist('natshara')
        const resultEmail = await function_extension.accountExist('natshara')
     expect(resultUsername).toBe(false);
     expect(resultEmail).toBe(false);
    })
})

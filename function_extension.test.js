const function_extension = require('./function_extension')

describe('Check if account already created'),() => {
    test('Account already exists',()=>{
        expect(function_extension.accountExist('velkiz').toBe(true))
        expect(function_extension.accountExist('max@gmail.com').toBe(true))
        })
    test('Account doesnt exist yet',()=>{
        expect(function_extension.accountExist('polo21').toBe(false))
        expect(function_extension.accountExist('poloman@outlook.com').toBe(false))
    })
}

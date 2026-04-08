import { Backend } from "../../route";
import { Account } from "../../db";
import { sha512 } from "hash-wasm";

const Method: Backend['method'] = 'post';
const Handler: Backend['handler'] = async (req, res) => {
    const { email, password } = req.body;

    if (!email) return res.status(400).json({ success: false, status: -203, message: 'Email is required' });
    if (!password) return res.status(400).json({ success: false, status: -203, message: 'Password is required' });

    const isExisting = Account.isExistingAccount(email);

    if (!isExisting) {
        return res.status(400).json({ success: false, status: -203, message: 'Email is not registered' });
    }

    const hashedPassword = await sha512(password);

    const isValid = Account.checkAccount(email, hashedPassword);

    if (!isValid) {
        return res.status(400).json({ success: false, status: -203, message: 'Invalid password' });
    }

    const account = Account.getAccountByEmail(email);
    delete account.password;

    req.session.nickname = account.nickname;
    req.session.email = account.email;
    return res.status(200).json({ success: true, status: 0, message: 'Login successful', data: account });
};

export default {
    method: Method,
    handler: Handler
} as Backend;
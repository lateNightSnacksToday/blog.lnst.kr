import { Backend } from "../../../route";
import { Verify, Account } from "../../../db";
import { sha512 } from "hash-wasm";

const Method: Backend['method'] = 'post';
const Handler: Backend['handler'] = async (req, res) => {
    const { email, code } = req.body;

    if (!email) return res.status(400).json({ success: false, status: -203, message: 'Email is required' });
    if (!code) return res.status(400).json({ success: false, status: -203, message: 'Verification code is required' });

    if (Account.isExistingAccount(email)) {
        return res.status(400).json({ success: false, status: -308, message: 'Email is already registered' });
    }

    const isExisting = Verify.isExistingVerificationWithEmail(email);

    if (!isExisting) {
        return res.status(400).json({ success: false, status: -204, message: 'No verification code found for this email' });
    }

    if (Verify.isExpiredVerification(email)) {
        Verify.deleteVerificationWithEmail(email);
        return res.status(400).json({ success: false, status: -205, message: 'Verification code has expired' });
    }

    const checked = Verify.checkVerification(email, code);

    if (!checked) {
        return res.status(400).json({ success: false, status: -204, message: 'Invalid verification code' });
    }

    const hashedCode = await sha512(code);

    Verify.updateVerification(email, hashedCode);

    return res.json({ success: true, status: -100, hashedCode });
};

export default {
    method: Method,
    handler: Handler
} as Backend;
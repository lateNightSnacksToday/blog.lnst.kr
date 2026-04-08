import { Backend } from "../../../route";
import { Verify, Account } from "../../../db";
import { sendVerifyEmail } from "../../../smtp";

const Method: Backend['method'] = 'post';
const Handler: Backend['handler'] = async (req, res) => {
    const { email, nickname } = req.body;

    if (!email) return res.status(400).json({ success: false, status: -203, message: 'Email is required' });

    if (Account.isExistingAccount(email)) {
        return res.status(400).json({ success: false, status: -203, message: 'Email is already registered' });
    }

    if (!nickname) return res.status(400).json({ success: false, status: -203, message: 'Nickname is required' });
    if (!validateName(nickname)) {
        return res.status(400).json({ success: false, status: -203, message: 'Invalid nickname.' });
    }

    if (!email.endsWith('@gsm.hs.kr') || email.startsWith('s') ? isNaN(email.slice(1).split('@gsm.hs.kr')[0]) : true) {
        return res.status(400).json({ success: false, status: -308, message: 'Only GSM email addresses are allowed' });
    }

    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const created_at = Date.now();
    const isExisting = Verify.isExistingVerificationWithEmail(email);
    const isExistingNickname = Verify.isExistingVerificationWithNickname(nickname);

    if (isExistingNickname) {
        Verify.deleteVerificationWithName(nickname);
    }

    if (isExisting) {
        const isUpdated = Verify.updateVerification(email, code);
        if (!isUpdated) {
            return res.status(500).json({ success: false, status: -308, message: 'Failed to update verification code' });
        }
    } else {
        const id = Verify.createVerification(nickname, email, code);
        if (!id) {
            return res.status(500).json({ success: false, status: -308, message: 'Failed to create verification' });
        }
    }

    console.log("secret code leak!!!",code);
    // await sendVerifyEmail(email, code);

    return res.json({ success: true, status: -100, created_at });
};

function validateName(name: string): boolean {
    name = name.replace(/ /g, '');

    if (Account.isExistingNickname(name)) {
        return false;
    }

    if (name.length < 2 || name.length > 8) {
        return false;
    }

    const koreanMatch = name.match(/[가-힣]/g);
    if (!koreanMatch || koreanMatch.length < 2) {
        return false;
    }

    if (!/^[가-힣0-9]+$/.test(name)) {
        return false;
    }

    if (name === '관리자' || name === '운영자') {
        return false;
    }

    return true;
}

export default {
    method: Method,
    handler: Handler
} as Backend;
// session 데이터를 유저에게 반환합니다.

import { Backend } from "../route";

const Method: Backend['method'] = 'all';
const Handler: Backend['handler'] = async (req, res) => {
    return res.json({ success: true, email: req.session.email, nickname: req.session.nickname, cookie: req.session.cookie });
};

export default {
    method: Method,
    handler: Handler
} as Backend;
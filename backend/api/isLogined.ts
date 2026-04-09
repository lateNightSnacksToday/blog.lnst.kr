import { Backend } from "../../route";

const Method: Backend['method'] = 'all';
const Handler: Backend['handler'] = async (req, res) => {
    return res.json({ success: true, isLogined: req.session.isLogined });
};

export default {
    method: Method,
    handler: Handler
} as Backend;
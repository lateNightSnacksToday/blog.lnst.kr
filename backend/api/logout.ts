import { Backend } from "../../route";

const Method: Backend['method'] = 'all';
const Handler: Backend['handler'] = async (req, res) => {
    req.session.destroy((err)=>{
        if (err) {
            return console.error("Session Destroy Error:",err); // 나중에 로그 추가해도 좋을듯
        }
    });
    return res.json({ success: true });
};

export default {
    method: Method,
    handler: Handler
} as Backend;
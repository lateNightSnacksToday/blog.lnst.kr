import { Backend } from "../../route";

const Method: Backend['method'] = 'all';
const Handler: Backend['handler'] = async (req, res) => {
    req.session.destroy((err)=>{
        if (err) {
            return console.error("Session Destroy Error:",err);
        }
    });
    return res.json({ success: true });
};

export default {
    method: Method,
    handler: Handler
} as Backend;
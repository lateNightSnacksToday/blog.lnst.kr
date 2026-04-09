import { Backend } from "../../route";

const Method: Backend['method'] = 'all';
const Handler: Backend['handler'] = async (req, res) => {
    req.session.destroy((err)=>{
        if (err) {
<<<<<<< HEAD
            return console.error("Session Destroy Error:",err); // 나중에 로그 추가해도 좋을듯
=======
            return console.error("Session Destroy Error:",err);
>>>>>>> 2add68ad75a89627d0210ea6c8f52b0389b4b2a9
        }
    });
    return res.json({ success: true });
};

export default {
    method: Method,
    handler: Handler
} as Backend;
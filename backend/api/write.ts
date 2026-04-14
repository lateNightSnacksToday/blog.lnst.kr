import { Blog } from "../../db";
import { Backend } from "../../route";

const Method: Backend['method'] = 'post';
const Handler: Backend['handler'] = async (req, res) => {
    const { title, content } = req.body;
    if (req.session.userId == undefined) {
        return res.status(400).json({ success: false, message: "userId not found" });
    }
    Blog.createBlog(title,content,req.session.userId);
    return res.json({ success: true });
};
// fetch("/api/write", {
//     method: "post",
//     headers: { 'Content-Type': 'application/json' },
//     body: JSON.stringify({ title: "test title", content: "test content" }),
// });

export default {
    method: Method,
    handler: Handler
} as Backend;
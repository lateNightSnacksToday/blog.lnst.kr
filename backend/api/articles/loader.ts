import { Blog } from "../../../db";
import { Backend } from "../../../route";

const Method: Backend['method'] = 'post';
const Handler: Backend['handler'] = async (req, res) => {
    const { id } = req.body;
    if (typeof id !== 'number' || !Number.isInteger(id) || id <= 0) {
        return res.status(400).json({ success: false, message: 'Invalid id' });
    }
    if (!req.session.isLogined) {
        return res.status(400).json({ success: false, message: 'Not logged in' });
    }
    const blog = Blog.getBlogById(id);
    if (!blog) {
        return res.status(404).json({ success: false, message: 'Blog not found' });
    }
    return res.json({ success: true, blog });
};

export default {
    method: Method,
    handler: Handler
} as Backend;

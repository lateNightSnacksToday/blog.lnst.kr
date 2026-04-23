import { Account, Blog } from "../../../db";
import { Backend } from "../../../route";

const Method: Backend['method'] = 'post';
const Handler: Backend['handler'] = async (req, res) => {
    const { page } = req.body;
    if (!isSafeNumber(page)) {
        return res.status(400).json({ success: false, message: 'Invalid page' });
    }
    if (!req.session.isLogined) {
        return res.status(400).json({ success: false, message: 'Not logged in' });
    }
    if (!req.session.userId) {
        return res.status(400).json({ success: false, message: 'userId not found' });
    }
    return res.json({ success: true, blogs: Blog.getBlogsByPage(page), maxPage: Blog.getBlogPageCount() });
};

function isSafeNumber(num: number): boolean {
    if (num <= 1e20 && num % 1 == 0 && num >= 0) {
        return true;
    }
    return false;
}

export default {
    method: Method,
    handler: Handler
} as Backend;
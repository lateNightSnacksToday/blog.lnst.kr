import { Account, Blog } from "../../db";
import { Backend } from "../../route";

const Method: Backend['method'] = 'post';
const Handler: Backend['handler'] = async (req, res) => {
    const { id, page } = req.body;
    if (!isSafeNumber(page)) {
        return res.status(400).json({ success: false, message: 'Invalid page' });
    }
    const isValidId = !!Account.getAccountById(id);
    if (!isValidId) {
        return res.status(400).json({ success: false, message: 'Invalid id' });
    }
    // TODO: 민감한 정보가 있다면 제거
    return res.json({ success: true, blogs: Blog.getBlogsByPage(id,page), maxPage: Blog.getBlogPageCount(id) });
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
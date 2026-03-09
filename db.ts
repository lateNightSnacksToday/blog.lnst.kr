import Database from "better-sqlite3";
import path from "path";

const dbPath = path.join(__dirname, "blog.db");
const db = new Database(dbPath);

/**
 * 'verification' table
 * - _id: primary key
 * - nickname: unique nickname for the user
 * - email: email address (unique)
 * - code: verification code
 * - created_at: timestamp of when the code was created
 */

/**
 * 'account' table
 * - _id: primary key
 * - email: email address (unique)
 * - password: hashed password
 * - nickname: unique nickname for the user
 * - admin: boolean indicating if the user is an admin
 * - read_reach: 0 - develop / notice, 1 - free board, 2 - admin board
 * - write_reach: 0 - none, 1 - free board, 2 - admin board
 * - created_at: timestamp of when the account was created
 */

/**
 * 'blog' table
 * - _id: primary key
 * - title: title of the blog post
 * - content: content of the blog post
 * - media: JSON string containing media information (e.g., images, videos, media locations)
 * - author_id: foreign key referencing account(_id)
 * - created_at: timestamp of when the blog post was created
 * - updated_at: timestamp of when the blog post was last updated
 */

db.exec(`
CREATE TABLE IF NOT EXISTS verification (
    _id INTEGER PRIMARY KEY AUTOINCREMENT DEFAULT 0,
    nickname TEXT NOT NULL UNIQUE,
    email TEXT NOT NULL UNIQUE,
    code TEXT NOT NULL,
    created_at INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS account (
    _id INTEGER PRIMARY KEY AUTOINCREMENT DEFAULT 0,
    email TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL,
    nickname TEXT NOT NULL UNIQUE,
    admin INTEGER NOT NULL DEFAULT 0,
    read_reach INTEGER NOT NULL DEFAULT 0,
    write_reach INTEGER NOT NULL DEFAULT 0,
    created_at INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS blog (
    _id INTEGER PRIMARY KEY AUTOINCREMENT DEFAULT 0,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    media TEXT,
    author_id INTEGER NOT NULL,
    created_at INTEGER NOT NULL,
    updated_at INTEGER,
    FOREIGN KEY (author_id) REFERENCES account(_id)
);
`);

export class Verify {
    static createVerification(nickname: string, email: string, code: string) {
        const stmt = db.prepare(`INSERT INTO verification (nickname, email, code, created_at) VALUES (?, ?, ?, ?)`);
        const info = stmt.run(nickname, email, code, Date.now());
        return info.lastInsertRowid;
    }

    static updateVerification(email: string, code: string) {
        const stmt = db.prepare(`UPDATE verification SET code = ?, created_at = ? WHERE email = ?`);
        const info = stmt.run(code, Date.now(), email);
        return info.changes > 0;
    }

    static deleteVerification(email: string) {
        const stmt = db.prepare(`DELETE FROM verification WHERE email = ?`);
        const info = stmt.run(email);
        return info.changes > 0;
    }

    static isExpiredVerification(email: string, expireTime: number = 1000 * 60 * 1) {
        const stmt = db.prepare(`SELECT created_at FROM verification WHERE email = ?`);
        const row: any = stmt.get(email);
        if (!row) return true;
        return Date.now() - row.created_at > expireTime;
    }

    static checkVerification(email: string, code: string) {
        const stmt = db.prepare(`SELECT * FROM verification WHERE email = ? AND code = ?`);
        const row: any = stmt.get(email, code);
        return !!row;
    }

    static isExistingVerification(email: string) {
        const stmt = db.prepare(`SELECT * FROM verification WHERE email = ?`);
        const row: any = stmt.get(email);
        return !!row;
    }

    static getNicknameByEmail(email: string) {
        const stmt = db.prepare(`SELECT nickname FROM verification WHERE email = ?`);
        const row: any = stmt.get(email);
        return row ? row.nickname : null;
    }
}

export class Account {
    static createAccount(email: string, password: string, nickname: string) {
        const stmt = db.prepare(`INSERT INTO account (email, password, nickname, created_at) VALUES (?, ?, ?, ?)`);
        const info = stmt.run(email, password, nickname, Date.now());
        return info.lastInsertRowid;
    }

    static isExistingAccount(email: string) {
        const stmt = db.prepare(`SELECT * FROM account WHERE email = ?`);
        const row: any = stmt.get(email);
        return !!row;
    }
}
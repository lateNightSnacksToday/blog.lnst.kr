import session from 'express-session';
import Database from 'better-sqlite3';

declare function SqliteStore(
    session: typeof import('express-session')
): new (options: SqliteStore.Options) => session.Store;

declare namespace SqliteStore {
    interface Options {
        client: Database.Database;
        expired?: {
            clear?: boolean;
            intervalMs?: number;
        };
    }
}

export = SqliteStore;
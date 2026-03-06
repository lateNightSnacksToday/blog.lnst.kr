import * as fs from 'fs';
import * as path from 'path';
import express from 'express';

const app = express();
const PORT = 5690;

let frontExtension: string[] = ['html', 'css', 'js'];

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,PATCH,DELETE,OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    if (req.method === 'OPTIONS') {
        return res.sendStatus(204);
    }

    next();
});
app.use(express.json());

loadFrontendRoutes(app);
loadBackendRoutes(app);

app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server is running on port ${PORT}`);
});

function loadFrontendRoutes(app: any, ...args: string[]) {
    const basePath = path.join(__dirname, 'frontend', ...args);

    fs.readdir(basePath, { withFileTypes: true }, (err, files) => {
        if (err) {
            console.error('Error reading routes directory:', err);
            return;
        }

        files.forEach(file => {
            if (file.isDirectory()) {
                return loadFrontendRoutes(app, ...args, file.name);
            }

            if (!frontExtension.includes(file.name.split('.').pop() || '')) return;

            const fullPath = path.join(basePath, file.name);
            const html = fs.readFileSync(fullPath, 'utf-8');
            const route = { method: 'get', handler: (req: any, res: any) => res.send(html) };
            const routePath = path.join('/', ...args, file.name.replace(/\.html$/, '')).replace(/\\/g, '/');

            app.get(routePath, route.handler);
            console.log('Frontend:', routePath);

            if (routePath.endsWith('/index')) {
                const routePath2 = routePath.slice(0, -5);
                app.get(routePath2, route.handler);
                console.log('Frontend2:', routePath2);
            }
        });
    });
}

function loadBackendRoutes(app: any, ...args: string[]) {
    const basePath = path.join(__dirname, 'backend', ...args);

    fs.readdir(basePath, { withFileTypes: true }, (err, files) => {
        if (err) {
            console.error('Error reading routes directory:', err);
            return;
        }

        files.forEach(file => {
            if (file.isDirectory()) {
                return loadBackendRoutes(app, ...args, file.name);
            }

            if (!file.name.endsWith('.ts')) return;

            const fullPath = path.join(basePath, file.name);
            const route = require(fullPath).default;
            if (!route) return;

            const method = route.method?.toLowerCase();
            const routePath = path.join('/', ...args, file.name.replace(/\.ts$/, '')).replace(/\\/g, '/');
            const handler = route.handler;

            if (!method || !routePath || !handler) return;

            app[method](routePath, handler);
            console.log('Backend:', method.toUpperCase(), routePath)

            if (routePath.endsWith('/index')) {
                const routePath2 = routePath.slice(0, -5);
                app[method](routePath2, handler);
                console.log('Backend2:', method.toUpperCase(), routePath2);
            }

            if (route.data) {
                app.locals.routeData = {
                    ...(app.locals.routeData || {}),
                    ...route.data
                };
            }
        });
    });

}


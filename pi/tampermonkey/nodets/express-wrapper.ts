const express = require('express');
import { Express, NextFunction, Request, Response } from 'express';
import { promises } from 'fs';
import { Http2ServerRequest } from 'http2';
import { join } from 'path';

export type HttpRequest = Request;
export type HttpResponse = Response;

const resources: Array<{
    type: 'get' | 'post' | 'delete' | 'put',
    path: string
    target: any
    callback(req, res): Promise<void>,
}> = [];

export function Path(subPath?: string) {
    return (target: { path?: string, name: string }) => {
        let sPath = subPath || target.name.toLowerCase();
        if (target.path) {
            sPath = `${target.path}/${sPath}`;
        }
        target.path = sPath;
    };
}

function resourceFunction(method: typeof resources[0]['type'], options: { path: string; }) {
    return (target: any, propertyKey: string, descriptor: TypedPropertyDescriptor<(req: HttpRequest, res: HttpResponse) => Promise<void>>) => {
        resources.push({
            callback: target[propertyKey],
            type: method,
            path: options.path,
            target
        });
    };
}
export function GET(options: { path: string }) {
    return resourceFunction('get', options);
}
export function POST(options: { path: string }) {
    return resourceFunction('post', options);
}

export function PUT(options: { path: string }) {
    return resourceFunction('put', options);
}

export async function initialize(rootpath: string, options?: {
    public?: string
    allowCors?: boolean
    prereesources?(app: Express): void;
    postresource?(app: Express): void;
}) {
    await loadFiles(rootpath);
    console.log('laoded files');

    const app: Express = express();

    if (options.allowCors) {
        app.use((req, res, next) => {
            res.header('Access-Control-Allow-Origin', '*');
            res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
            next();
        });
    }

    app.use(express.json({ limit: '800mb' }));
    app.use(express.urlencoded());
    app.use(express.text());

    if (options && options.prereesources) {
        options.prereesources(app);
    }
    for (let resource of resources) {
        const filePath = resource.target.constructor.path ? '/' + resource.target.constructor.path : '';
        const resourcePath = resource.path.startsWith('/') || resource.path === '' ? resource.path : '/' + resource.path;
        const fullPath = `/rest${filePath}${resourcePath}`;
        console.log(`adding ${fullPath} with ${resource.type.toLocaleUpperCase()}`);
        app[resource.type](fullPath, async (req, res) => {
            try {
                await resource.callback(req, res);
            } catch (e) {
                console.error(e);
                res.status(500)
                    .send(e);
            }
        });
    }

    if (options.public) {
        app.use(express.static(options.public));
        app.all('/*', (req, res) => {
            res.sendFile(options.public + '/index.html');
        });
    }

    if (options && options.postresource) {
        options.postresource(app);
    }
    app.listen(8080, '', () => {
        console.log('started server on localhost with port 8080');
    });
}

async function loadFiles(path: string) {
    const files = await promises.readdir(path);
    await Promise.all(files.map(async (file) => {
        const absolutePath = join(path, file);
        const stats = await promises.stat(absolutePath);
        if (stats.isFile()) {
            await loadFile(absolutePath);
        } else if (stats.isDirectory()) {
            await loadFiles(absolutePath);
        }

    }));
}

async function loadFile(absolutePath: string) {
    if (absolutePath.endsWith('.js') || absolutePath.endsWith('.ts')) {
        const data = await promises.readFile(absolutePath);
        if (data.includes('express-wrapper')) {
            require(absolutePath);
        }
    }
}
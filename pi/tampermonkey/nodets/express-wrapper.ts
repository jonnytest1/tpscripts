const express = require('express');
import { Express, Request, Response } from 'express';
import { readdir, readFile, stat } from 'fs';
import { extname, join } from 'path';

const resources: Array<{
    type: 'get' | 'post' | 'delete' | 'put',
    path: string
    callback(req, res): Promise<void>,
}> = [];

export function GET(options: { path: string }) {
    return (target: any, propertyKey: string, descriptor: TypedPropertyDescriptor<(req: Request, res: Response) => Promise<void>>) => {
        resources.push({
            callback: target[propertyKey],
            type: 'get',
            path: options.path
        });
    };

}

export function POST(options: { path: string }) {
    return (target: any, propertyKey: string, descriptor: TypedPropertyDescriptor<(req: Request, res: Response) => Promise<void>>) => {
        resources.push({
            callback: target[propertyKey],
            type: 'post',
            path: options.path
        });
    };

}

export async function load(rootpath: string, options?: {
    prereesources?(app: Express): void;
    postresource?(app: Express): void;
}) {
    await loadFiles(rootpath);
    console.log('laoded files');

    const app: Express = express();
    app.use(express.static('public'));
    app.use(express.json({ limit: '800mb' }));
    app.use(express.urlencoded());
    app.use(express.text());

    if (options && options.prereesources) {
        options.prereesources(app);
    }
    for (let resource of resources) {
        console.log(`adding ${'/rest' + resource.path} with ${resource.type.toLocaleUpperCase()}`);
        app[resource.type]('/rest' + resource.path, resource.callback);
    }

    if (options && options.postresource) {
        options.postresource(app);
    }
    app.listen(8080, '', () => {
        console.log('started server on localhost with port 8080');
    });
}

async function loadFiles(path: string) {
    return new Promise((resolver, errorcb) => {
        readdir(path, 'utf-8', (err, files) => {
            if (err) {
                errorcb(err);
                return;
            }
            Promise.all(files.map(async (file) => {
                const absolutePath = join(path, file);
                // Stat the file to see if we have a file or dir

                await new Promise((res) => {
                    stat(absolutePath, async (err, stats) => {
                        if (err) {
                            errorcb(err);
                            return;
                        }
                        if (stats.isFile()) {
                            if (absolutePath.endsWith('.js') || absolutePath.endsWith('.ts')) {
                                readFile(absolutePath, (err, data) => {
                                    if (err) {
                                        errorcb(err);
                                        return;
                                    }
                                    if (data.includes('express-wrapper')) {
                                        require(absolutePath);
                                    }
                                });
                            }
                        } else if (stats.isDirectory()) {
                            await loadFiles(absolutePath);
                        }
                        res();
                    });
                });
            }))
                .then(resolver);
        });
    });
}
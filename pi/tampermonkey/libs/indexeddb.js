/// <reference path="../customTypes/index.d.ts" />
/// <reference path="../DOM/progress-overlay.js" />

/**
 * @typedef indexedDB
 * @property {(store:string,options?:getCursprOption)=>Promise<{count:number,cursor:IDBCursorWithValue}>} getCursor
 * @property {(store:string,key:string|number,value:any)=>Promise<>} put
 */

/**
 * @typedef getCursprOption
 * @property {ProgressOverlayOptions} [progressMonitor]
 */

/**
 * @type {{type:EvalScript<{}>}}
 */
var indexeddb = new EvalScript('', {
    run: async (resolv, set) => {
        /**
         *
         * @param {string} db
         * @returns {Promise<IDBDatabase>}
         */
        async function getDb(db = 'tampermonkeyDB') {
            return new Promise((resolver, error) => {
                var dbPromise = indexedDB.open(db, 2);
                dbPromise.onsuccess = async (e) => {
                    try {
                        /**
                         * @type {IDBDatabase}
                         */
                        // @ts-ignore
                        const database = e.target.result;
                        resolver(database);
                    } catch(e) {
                        error(e);
                    }
                };
                dbPromise.onupgradeneeded = (e) => {
                    error(e);
                };
                dbPromise.onerror = error;
            });
        }
        /**
         *
         * @param {*} store
         * @returns {Promise<IDBObjectStore>}
         */
        async function getObjectStore(store) {
            return new Promise(async (resolver, error) => {
                try {
                    const database = await getDb(store);
                    const transaction = database.transaction('store', 'readwrite');
                    transaction.onerror = (e) => {
                        console.error(e);
                        error(e);
                    };
                    transaction.oncomplete = e => {
                        //console.log(`completed transactoin`, e);
                    };
                    resolver(transaction.objectStore('store'));
                } catch(e) {
                    if(e instanceof IDBVersionChangeEvent) {
                        // @ts-ignore
                        const objSTore = await updateDB('store', e.target.result);
                        resolver(objSTore);
                    } else {
                        error(e);
                    }

                }
            });
        }

        function updateDB(store, database) {
            try {
                // const transaction = database.transaction(store, 'readwrite');
                const objSTore = database.createObjectStore(store);
                objSTore.createIndex('key', 'key', { unique: true });
                objSTore.createIndex('value', 'value', { unique: false });
                return objSTore;
            } catch(e) {
                console.error(e);
            }
        }

        async function getCount(storeName) {
            return new Promise(async (resolver, error) => {
                try {
                    const store = await getObjectStore(storeName);
                    const request = store.count();
                    request.onsuccess = (ev) => {
                        resolver(request.result);
                    };
                    request.onerror = error;
                } catch(e) {
                    error(e);
                }
            });
        }
        /**
         *
         * @param {*} storeName
         * @param {getCursprOption} options
         */
        async function getCursor(storeName, options = {}) {
            return new Promise(async (resolver, error) => {
                try {
                    const count = await getCount(storeName);
                    const store = await getObjectStore(storeName);

                    const request = store.openCursor();
                    let data = [];
                    request.onsuccess = async (ev) => {
                        if(options.progressMonitor) {
                            options.progressMonitor.count = data.length;
                            options.progressMonitor.max = count;
                        }
                        if(request.result) {
                            data.push(JSON.parse(request.result.value));
                            if(data.length > 10) {
                                resolver(data);
                                return;
                            }
                            request.result.continue();
                        } else {
                            resolver(data);
                        }
                    };

                    request.onerror = e => {
                        console.error(e);
                        error(e);
                    };

                } catch(e) {
                    error(e);
                }
            });
        }

        async function put(storeName, key, value) {
            return new Promise(async (resolver, error) => {
                try {
                    const objectStore = await getObjectStore(storeName);
                    const putRequest = objectStore.put(JSON.stringify(value), key);
                    putRequest.onsuccess = () => {
                        resolver();
                    };
                    putRequest.onerror = e => {
                        console.error(e);
                        error(e);
                    };

                } catch(e) {
                    debugger;
                    error(e);
                }
            });
        }

        async function add(storeName, key, value) {
            return new Promise(async (resolver, error) => {
                try {
                    const objectStore = await getObjectStore(storeName);
                    const putRequest = objectStore.add(JSON.stringify(value), key);
                    putRequest.onsuccess = () => {
                        resolver();
                    };
                    putRequest.onerror = e => {
                        console.error(e);
                        error(e);
                    };

                } catch(e) {
                    debugger;
                    error(e);
                }
            });
        }
        resolv({
            getCursor, put
        });
        return false;
    },
    reset: (set) => {
        //
    }
});
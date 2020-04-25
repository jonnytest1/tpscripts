import { IncomingHttpHeaders } from 'http';

import * as ldap from 'ldapjs';
interface LoginData {
    username: string;

    password: string;
}
export class LDAP {
    isAuthenticated(headers: IncomingHttpHeaders) {
        for (const header in headers) {
            const headerValue: string = headers[header] as string;
            if (header === 'cookie') {
                return !!LDAP.authenticated[headerValue.split('Authorization=')[1]];
            }
        }
        return false;

    }
    static authenticated: { [cookie: string]: string } = {};
    async login(data: LoginData): Promise<string> {
        const clientOptions = {
            url: 'ldap://' + process.env.LDAPSERVER
        };
        const client = ldap.createClient(clientOptions);
        return new Promise((resolver, errorCallback) => {
            try {
                const test = client.bind(process.env.USERPREFIX + data.username, data.password, error => {
                    if (error) {
                        errorCallback(error);
                    }
                    const number = Math.random();
                    LDAP.authenticated[number + ''] = 'true';
                    resolver(number + '');
                }, undefined, undefined);
            } catch (e) {
                debugger;
            }
        });
    }
    /**
     * client.bind('username', 'password', function (err) {
  client.search('CN=test,OU=Development,DC=Home', opts, function (err, search) {
    search.on('searchEntry', function (entry) {
      var user = entry.object;
      console.log(user.objectGUID);
    });
  });
});
     */
}
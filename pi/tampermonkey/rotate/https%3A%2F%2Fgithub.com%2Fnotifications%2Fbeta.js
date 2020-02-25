/// <reference path="../customTypes/index.d.ts"/>
/// <reference path="../notification.js"/>
new EvalScript('', {
    run: async (resolv, set) => {
        const unread = await sc.g.a('mail-status unread');
        if(unread) {
            GMnot('new git Notifications');
        }
    }
    , reset: set => {
        return;
    }
});
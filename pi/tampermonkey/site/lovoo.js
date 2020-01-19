/**
 * @type { EvalScript<{originalOpen:any,interval:any}>}
 */
var lovooscript = new EvalScript('', {
    run: async (ret, set) => {
        let users = {};
        let userHistory = {};
        set.originalOpen = XMLHttpRequest.prototype.open;
        XMLHttpRequest.prototype.open =/** @param {String} url */ function(method, url, ...args) {
            /* tslint:disable */
            const request = this;
            if(url.startsWith('/api_web.php')) {
                request.addEventListener('readystatechange', (event) => {
                    if(request.readyState === 4) {
                        if(request.responseURL.includes('https://de.lovoo.com/api_web.php/users/') &&
                            !request.responseURL.split('https://de.lovoo.com/api_web.php/users/')[1]
                                .includes('/')) {
                            const user = JSON.parse(request.responseText).response.user;
                            setTimeout(() => {
                                /**
                                 * @type {HTMLElement}
                                 */
                                const location = document.querySelector('.padding div');
                                location.innerText += '  ' + user.locations.home.distance;
                                /**
                                                                 * @type {HTMLElement}
                                                                 */
                                const text = document.querySelector('.s-links-gender');
                                text.innerHTML = `${user.whazzup || 'no whazzup'}<br>-----------------<br>${user.freetext || 'no freetext'}`;
                            }, 600);
                        } else if(request.responseURL.includes('https://de.lovoo.com/api_web.php/matches?limit=10')) {
                            const requestUsers = JSON.parse(request.responseText).response.result;
                            Object.entries(users)
                                .forEach(entry => {
                                    userHistory[entry[0]] = entry[1];
                                });
                            users = {};
                            for(let user of requestUsers) {
                                users[user.id] = user;
                            }
                        }
                    }
                });
            }
            set.originalOpen.call(request, method, url, ...args);
        };
        let currentUser = null;
        let textRef = null;
        set.interval = setInterval(() => {
            /**
             * @type {HTMLAnchorElement}
             */
            const link = document.querySelector('a[data-automation-id="match-user-profile-link"]');
            let userId = link.href.split('profile/')[1];

            const currentUserName = document.querySelector('h2.u-text-xl').textContent;
            if(currentUser === userId && !currentUserName.includes(users[userId].name)) {
                debugger;
                userId = Object.entries(users)
                    .find((entry) => currentUserName.split(',')[0] === entry[1].name)[1].id;
                link.href = 'https://de.lovoo.com/profile/' + userId;
            }

            if((currentUser === null || currentUser !== userId) && users[userId]) {
                const user = users[userId];

                if(!user) {
                    console.warn('no user');
                    return;
                }
                currentUser = userId;

                if(textRef !== null) {
                    textRef.remove();
                }

                const ref = document.querySelector('.h6 div.space-before-xs');
                textRef = document.createElement('div');
                textRef.innerHTML = `<br> <br>
                distance:${user.locations.home.distance}<br>
                 ${user.whazzup || 'no whazzup'}<br>
                 -----------------<br>
                 ${user.freetext || 'no freetext'}<br>
                 <br>
                 <table class="iamgeTable"></table>
                 `;
                ref.appendChild(textRef);

                const table = textRef.querySelector('.iamgeTable');
                fetch(`https://de.lovoo.com/api_web.php/users/${user.id}/pictures`)
                    .then(res => res.json())
                    .then(pictures => {
                        let imageRow = document.createElement('tr');
                        table.appendChild(imageRow);
                        for(let i = 0; i < pictures.response.result.length; i++) {
                            let image = pictures.response.result[i];
                            const imgContainer = document.createElement('td');
                            const imgI = document.createElement('img');
                            imgI.src = (image.images[6] || image.images[5]).url;
                            imgI.style.width = '180px';
                            imgContainer.appendChild(imgI);
                            imageRow.appendChild(imgContainer);
                            if(!image.approved) {
                                imgI.style.border = '3px solid red';
                            }
                            if(i % 2 === 1) {
                                imageRow = document.createElement('tr');
                                table.appendChild(imageRow);
                            }
                        }
                    });

                console.log('ading for ' + userId, user);

                fetch(`https://de.lovoo.com/api_web.php/users/${user.id}/visits`, {
                    method: 'POST',
                    headers: {
                        app: 'lovoo',
                        'content-type': 'application/json;charset=UTF-8',
                        accept: 'application/json, text/plain, */*',
                        'x-csrf-token': document.cookie.split('lovoocsrf=')[1]
                            .split(';')[0]
                    },
                    body: `{"userId":"${user.id}"}`
                })
                    .then(console.log)
                    .catch(console.error);
            }

        }, 200);
    },
    reset: (vals) => {
        XMLHttpRequest.prototype.open = vals.originalOpen;
        clearInterval(vals.interval);
    }
});
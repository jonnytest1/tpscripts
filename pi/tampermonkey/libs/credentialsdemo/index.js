function storeCredential() {
    event.preventDefault();

    if(!navigator.credentials) {
        alert('Credential Management API not supported');
        return;
    }

    let credentialForm = document.getElementById('credential-form');
    let credential = new PasswordCredential({
        id: "example-username",
        name: "John Doe", // In case of a login, the name comes from the server.
        password: "correct horse battery staple"
    });
    navigator.credentials.store(credential)
        .then(() => log('Storing credential for ' + credential.id + ' (result cannot be checked by the website).'))
        .catch((err) => log('Error storing credentials: ' + err));
}

async function createCreds() {
    const td = new TextEncoder()
    /**
     * @type { PublicKeyCredentialCreationOptions}
     */
    const options = {
        "rp": {
            "name": "WebAuthn Codelab"
        },
        "user": {
            "displayName": "User Name",
            "id": td.encode("123"),
            "name": "test"
        },
        "challenge": td.encode("123"),
        "pubKeyCredParams": [
            {
                "type": "public-key",
                "alg": -7
            }, {
                "type": "public-key",
                "alg": -257
            }
        ],
        "excludeCredentials": [
            {
                "id": td.encode("123"),
                "type": "public-key",
                "transports": [
                    "internal"
                ]
            }
        ],
        // "attestation": "none",
        "authenticatorSelection": {
            "authenticatorAttachment": "platform",
            "userVerification": "required"
        }
    }

    const cred = await navigator.credentials.create({
        publicKey: options,
    });

    const credential = {};
    if(cred.response) {
        const clientDataJSON =
            base64url.encode(cred.response.clientDataJSON);
        const attestationObject =
            base64url.encode(cred.response.attestationObject);
        credential.response = {
            clientDataJSON,
            attestationObject
        };
    }


    navigator.credentials.store(cred)
        .then(() => log('Storing credential for ' + cred.id + ' (result cannot be checked by the website).'))
        .catch((err) => log('Error storing credentials: ' + err));
}

function requestCredential() {
    if(!navigator.credentials) {
        alert('Credential Management API not supported');
        return;
    }

    let mediationValue = document.getElementById('credential-form').mediation.value;


    navigator.credentials.get({
        password: true,
        mediation: mediationValue,
    })
        .then(credential => {
            let result = 'none';
            if(credential) {
                result = credential.id + ', ' + credential.password.replace(/./g, '*');
            }
            log('Credential read: ' + result + '');
        })
        .catch((err) => log('Error reading credentials: ' + err));
}

function preventSilentAccess() {
    if(!navigator.credentials) {
        alert('Credential Management API not supported');
        return;
    }

    navigator.credentials.preventSilentAccess()
        .then(() => log('Silent access prevented (mediation will be required for next credentials.get() call).'))
        .catch((err) => log('Error preventing silent access: ' + err));
}

function waitForSms() {
    if('OTPCredential' in window) {
        log('Waiting for SMS. Try sending yourself a following message:\n\n' +
            'Your verification code is: 123ABC\n\n' +
            '@whatwebcando.today #123ABC');

        navigator.credentials.get({ otp: { transport: ['sms'] } })
            .then((code) => log('Code received: ' + code))
            .catch((error) => log('SMS receiving error: ' + error));
    } else {
        alert('Web OTP API not supported');
    }
}

function log(info) {
    var logTarget = document.getElementById('result');
    var timeBadge = new Date().toTimeString().split(' ')[0];
    var newInfo = document.createElement('p');
    newInfo.innerHTML = '' + timeBadge + ' ' + info;
    logTarget.appendChild(newInfo);
}
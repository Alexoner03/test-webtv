import {ref} from "vue";
import {ClientJS} from 'clientjs';
import CryptoJS from 'crypto-js';

const client = new ClientJS();
const fingerid = client.getFingerprint();

const loginref = 'devid' in localStorage && localStorage.devid == fingerid;
const isLogged = ref(loginref);

export default function()
{
    const login = async (user, pass) =>
    {
        const aes_encrypt = (str_to_encrypt) => {
            const key = CryptoJS.enc.Utf8.parse("Groupalnetpro22.");
            const iv = CryptoJS.enc.Utf8.parse("Groupalnetpro22.");

            const encrypted = CryptoJS.AES.encrypt(str_to_encrypt, key, {'mode':CryptoJS.mode.CBC, iv:iv});
            return encrypted.toString();
        };        
        
        const formData = new FormData();
        const url = process.env.VUE_APP_API_URL+'/api/get-web';

        formData.append('user', user);
        formData.append('pass', pass);

        if(process.env.VUE_APP_ENVIAR_IP) {
            const fetchIp = await await fetch('https://httpbin.org/ip');
            const ipData = await fetchIp.json();
            formData.append('networkid', aes_encrypt(ipData.origin));
        }

        const response = await fetch(url,{method:'POST', body:formData});

        if (response.ok)
        {            
            const udata = await response.json();
            
            if(udata.user){
                isLogged.value = true;
                const crkey =  fingerid*1 + (new Date().setHours(24,0,0,0) / 1000) + "lasindy";

                localStorage.vaun  = 0;
                localStorage.mail  = user;
                localStorage.devid = fingerid;
                localStorage.user  = udata.user;
                localStorage.jwt2  = CryptoJS.AES.encrypt(pass, crkey).toString();

                return {"msg": "Welcome", "status": true};
            }
            else{
                return {"msg": "Credenciales incorrectas", "status": false};
            }
        }  
        else{
            const message = `An error has occured: ${response.status}`;
            throw new Error(message);
        }
    }

    return {
        isLogged,
        login
    }
}
import {ref} from "vue";
import CryptoJS from 'crypto-js';
const isLogged = ref(false);

export default function()
{
    const validateLogin = _=>
    {
        const localKeys = Object.keys(localStorage);
        const loginKeys = ['logindate','mail','mac','user','cliente','jwt2','token'];
        const currUnix  = Math.floor(Date.now() / 1000);

        isLogged.value = loginKeys.every(el=>localKeys.includes(el)) &&
                        localStorage.cliente == process.env.VUE_APP_CLIENTE &&
                        currUnix - localStorage.logindate < process.env.VUE_APP_HOURS_TO_REAUTH * 3600;
    }

    const login = async (user, pass, mac = "") =>
    {
        const formData = new FormData();
        const url = process.env.VUE_APP_API_URL+'api/get-web2';

        formData.append('user', user);
        formData.append('pass', pass);
        formData.append('devid', mac);

        const response = await fetch(url, {method:'POST', body:formData});

        if (response.ok)
        {            
            const crkey = mac + "lasindy24";
            const udata = await response.json();
            
            if(udata.user)
            {
                localStorage.mac = mac;
                localStorage.mail = user;
                localStorage.user = udata.user;
                localStorage.token = udata.token;
                localStorage.cliente = process.env.VUE_APP_CLIENTE;
                localStorage.logindate = Math.floor(Date.now() / 1000);
                localStorage.jwt2 = CryptoJS.AES.encrypt(pass, crkey).toString();

                isLogged.value = true;

                return {"status": true};
            }
            else{
                return {"msg": udata.message??"No se pudo iniciar sesión, inténtelo más tarde.", "status": false};
            }
        }  
        else{
            const message = `Error: ${response.status}`;
            throw new Error(message);
        }
    }

    return {
        login,
        isLogged,
        validateLogin
    }
}
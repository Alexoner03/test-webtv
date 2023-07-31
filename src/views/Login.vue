<template>
    <div class="row rew">
        <div class="flex md6" id="mancol">
            &nbsp;
        </div>
        <div class="flex md6 xs12 align--center justify--center d-flex">
            <div id="loginform">
                <img :src="require('@/assets/'+logo)" class="d-block mb-5" height="50">
                <va-alert id="aviso" dense color="danger" icon="info" v-model="showAlert" closeable>
                    {{ alertMsg }}
                </va-alert>
                <br>
                <h1 class="mb-3">Iniciar Sesión</h1>
                <br>
                <form method="POST" action="#" @submit.prevent="inicioSesion">
                    <div class="mb-3 form-group">
                        <label for="user">Correo Electrónico</label>
                        <input type="email" class="form-field" v-model="user" id="user" name="user" placeholder="Ej: micorreo@correo.cl" required>
                    </div>
                    <div class="mb-4 form-group">
                        <label for="pass">Password</label>
                        <input type="password" class="form-field" v-model="pass" id="pass" name="pass" placeholder="Ej: XXXXXXXX" required>
                    </div>
                    <div>
                        <va-button type="submit" size="medium" class="py-2" :loading="logeando">Ingresar</va-button>
                    </div>
                </form>
            </div>
        </div>
    </div>
</template>

<script> 
import loginService from '../services/login.service'

export default {
    data(){
        return {
            user:'',
            pass:'',
            alertMsg: '',
            check: false,
            showAlert: false,
            logo: process.env.VUE_APP_LOGO,
            queryParams: null,
            logeando: false
        }
    },
    created() {
        const {validateLogin, isLogged} = loginService();
        
        this.queryParams = new URLSearchParams(window.location.search);

        let sover = this.queryParams.get('sover');
        const firstDotIndex = sover.indexOf(".");
        const secondDotIndex = sover.indexOf(".", firstDotIndex + 1);
        sover = secondDotIndex !== -1 ? sover.slice(0, secondDotIndex) : sover;
        localStorage.ssl = parseFloat(sover) >= 20 ? 1 : 0;

        validateLogin();

        if(isLogged.value) this.$router.replace({name: "player"});
    },
    methods: {
        async inicioSesion() {
            this.logeando = true;
            const {login} = loginService();

            try {
                const result = await login(this.user,this.pass,this.queryParams.get('mac'));

                if(result.status){
                    this.$router.replace({name: "player"});
                }
                else{
                    this.showAlert = true;
                    this.alertMsg = result.msg;
                }
            }
            catch (error) {
                this.logeando = false;
                this.showAlert = true;
                this.alertMsg = "Error al conectarse con el servicio de inicio de sesión, inténtelo más tarde.";
            }

            setTimeout(() => this.showAlert=false, 6000);
        }
    }
}
</script>

<style>
    .rew>.flex{
        height: 100vh;
    }

    #mancol{
        background-image: url('https://trapemn.tv/assets/webtv/man.jpg');
        background-position-x: right;
        background-size: cover;
    }

    #loginform{
        color: white;
        width: 270px;
        flex: none;
    }

    form .va-button{
        color: #000304 !important;
        font-weight: bold !important;
        background-color: var(--webtv-accent) !important;
        width: 100%;
    }

    label{
        font-size: .85rem !important;
        display: block;
        margin-bottom: 6px !important;
    }

    h1{
        text-transform: uppercase;
        font-size: 1.4rem;
    }

    .form-field{
        border: 2px solid #3C3D41;
        padding: 10px 15px !important;
        background: transparent;
        border-radius: 5px;
        color: white;
        font-size: .8rem;
        width: 100%;
    }

    #aviso{
        width: 280px;
    }

    .va-checkbox__label{
        -webkit-user-select: none;
        user-select: none;
        font-size: .81rem;
    }

    @media (max-width:768px)
    {
        #mancol{display: none;}

        #mancol+div{
            background-image: url('https://trapemn.tv/assets/webtv/man.jpg');
            background-size: cover;
            background-position-x: right;
        }

        #loginform{
            width: 295px;
            flex: none;
            padding: 20px 15px;
            background-color: rgba(0,0,0,0.6);
            border-radius: 5px;
        }

        .form-field{
            border: 1px solid white;
        }

        ::placeholder {
            color: white;
            opacity: 0.6;
        }

        ::-ms-input-placeholder {
            color: white;
            opacity: 0.6;
        }
    }
</style>
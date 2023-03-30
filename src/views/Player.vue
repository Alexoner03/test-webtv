<template>
    <va-navbar color="#222327" class="px-4">
        <template #left>
            <va-navbar-item class="py-3">
                <img :src="require('@/assets/'+logo)" alt="oneplay logo" class="mt-1" height="35">
            </va-navbar-item>
            <va-navbar-item>
                <a href="javascript:" class="d-block px-4 py-3 menuitem active">
                    <img src="../assets/tv.png" alt="Icono de TV" class="d-block svgicon pb-1" height="24">
                    <span>TV</span>
                </a>
            </va-navbar-item>
        </template>
        <template #right>
            <va-button-dropdown class="mb-2" id="userbg" flat :label="username" color="#ffffff">
                <div id="usermenu">
                    <a href="#" @click="logout" class="px-5 py-2"><va-icon class="material-icons">logout</va-icon> Cerrar Sesión</a>
                </div>
            </va-button-dropdown>
        </template>
    </va-navbar>
    <div id="main">
        <va-sidebar :minimized="minimized" textColor="dark" minimizedWidth="0">
            <div v-if="canales">
                <va-sidebar-item id="favourite" @click="this.adultAllowed = false; favHidden = false">
                    <va-sidebar-item-content class="px-1 py-2">
                        <va-icon class="material-icons mr-5" :class="{hidden:favHidden}" @click.stop.prevent="this.adultAllowed = false; favHidden = true">arrow_back</va-icon>
                        <va-sidebar-item-title class="px-2" :class="{'text-center':favHidden}">
                            <va-icon class="material-icons">favorite</va-icon> <b>Favoritos</b>
                        </va-sidebar-item-title>
                    </va-sidebar-item-content>
                </va-sidebar-item>

                <va-sidebar-item hover-color="#222327" :class="{hidden:!favHidden}">
                    <va-sidebar-item-content class="px-1 py-2">
                        <va-icon class="material-icons" @click="arrow_left">arrow_back</va-icon>
                        <va-sidebar-item-title class="px-2 text-center overflow-h">
                            <Trunquee :text="currentCat" v-if="currentCat"/>
                        </va-sidebar-item-title>
                        <va-icon class="material-icons" @click="arrow_right">arrow_forward</va-icon>
                    </va-sidebar-item-content>
                </va-sidebar-item>

                <div class="px-2 mt-2" :class="{hidden:favHidden}">
                    <va-sidebar-item class="channel mb-1 overflow-h" v-for="channel in favoritos" :key="channel.cn_id" :class="{watching:channel.cn_id == playChId}" @click.prevent="clickFavourite(channel);">
                        <div class="row">
                            <div class="flex xs3">
                                <div class="chnum px-1 py-2 overflow-h text-center">
                                    {{channel.numero}}
                                </div>
                            </div>
                            <div class="flex xs2">
                                <img :src="channel.imagen" class="d-block" height="33">
                            </div>
                            <div class="flex xs6 overflow-h">
                                <div class="chname pl-1 pr-2 py-2">
                                    <Trunquee :text="channel.nombre"/>
                                </div>
                            </div>
                            <div class="flex xs1 pt-1" @click.stop.prevent="trashFavo($event, channel.cn_id)">
                                <span class="material-icons">delete_outline</span>
                            </div>
                        </div>
                    </va-sidebar-item>
                </div>

                <div v-for="section in secciones" :key="section.st_id" class="px-2" :class="{hidden:!favHidden}">
                    <va-sidebar-item class="sectionhead py-3" hover-color="#222327">
                        {{section.nombre}}
                    </va-sidebar-item>
                    <va-sidebar-item class="channel mb-1 overflow-h" v-for="channel in section.canales" :class="{watching:channel.cn_id == playChId}" :key="channel.cn_id" @click.prevent="currentSec=section; clickChannel(channel);">
                        <div class="chnum px-1 py-2 overflow-h text-center">
                            {{channel.numero}}
                        </div>
                        <div class="chlogo">
                            <img :src="channel.imagen" class="d-block" height="33">
                        </div>
                        <div class="chname px-2">
                            {{channel.nombre}}
                        </div>
                    </va-sidebar-item>
                </div>

            </div>
            <div v-else>
                Espere un momento
            </div>
        </va-sidebar>

        <va-button outline id="delerfav" class="favbtn" :rounded="false" text-color="#ffffff" style="border-color: #ffffff;" :class="[hideDelFavBtn?'fade':'', delFavClick?'done':'']" @click="delFromFavs">
            <span class="material-icons">close</span> Eliminar de Favoritos
        </va-button>

        <va-button outline id="addtofav" class="favbtn" :rounded="false" text-color="#ffffff" style="border-color: #ffffff;" :class="[hideFavBtn?'fade':'', addFavClick?'done':'']" @click="addtoFavs">
            <va-icon class="material-icons">favorite_border</va-icon> Añadir a Favoritos
        </va-button>

        <div v-show="favMsgShow">
            {{addFavClick ?'Se agregó a favoritos':'El favorito fue eliminado'}}
        </div>

        <div @click="minimized = true">
            <video ref="liveplayer" class="video-js vjs-theme-fantasy" playsinline autoplay controls preload="auto">
            </video>
        </div>

        <va-modal v-model="showEpgModal" fullscreen hide-default-actions>
            <slot>
                <Epg :currChId="currentCh?.cn_id ?? 1958" @clickEpg="playFromEpg" />
            </slot>
        </va-modal>

        <va-modal v-model="showParentalModal" size="small" hide-default-actions :mobile-fullscreen="false">
            <slot>
                <div id="parentform">
                    <h3>Control Parental</h3>
                    <br>
                    <p>Para acceder a ver estos canales</p><p>debes ingresar tu código parental</p>
                    <form method="POST" action="#" @submit.prevent="parentalCheck" autocomplete="off">
                        <div class="py-3">
                            <input type="text" name="parentcode" ref="parentcode" placeholder="Ej: XXXXXXXX" required>
                            <p v-show="badParental" class="pl-1 pt-2">¡El código ingresado no es correcto!</p>
                        </div>
                        <div>
                            <va-button type="submit" size="medium" class="py-2">Ver canales</va-button>
                        </div>
                    </form>
                </div>
            </slot>
        </va-modal>

        <va-modal v-model="showBuyPack" size="small" hide-default-actions :mobile-fullscreen="false">
            <slot>
                <div id="buypack" v-if="currentSec">
                    <h3>Pack {{currentSec.nombre}}</h3>
                    <br>
                    <div class="row">
                        <div class="flex xs12 md4">
                            <img :src="currentSec.imagen" class="d-block" height="104">
                        </div>
                        <div class="flex xs12 md7">
                            <p><b>No tienes contratado este Pack</b></p>
                            <br>
                            <p>{{ leyendaPremium }}</p>
                        </div>
                    </div>
                </div>
            </slot>
        </va-modal>

        <div id="chmenubtn" @click="minimized = !minimized" :class="[minimized?'':'opened', hideMenuBtn?'hidden':'']">
            <img src="../assets/chbtn.png" :class="[minimized?'d-block':'hidden']">
            <img src="../assets/chbtn2.png" :class="[minimized?'hidden':'d-block']">
        </div>
    </div>
</template>

<script>
import "video.js/dist/video-js.min.css";
import "@videojs/themes/dist/fantasy/index.css";
import '../assets/css/player.css';

import Trunquee from '../components/Trunquee.vue';
import Epg from '../components/Epg.vue';
import CryptoJS from 'crypto-js';
import videojs from 'video.js';
import bcrypt from 'bcryptjs';

export default {
    components: {
        Trunquee, Epg
    },
    
    async created() {
        this.username = localStorage.user;
        const fetchIp = await fetch('https://httpbin.org/ip');
        const ipData = await fetchIp.json();

        const limit = localStorage.vaun*1 || (new Date().setHours(24,0,0,0) / 1000);
        const cryptpass = localStorage.devid*1 + limit + "lasindy";
        let pass = false;

        try{
            pass = CryptoJS.AES.decrypt(localStorage.jwt2, cryptpass).toString(CryptoJS.enc.Utf8);
        }
        catch(e){ console.log(e); }
        
        if(pass && ipData.origin == localStorage.ipe)
        {
            const aes_encrypt = (str_to_encrypt) => {
                const key = CryptoJS.enc.Utf8.parse("Groupalnetpro22.");
                const iv = CryptoJS.enc.Utf8.parse("Groupalnetpro22.");

                const encrypted = CryptoJS.AES.encrypt(str_to_encrypt, key, {'mode':CryptoJS.mode.CBC, iv:iv});
                return encrypted.toString();
            };

            this.loginData.append("pass", pass);
            this.loginData.append("user", localStorage.mail);
            if(process.env.VUE_APP_ENVIAR_IP) this.loginData.append('networkid', aes_encrypt(ipData.origin));

            const favoData = new FormData();
            favoData.append("user_email", localStorage.mail);

            const fetchFavos = await fetch(process.env.VUE_APP_API_URL+'api/get-favorite',{method:'POST',body:favoData,redirect:'follow'});
            const fetchCanal = await fetch(process.env.VUE_APP_API_URL+'api/get-web',{method:'POST',body:this.loginData});
            
            const jsonFavos = await fetchFavos.json();
            const jsonCanal = await fetchCanal.json();
            
            this.wmskey = jsonCanal?.wmstoken;
            this.favoritos = jsonFavos.channels;
            this.canales = jsonCanal.sections;
            this.parentHash = jsonCanal.parentlockcode;
            this.premiumsAllow = jsonCanal.premiumsallowed;
            this.leyendaPremium = jsonCanal?.leyendapremium ?? 'Contrata nuestros paquetes de canales premium y disfruta del mejor contenido.';
        }
        else{
            localStorage.clear();
            console.log("Error de reautenticación");
            this.$router.replace({name: "login"});
        }        
    },

    mounted() {
        this.player = videojs(this.$refs.liveplayer,
        {
            html5: {
                nativeTextTracks: false,
                vhs: {
                    withCredentials: false
                }
            },
            languages: {
                en: {
                    "The media playback was aborted due to a corruption problem or because the media used features your browser did not support.":"La señal en estos momentos no está disponible, por favor, inténtelo nuevamente.",
                    "The media could not be loaded, either because the server or network failed or because the format is not supported.":"La señal en estos momentos no está disponible, por favor, inténtelo nuevamente.",
                    "No compatible source was found for this media.":"La señal en estos momentos no está disponible, por favor, inténtelo nuevamente."
                }
            },
            language: 'en',
            textTrackSettings: false,
            controlBar: {
                volumePanel: {
                    inline: false
                }
            }
        });

        this.player.on("useractive", () =>
        {
            this.hideMenuBtn = false;
            this.custom_fav_btn(this.currentCh);

            const ch = this.currentCh;
            const ahora = Math.round(+new Date()/1000);

            if(ch.epg.length==0){
                this.drawProgress("noepg");
            }
            else{
                const currentEnd = ch.epg[0].fecha_fin;

                if(ahora>currentEnd){
                    this.drawProgress(ch.epg.length>1 ? "next" : "noepg");
                }
                else{
                    this.drawProgress("default");
                }
            }
        });

        this.player.on("userinactive", async () =>
        {
            this.hideFavBtn = true;
            this.hideDelFavBtn = true;
            this.hideMenuBtn = this.minimized && (document.fullscreenElement || document.webkitFullscreenElement);

            if(this.addFavClick) setTimeout(_ => this.addFavClick = false, 1111);
            if(this.delFavClick) setTimeout(_ => this.delFavClick = false, 1111);
        });

        this.player.on("error", ()=>{
            this.hideFavBtn = true;
            this.hideDelFavBtn = true;
        });

        //Número del canal
        const controlChNum = this.player.controlBar.addChild("button");
        controlChNum.addClass("barNum");
        this.chNumtext = controlChNum.el();

        //Logo del canal
        const controlChImg = this.player.controlBar.addChild("button");
        controlChImg.addClass("barImg");
        this.chImgSrc = controlChImg.el();

        //Ahora
        const controlNow = this.player.controlBar.addChild("button");
        controlNow.addClass("barNow");
        this.chNowBlock = controlNow.el();

        //Después
        const controlNext = this.player.controlBar.addChild("button");
        controlNext.addClass("barNext");
        this.chNextBlock = controlNext.el();

        //Anterior Canal
        let chPrev = videojs.getComponent('Button');
        let chPrevButton = videojs.extend(chPrev, {
            constructor: function() {
                chPrev.apply(this, arguments);
                this.addClass('barChPrev');
            },
            handleClick: () => setTimeout(_ => this.playChannel(this.prevCh, this.playingFavs, true), this.minimized?1:999)
        });

        videojs.registerComponent('chPrevButton', chPrevButton);
        this.player.getChild('controlBar').addChild('chPrevButton', {});

        //Siguiente Canal
        let chNext = videojs.getComponent('Button');
        let chNextButton = videojs.extend(chNext, {
            constructor: function() {
                chNext.apply(this, arguments);
                this.addClass('barChNext');
            },
            handleClick: () => setTimeout(_ => this.playChannel(this.nextCh, this.playingFavs, true), this.minimized?1:999)
        });

        videojs.registerComponent('chNextButton', chNextButton);
        this.player.getChild('controlBar').addChild('chNextButton', {});

        //Pantalla Completa
        let otroFull = videojs.getComponent('Button');
        let otroFullbtn = videojs.extend(otroFull, {
            constructor: function() {
                otroFull.apply(this, arguments);
                this.addClass('vjs-fullscreen-control');
            },
            handleClick: () => 
            {
                if (document.fullscreenElement || document.webkitFullscreenElement) {
                    if(document.exitFullscreen) {
                        document.exitFullscreen();
                    } 
                    else if(document.webkitExitFullscreen) {
                        document.webkitExitFullscreen();
                    }
                }
                else {
                    const mein = document.querySelector("#main");

                    if(mein.requestFullscreen) {
                        mein.requestFullscreen();
                        screen.orientation.lock("landscape-primary").then(_=>{},_=>{});
                    }
                    else if(mein.webkitRequestFullScreen) {
                        mein.webkitRequestFullScreen();
                    }
                }
            }
        });

        videojs.registerComponent('otroFullbtn', otroFullbtn);
        this.player.getChild('controlBar').addChild('otroFullbtn', {});

        //Botón EPG
        let infoEPG = videojs.getComponent('Button');
        let infoEPGbtn = videojs.extend(infoEPG, {
            constructor: function() {
                infoEPG.apply(this, arguments);
                this.addClass('barEPG');
            },
            handleClick: () => this.showEpgModal = true
        });

        videojs.registerComponent('infoEPGbtn', infoEPGbtn);
        this.player.getChild('controlBar').addChild('infoEPGbtn', {});

        this.epgBtnBugFix();
    },

    watch: {
        canales(_,previo){
            this.categorias = this.canales.map(sec => sec.nombre.toLowerCase()
                                                    .replace(/^./, str => str.toUpperCase())
                                                    .replace('Tv', 'TV')
                                                    .replace('TV abierta', 'TV Abierta')
                                            );

            this.draw_sections();

            if(!previo.length)
            {
                const firstch = this.canales[0].sections[0].canales[0];
                const favExists = this.favoritos?.filter(fav=>fav.cn_id == firstch.cn_id).length>0;

                this.hideFavBtn = favExists;
                this.hideDelFavBtn = !favExists;

                this.playChannel(firstch, false, true);

                this.persistence = setInterval(async () =>
                {                    
                    const favoData = new FormData();
                    favoData.append("user_email", localStorage.mail);
                    
                    const fetchFavos = await fetch(process.env.VUE_APP_API_URL+'api/get-favorite',{method:'POST',body:favoData,redirect:'follow'});
                    const jsonFavos = await fetchFavos.json();

                    const fetchCanal = await fetch(process.env.VUE_APP_API_URL+'api/get-web',{method:'POST',body:this.loginData});
                    const jsonCanal = await fetchCanal.json();
                    
                    if(jsonCanal.message == 'Servicio deshabilitado'){ this.$router.replace({name: "login"}); return ; }
                    
                    this.wmskey = jsonCanal?.wmstoken;
                    this.favoritos = jsonFavos.channels;
                    this.canales = jsonCanal.sections;
                    this.premiumsAllow = jsonCanal.premiumsallowed;

                    if(jsonCanal.parentlockcode != this.parentHash){
                        this.parentHash == jsonCanal.parentlockcode;
                        this.adultAllowed = false;
                    }
                }, 55555);
            }
        },

        minimized(oculto){
            if(oculto)
            {
                if(!this.playingFavs) this.num = this.currentNumCat;

                if(document.fullscreenElement || document.webkitFullscreenElement) this.player.userActive(true);

                setTimeout(_ =>{ 
                    if(this.playingFavs){
                        this.favHidden = false;
                    }
                    else{
                        this.favHidden = true;
                        this.draw_sections();
                    }
                },345);
            }
        },
            
        favMsgShow(visible){
            if(visible) setTimeout(_ => {this.favMsgShow = false; this.player.userActive(false); }, 2000);
        }
    },

    computed: {
        currentCat(){
            return this.categorias.at(this.num%this.categorias.length)
        },
        premiURL(){
            return this.premiumURL.replace('http://','').replace('https://','');
        }
    },

    data() {
        return {
            num: 0,
            playChId: 0,
            username: "",
            loginData: new FormData(),
            minimized: true,
            canales: [],
            favoritos: [],
            categorias: [],
            secciones: [],
            player: null,
            chNumtext: null,
            chImgSrc: null,
            chNowBlock: null,
            chNextBlock: null,
            prevCh: {},
            nextCh: {},
            currentCh: {},
            currentNumCat: 0,
            currentSec : null,
            favHidden: true,
            hideFavBtn: true,
            playingFavs: false,
            addFavClick: false,
            favMsgShow: false,
            hideDelFavBtn: true,
            delFavClick: false,
            showEpgModal: false,
            hideMenuBtn: false,
            adultAllowed: false,
            secImg: '',
            showBuyPack: false,
            showParentalModal: false,
            parentHash: '',
            parentalChReq: null,
            wmskey: '',
            badParental: false,
            premiumsAllow: [],
            logo: process.env.VUE_APP_LOGO,
            clientName: process.env.VUE_APP_CLIENTE,
            leyendaPremium: '',
            persistence: null,
        }
    },

    methods: {
        logout(){
            localStorage.clear();
            this.$router.replace({name: "login"});
        },

        custom_fav_btn(ch){
            const favExists = this.favoritos?.filter(fav=>fav.cn_id == ch.cn_id).length>0;

            const error = this.player.error();

            if(error) {
                console.log(error);
            }
            else{
                this.hideFavBtn = favExists;
                this.hideDelFavBtn = !favExists;
            }
        },

        epgBtnBugFix() {
            const ifoLab = document.querySelector(".barEPG");
            if (ifoLab) ifoLab.style.backgroundImage = `url(${require("../assets/info.png")})`;
        },

        arrow_left(){
            --this.num;
            this.draw_sections();
        },
        
        arrow_right(){
            ++this.num;
            this.draw_sections();
        },

        clickChannel(ch){
            this.playingFavs = false;
            this.currentNumCat = this.num;
            this.player.userActive(false);
            this.playChannel(ch, false, false);
        },
        
        clickFavourite(ch){
            this.playingFavs = true;
            this.player.userActive(false);
            this.playChannel(ch, true, false);
        },

        draw_sections(){
            const group = [];
            const current_cat_json = this.canales.filter(sec => sec.nombre.toLowerCase()==this.currentCat.toLowerCase())[0];
            
            current_cat_json.sections.forEach(sec => {
                if(!this.premiumsAllow.includes(sec.st_id) && sec.premium==1) sec.canales = sec.canales.map(ch => ({...ch, secname: sec.nombre}));
                group.push(...sec.canales);
            });

            this.secciones = current_cat_json.sections;
            this.playGroup = group;

            if(this.currentCh){
                const oldCh = this.currentCh;
                const updatedCh = group.filter(cha => cha.cn_id == oldCh.cn_id);
                if(updatedCh.length == 1) this.currentCh = updatedCh[0];
            }
        },

        parentalCheck()
        {
            const code = this.$refs.parentcode.value;
            const validch = this.parentalChReq;

            const hash = this.parentHash.replace(/^\$2y(.+)$/i, '$2a$1');

            bcrypt.compare(code, hash, (_, res) =>
            {                
                this.badParental = false;

                if(res){
                    this.adultAllowed = true;
                    this.parentalChReq = null;
                    this.showParentalModal = false;
                    this.playChannel(validch, false, false);
                }
                else{
                    this.badParental = true;
                }
            });
        },

        drawProgress(mode)
        {
            const ch = this.currentCh;
            const modArray = ['default', 'next', 'noepg'];

            const textNow  = '<h5>AHORA</h5>';
            const grayBar  = '<div class="graybar"></div>';
            const textNext = '<h5 class="text-gray">PRÓXIMO</h5>';
            
            if(mode == 'noepg'){
                this.chNowBlock.innerHTML = textNow + '<p class="pb-1">Programación de '+ch.nombre.replace(/^./, str => str.toUpperCase())+'</p><div class="whitebar"></div>';
                this.chNextBlock.innerHTML = textNext + '<p class="text-gray pb-1">Programación de '+ch.nombre.replace(/^./, str => str.toUpperCase())+'</p>' + grayBar;
            }
            else
            {
                const im = modArray.indexOf(mode);
                const ahora = Math.round(+new Date()/1000);
                const currBar = (perc) => '<div class="whitebar" style="background: linear-gradient(to right, #'+process.env.VUE_APP_ACCENT+' '+perc+'%, white 0%);"></div>';
                const hourLim = (ini,fin) => '<div class="d-flex justify--space-between pt-1"> <small>'+ini+'</small> <small>'+fin+'</small> </div>';
            
                const currentIni = ch.epg[im].fecha_ini;
                const currentEnd = ch.epg[im].fecha_fin;
                const nextEnd = ch.epg?.[im+1]?.fecha_fin;

                const horaIni = new Date(currentIni*1000).toLocaleTimeString("es").slice(0,-3);
                const horaMid = new Date(currentEnd*1000).toLocaleTimeString("es").slice(0,-3);
                const horaFin = nextEnd ? new Date(nextEnd*1000).toLocaleTimeString("es").slice(0,-3) : '';

                const perc = 100 - ((currentEnd - ahora)*100/(currentEnd - currentIni));

                this.chNowBlock.innerHTML = textNow + '<p class="pb-1">'+ch.epg[im].titulo+'</p>' + currBar(perc) + hourLim(horaIni, horaMid);
                this.chNextBlock.innerHTML = textNext + '<p class="text-gray pb-1">'+(ch.epg?.[im+1]?.titulo  ?? ('Programación de '+ch.nombre.replace(/^./, str => str.toUpperCase())))+'</p>' + grayBar +hourLim(horaMid, horaFin);
            }
        },

        playChannel(ch, favlist, showFavBtn)
        {
            this.favMsgShow = false;

            if(favlist){
                let favAdulto = false;   
                let premiumNotValid = false;
                let premiumSectionName = "";
                let premiumSectionImg = "";

                function findPremium(o, f, nombre, imagen) {
                    return Object.keys(o).some(function (a)
                    {
                        if (Array.isArray(o[a]) || typeof o[a] === 'object' && o[a] !== null) return findPremium(o[a], f, (o?.nombre ?? nombre), (o?.imagen ?? imagen));
                        if (o[a] === f) {premiumSectionName = nombre; premiumSectionImg = imagen; premiumNotValid = (o.url == "")}
                        return o[a] === f;
                    });
                }

                findPremium(this.canales, ch.cn_id);

                if(premiumNotValid){
                    this.currentSec = {};
                    this.currentSec.nombre = premiumSectionName;
                    this.currentSec.imagen = premiumSectionImg;
                    this.showBuyPack = true;
                    return ;
                }

                function findAdult(o, f, adult) {
                    return Object.keys(o).some(function (a)
                    {
                        if (Array.isArray(o[a]) || typeof o[a] === 'object' && o[a] !== null) return findAdult(o[a], f, (o?.adulto ?? adult));
                        if (o[a] === f) favAdulto = (adult == 1);
                        return o[a] === f;
                    });
                }

                if(!this.adultAllowed) findAdult(this.canales, ch.cn_id);
                this.showParentalModal = favAdulto;
            }
            else{
                if(ch?.url=='' && this.currentSec?.premium == 1){ 
                    this.currentSec.nombre = ch.secname;
                    this.showBuyPack = true;
                    return ;
                }

                if(this.currentSec?.adulto != 1) this.adultAllowed = false;
                else this.showParentalModal = !this.adultAllowed;
            }

            if(this.showParentalModal){
                this.parentalChReq = ch;
                return ;
            }           

            if(favlist && this.wmskey){
                let favwms;

                function findInObject(o, f) {
                    return Object.keys(o).some(function (a) {
                        if (Array.isArray(o[a]) || typeof o[a] === 'object' && o[a] !== null) return findInObject(o[a], f);
                        favwms = o['wms'];
                        return o[a] === f;
                    });
                }

                findInObject(this.canales, ch.cn_id);
                ch.wms = favwms;
            }

            const chList  = favlist ? this.favoritos : this.playGroup;
            const currPosCh = chList.findIndex(cha => cha.cn_id == ch.cn_id);
            const totch = chList.length;

            this.prevCh = chList[(currPosCh+totch-1)%totch];
            this.nextCh = chList[(currPosCh+1)%totch];

            if(ch?.cn_id){
                this.playChId = ch.cn_id;
                this.currentCh = ch;

                this.player.src({
                    type: 'application/x-mpegURL',
                    src: (ch?.wms==1 && ch?.cdn==1) ? ch.url+'?wmsAuthSign='+this.wmskey : ch.url
                    //src: ch.url.replace('https:', 'http:').replace(':1936', ':1935')
                });

                this.chNumtext.innerHTML = ch.numero;
                this.chImgSrc.innerHTML  = '<img src="'+ch.imagen+'" height="70">';

                this.drawProgress(ch.epg.length>0 ? "default" : "noepg");
                this.player.play();

                if(showFavBtn) setTimeout(_ => this.custom_fav_btn(ch), 60);
            }
            else{
                this.player.src({
                    type: 'application/x-mpegURL',
                    src: null
                });
            }
        },
        
        async addtoFavs()
        {
            this.favMsgShow = true;
            this.addFavClick = true;

            this.player.userActive(true);
            let keepActive = setInterval(_ => this.player.userActive(true), 2000);

            const myHeaders = new Headers();
            myHeaders.append("Content-Type", "application/json");

            const raw = JSON.stringify({
                "user_email": localStorage.mail,
                "channel_id": this.playChId
            });

            const requestOptions = {
                method: 'POST',
                headers: myHeaders,
                body: raw,
                redirect: 'follow'
            };

            const fetchAdd = await fetch(process.env.VUE_APP_API_URL+"api/set-favorite", requestOptions);
            const jsonAdd = await fetchAdd.json();

            this.player.userActive(true);
            clearInterval(keepActive);

            if(jsonAdd.error){
                this.addFavClick = false;
                this.favMsgShow = false;
                alert(jsonAdd.message);
            }
            else{
                this.favoritos.push(this.currentCh);
            }
        },

        async delFromFavs()
        {
            this.favMsgShow = true;
            this.delFavClick = true;

            this.player.userActive(true);
            let keepActive = setInterval(_ => this.player.userActive(true), 2000);

            const jsonDel = await this.fetchDelFav(this.currentCh.cn_id);

            this.player.userActive(true);
            clearInterval(keepActive);

            if(jsonDel.error){
                this.delFavClick = false;
                this.favMsgShow = false;
                alert(jsonDel.message);
            }
            else{
                this.favoritos = this.favoritos.filter(item => item.cn_id != this.currentCh.cn_id);
            }
        },

        async fetchDelFav(chid)
        {
            const myHeaders = new Headers();
            myHeaders.append("Content-Type", "application/json");

            const raw = JSON.stringify({
                "user_email": localStorage.mail,
                "channel_id": chid
            });

            const requestOptions = {
                method: 'POST',
                headers: myHeaders,
                body: raw,
                redirect: 'follow'
            };

            const fetchDel = await fetch(process.env.VUE_APP_API_URL+"api/delete-favorite", requestOptions);
            const jsonDel = await fetchDel.json();
            return jsonDel;
        },

        async trashFavo(ev, chid)
        {
            const jsonDel = await this.fetchDelFav(chid);
            
            if(jsonDel.error){
                alert(jsonAdd.message);
            }
            else{
                ev.target.closest(".channel").style.height = 0;
                ev.target.closest(".channel").style.display = 'block';
                ev.target.closest(".channel").style.pointerEvents = 'none';
                
                ev.target.closest(".channel").classList.remove('mb-1');

                setTimeout(_ => this.favoritos = this.favoritos.filter(item => item.cn_id != chid), 1678);
            }
        },

        playFromEpg(epgCh, ideCat){
            this.favHidden = true;
            this.num = this.canales.findIndex(cat => cat.st_id == ideCat);
            this.draw_sections();

            const realCh = this.playGroup.filter(cha => cha.cn_id == epgCh)[0];
            this.clickChannel(realCh);
        }
    },

    beforeUnmount() {
        if(this.player) this.player.dispose();
        if(this.persistence) clearInterval(this.persistence); 
    }
}
</script>
<style scoped>
    .text-pack * {
        text-align : left !important
    }
    .vjs-error .vjs-control-bar{
        display: flex !important;
        z-index: 8 !important;
    }
</style>
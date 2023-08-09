<template>
  <div id="contenedor">
    <video ref="liveplayer" class="video-js vjs-theme-fantasy" playsinline autoplay controls preload="auto"></video>
    <va-navbar v-show="!hideControls" color="#222327" class="px-4">
      <template #left>
        <va-navbar-item class="py-3">
          <img :src="require('@/assets/' + logo)" alt="oneplay logo" class="mt-1" height="35">
        </va-navbar-item>
        <va-navbar-item class="_selectable" ref="tv_icon">
          <a href="javascript:" class="d-block px-4 py-3 menuitem active">
            <img src="../assets/tv.png" alt="Icono de TV" class="d-block svgicon pb-1" height="24">
            <span>TV</span>
          </a>
        </va-navbar-item>
      </template>
      <template #right v-if="sidebarCanEnabled">
        <va-button class="mb-2 _selectable" id="userbg" flat color="#ffffff"
                   @click="sidebarRightActive = !sidebarRightActive"> {{
            username
          }}
        </va-button>
      </template>
      <template #right v-else>
        <va-button-dropdown class="mb-2 _selectable" id="userbg" flat :label="username" color="#ffffff">
          <div id="usermenu">
            <a href="#" @click="logout" class="px-4 py-2 _selectable">
              <va-icon class="material-icons">logout</va-icon>
              Cerrar
              Sesión</a>
          </div>
        </va-button-dropdown>
      </template>
    </va-navbar>
    <div id="main">
      <va-sidebar :minimized="minimized" textColor="dark" minimizedWidth="0">
        <div v-if="canales" style="z-index: 9999999">
          <va-sidebar-item id="favourite" @click="this.adultAllowed = false; favHidden = !favHidden"
                           :class="[!minimized ? '_selectable': '']"
                           @keydown.enter="this.adultAllowed = false; favHidden = !favHidden">
            <va-sidebar-item-content class="px-1 py-2">
              <va-icon class="material-icons mr-5"
                       :class="[favHidden ? 'hidden':'']"
              >arrow_back
              </va-icon>
              <va-sidebar-item-title class="px-2" :class="{ 'text-center': favHidden }">
                <va-icon class="material-icons">favorite</va-icon>
                <b>Favoritos</b>
              </va-sidebar-item-title>
            </va-sidebar-item-content>
          </va-sidebar-item>

          <va-sidebar-item hover-color="#222327" :class="{ hidden: !favHidden }">
            <va-sidebar-item-content class="px-1 py-2">
              <button class="icon_button" :class="[!minimized ? '_selectable': '']"  @click="arrow_left" @keydown.enter="arrow_left">
                <img :src="require('@/assets/arrow_back.png')" alt="">
              </button>
              <va-sidebar-item-title class="px-2 text-center overflow-h">
                <Trunquee :text="currentCat" v-if="currentCat"/>
              </va-sidebar-item-title>

              <button class="icon_button" :class="[!minimized ? '_selectable': '']"  @click="arrow_right" @keydown.enter="arrow_right">
                <img :src="require('@/assets/arrow_next.png')" alt="">
              </button>
            </va-sidebar-item-content>
          </va-sidebar-item>

          <div class="px-2 mt-2" :class="{ hidden: favHidden }">
            <va-sidebar-item class="channel mb-1 overflow-h" v-for="channel in favoritos" :key="channel.cn_id"
                             :class="{ watching: channel.cn_id == playChId, _selectable: !minimized && !favHidden }"
                             @click.prevent="clickFavourite(channel);"
                             @keydown.enter.prevent="clickFavourite(channel)">
              <div class="row">
                <div class="flex xs3">
                  <div class="chnum px-1 py-2 overflow-h text-center">
                    {{ channel.numero }}
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
                <div class="flex xs1 pt-1" :class="[!minimized ? '_selectable': '']"
                     @keydown.enter.stop.prevent="trashFavo($event, channel.cn_id)"
                     @click.stop.prevent="trashFavo($event, channel.cn_id)">
                  <span class="material-icons">delete_outline</span>
                </div>
              </div>
            </va-sidebar-item>
          </div>

          <div v-for="section in secciones" :key="section.st_id" class="px-2" :class="{ hidden: !favHidden }">
            <va-sidebar-item class="sectionhead py-3" hover-color="#222327">
              {{ section.nombre }}
            </va-sidebar-item>
            <va-sidebar-item class="channel mb-1 overflow-h" v-for="channel in section.canales"
                             :class="{ watching: channel.cn_id == playChId, _selectable: !minimized }"
                             :key="channel.cn_id"
                             @click.prevent="currentSec = section; clickChannel(channel);"
                             @keydown.enter.prevent="currentSec = section; clickChannel(channel)"
            >
              <div class="chnum px-1 py-2 overflow-h text-center">
                {{ channel.numero }}
              </div>
              <div class="chlogo">
                <img :src="channel.imagen" class="d-block" height="33">
              </div>
              <div class="chname px-2">
                {{ channel.nombre }}
              </div>
            </va-sidebar-item>
          </div>

        </div>
        <div v-else>
          Espere un momento
        </div>
      </va-sidebar>

      <template v-if="sidebarCanEnabled">
        <sidebar @close="sidebarRightActive = !minimized; $refs.tv_icon.$el.focus();" :show="sidebarRightActive" :fono="fono_soporte" :correo="correo_soporte" :planes="planes"
                 :planactual="planactual"></sidebar>
      </template>

      <va-button outline id="delerfav" class="favbtn" :rounded="false" text-color="#ffffff"
                 style="border-color: #ffffff;"
                 :class="[hideDelFavBtn ? 'fade' : '_selectable', delFavClick ? 'done' : '']" @click="delFromFavs">
        <span class="material-icons">close</span> Eliminar de Favoritos
      </va-button>

      <va-button outline id="addtofav" class="favbtn" :rounded="false" text-color="#ffffff"
                 style="border-color: #ffffff;"
                 :class="[hideFavBtn ? 'fade' : '_selectable', addFavClick ? 'done' : '']" @click="addtoFavs">
        <va-icon class="material-icons">favorite_border</va-icon>
        Añadir a Favoritos
      </va-button>

      <article class="controlPanel" v-show="!hideControls">
        <div class="list-control">
          <div class="control-number">{{ currentCh.numero }}</div>
          <div class="control-image">
            <img :src="currentCh.imagen" alt="" height="100">
          </div>
          <div class="control-epg">
            <div ref="control_epg_now" class="control-epg--now">
            </div>
            <div ref="control_epg_after" class="control-epg--after">
            </div>
          </div>
          <div class="control-channel __prev _selectable" @keydown.enter="controlHandler('prev')">
            <img style="width: 35px" :src="require('@/assets/arrow_back.png')" alt="">
          </div>
          <div class="control-channel __next _selectable" @keydown.enter="controlHandler('next')">
            <img style="width: 35px" :src="require('@/assets/arrow_next.png')" alt="">
          </div>
          <div class="control-channel __next _selectable" @keydown.enter="controlHandler('fullscreen')">
            <va-icon :size="50" class="material-icons">fullscreen</va-icon>
          </div>
          <div class="control-channel __next _selectable" ref="info_btn" @keydown.enter="controlHandler('info')">
            <va-icon :size="44" class="material-icons">info</va-icon>
          </div>
        </div>
      </article>

      <div v-show="favMsgShow">
        {{ addFavClick ? 'Se agregó a favoritos' : 'El favorito fue eliminado' }}
      </div>

      <custom-modal v-if="showEpgModal" @close="showEpgModal = false; $refs.info_btn.focus()">
        <template v-slot:body>
          <Epg :currChId="currentCh?.cn_id ?? 1958" @clickEpg="playFromEpg" ref="epgModal"/>
        </template>
      </custom-modal>

      <va-modal v-model="showParentalModal" size="small" hide-default-actions :mobile-fullscreen="false">
        <slot>
          <div id="parentform">
            <h3>Control Parental</h3>
            <br>
            <p>Para acceder a ver estos canales</p>
            <p>debes ingresar tu código parental</p>
            <form method="POST" action="#" @submit.prevent="parentalCheck" autocomplete="off">
              <div class="py-3">
                <input type="text" name="parentcode" ref="parentcode" placeholder="Ej: XXXXXXXX" required
                       class="_selectable">
                <p v-show="badParental" class="pl-1 pt-2">¡El código ingresado no es correcto!</p>
              </div>
              <div>
                <va-button type="submit" size="medium" class="py-2 _selectable">Ver canales</va-button>
              </div>
            </form>
          </div>
        </slot>
      </va-modal>

      <va-modal v-model="showBuyPack" size="small" hide-default-actions :mobile-fullscreen="false">
        <slot>
          <div id="buypack" v-if="currentSec">
            <h3>Pack {{ currentSec.nombre }}</h3>
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

      <div  v-show="!hideControls" id="chmenubtn" @click="minimizedToggle" @keyup.enter="minimizedToggle"
           :class="[minimized ? '' : 'opened', hideMenuBtn ? 'hidden' : '', '_selectable']">
        <img src="../assets/chbtn.png" :class="[minimized ? 'd-block' : 'hidden']">
        <img src="../assets/chbtn2.png" :class="[minimized ? 'hidden' : 'd-block']">
      </div>
    </div>
  </div>
</template>

<script>
import "video.js/dist/video-js.min.css";
import "@videojs/themes/dist/fantasy/index.css";
import '../assets/css/player.css';

import Trunquee from '../components/Trunquee.vue';
import Sidebar from '../components/sidebar.vue';
import Epg from '../components/Epg.vue';
import loginService from '../services/login.service';

import CryptoJS from 'crypto-js';
import videojs from 'video.js';
import bcrypt from 'bcryptjs';
import {useRoute} from "vue-router";
import CustomModal from "@/components/CustomModal.vue";

export default {
  components: {
    CustomModal,
    Trunquee, Epg, Sidebar
  },

  async created() {
    let pass = false;
    try {
      pass = CryptoJS.AES.decrypt(localStorage.jwt2, localStorage.mac + "lasindy24").toString(CryptoJS.enc.Utf8)
    } catch (e) {
    }

    if (!pass) {
      localStorage.clear();
      this.$router.replace({name: "login"});
    }

    this.username = localStorage.user;
    this.loginData.append("pass", pass);
    this.loginData.append("user", localStorage.mail);
    this.loginData.append("devid", localStorage.mac);
    this.loginData.append("token", localStorage.token); //en la versión antigua de get-web este parametro es undefined

    const favoData = new FormData();
    favoData.append("user_email", localStorage.mail);

    const fetchFavos = await fetch(process.env.VUE_APP_API_URL + 'api/get-favorite', {
      method: 'POST',
      body: favoData,
      redirect: 'follow'
    })

    const fetchCanal = await fetch(process.env.VUE_APP_API_URL + 'api/get-web2', {
      method: 'POST',
      body: this.loginData
    })

    const jsonFavos = await fetchFavos.json();
    const jsonCanal = await fetchCanal.json();

    if(jsonFavos.error || jsonCanal.error) {
      const {isLogged} = loginService();
      isLogged.value = false;
      localStorage.clear();
      this.$router.replace({name: 'login'})
      return
    }

    this.favoritos = jsonFavos.channels;
    this.canales = jsonCanal.sections;
    this.parentHash = jsonCanal.parentlockcode;
    this.premiumsAllow = jsonCanal.premiumsallowed;
    this.leyendaPremium = jsonCanal?.leyendapremium ?? 'Contrata nuestros paquetes de canales premium y disfruta del mejor contenido.';

    this.fono_soporte = jsonCanal.fono_soporte;
    this.correo_soporte = jsonCanal.email_soporte;

    this.planactual = jsonCanal.plan;
    this.planes = jsonCanal.planes.map(item => {
      const [nombre, precio] = item.nombre.split(' - ');
      item.nombre = nombre;
      item.precio = precio;
      return item;
    });
  },

  mounted() {
    this.player = videojs(this.$refs.liveplayer,
        {
          inactivityTimeout: 5000,
          html5: {
            nativeTextTracks: false,
            vhs: {
              withCredentials: false
            }
          },
          languages: {
            en: {
              "The media playback was aborted due to a corruption problem or because the media used features your browser did not support.": "La señal en estos momentos no está disponible, por favor, inténtelo nuevamente.",
              "The media could not be loaded, either because the server or network failed or because the format is not supported.": "La señal en estos momentos no está disponible, por favor, inténtelo nuevamente.",
              "No compatible source was found for this media.": "La señal en estos momentos no está disponible, por favor, inténtelo nuevamente."
            }
          },
          language: 'en',
          textTrackSettings: false,
          controlBar: false
        });

    this.player.on("error", () => {
      this.hideFavBtn = true;
      this.hideDelFavBtn = true;
    });

    this.loadSelectables()

    window.addEventListener('keydown', this.keydownHandler, true)

    setTimeout(() => {
      if(!this.firstInteract){
        this.userInactive()
      }
    }, 10000)
  },

  updated() {
    this.loadSelectables()
  },

  watch: {
    canales(_, previo) {
      this.categorias = this.canales.map(sec => sec.nombre.toLowerCase()
          .replace(/^./, str => str.toUpperCase())
          .replace('Tv', 'TV')
          .replace('TV abierta', 'TV Abierta')
      );

      this.draw_sections();

      if (!previo.length) {
        const firstch = this.canales[0].sections[0].canales[0];
        const favExists = this.favoritos?.filter(fav => fav.cn_id == firstch.cn_id).length > 0;

        this.hideFavBtn = favExists;
        this.hideDelFavBtn = !favExists;

        this.playChannel(firstch, false, true);

        this.persistence = setInterval(async () => {
          const favoData = new FormData();
          favoData.append("user_email", localStorage.mail);

          const fetchFavos = await fetch(process.env.VUE_APP_API_URL + 'api/get-favorite', {
            method: 'POST',
            body: favoData,
            redirect: 'follow'
          });
          const jsonFavos = await fetchFavos.json();

          const fetchCanal = await fetch(process.env.VUE_APP_API_URL + 'api/get-web2', {
            method: 'POST',
            body: this.loginData
          });
          const jsonCanal = await fetchCanal.json();

          if (jsonCanal.message == 'Servicio deshabilitado') {
            this.$router.replace({name: "login"});
            return;
          }

          this.favoritos = jsonFavos.channels;
          this.canales = jsonCanal.sections;
          this.premiumsAllow = jsonCanal.premiumsallowed;

          this.fono_soporte = jsonCanal.fono_soporte;
          this.correo_soporte = jsonCanal.email_soporte;

          this.planactual = jsonCanal.plan;
          this.planes = jsonCanal.planes.map(item => {
            const [nombre, precio] = item.nombre.split(' - ');
            item.nombre = nombre;
            item.precio = precio;
            return item;
          });

          if (jsonCanal.parentlockcode != this.parentHash) {
            this.parentHash == jsonCanal.parentlockcode;
            this.adultAllowed = false;
          }
        }, 55555);
      }
    },

    minimized(oculto) {
      if (oculto) {
        if (!this.playingFavs) this.num = this.currentNumCat;

        if (document.fullscreenElement || document.webkitFullscreenElement) this.player.userActive(true);

        setTimeout(_ => {
          if (this.playingFavs) {
            this.favHidden = false;
          } else {
            this.favHidden = true;
            this.draw_sections();
          }
        }, 345);
      }
    },

    favMsgShow(visible) {
      if (visible) setTimeout(_ => {
        this.favMsgShow = false;
        this.player.userActive(false);
      }, 5000);
    }
  },

  computed: {
    currentCat() {
      return this.categorias.at(this.num % this.categorias.length)
    },
    premiURL() {
      return this.premiumURL.replace('http://', '').replace('https://', '');
    }
  },

  data() {
    return {
      firstInteract: false,
      hideControls: false,
      time_out: null,
      progress: null,
      fono_soporte: '+56 9 123456789',
      correo_soporte: 'support@company.net',
      planactual: 'Básico',
      planes: [],
      sidebarCanEnabled: process.env.VUE_APP_SIDEBAR_ENABLED === "enable",
      sidebarRightActive: false,
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
      currentSec: null,
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
      badParental: false,
      premiumsAllow: [],
      logo: process.env.VUE_APP_LOGO,
      clientName: process.env.VUE_APP_CLIENTE,
      leyendaPremium: '',
      persistence: null,
    }
  },

  methods: {

    keydownHandler(e) {

      if(e.target.id === "closer_btn"){
        window.removeEventListener('keydown', this.keydownHandler, true)
        return
      }

      this.firstInteract = true;

      if(this.showEpgModal && e.key !== "Enter") {
        e.preventDefault()
        e.stopPropagation()

        switch (e.key){
          case "ArrowDown" :  this.$refs.epgModal.scrollHandler("vertical",   30  ); break;
          case "ArrowUp" :    this.$refs.epgModal.scrollHandler("vertical",   -30 ); break;
          case "ArrowLeft" :  this.$refs.epgModal.scrollHandler("horizontal", -30 ); break;
          case "ArrowRight" : this.$refs.epgModal.scrollHandler("horizontal", 30  ); break;
        }
        return
      }

      this.userActive()
      this.time_out = setTimeout(this.userInactive, 10000)
    },

    userActive() {
      clearTimeout(this.time_out)
      this.hideControls = false
      this.hideMenuBtn = false;
      this.custom_fav_btn(this.currentCh);

      const ch = this.currentCh;
      const ahora = Math.round(+new Date() / 1000);

      if (ch && ch.epg && ch.epg.length === 0) {
        this.drawProgress("noepg");
      } else {
        const currentEnd = ch.epg ? ch.epg[0].fecha_fin : -1;

        if (ahora > currentEnd) {
          this.drawProgress(ch.epg && ch.epg.length > 1 ? "next" : "noepg");
        } else {
          this.drawProgress("default");
        }
      }
    },

    userInactive(){
      this.hideControls = true
      this.hideFavBtn = true;
      this.hideDelFavBtn = true;
      this.minimized = true
      this.sidebarRightActive = false
      this.hideMenuBtn = this.minimized && (document.fullscreenElement || document.webkitFullscreenElement);

      if (this.addFavClick) setTimeout(_ => this.addFavClick = false, 10000);
      if (this.delFavClick) setTimeout(_ => this.delFavClick = false, 10000);

      this.$refs.tv_icon?.$el?.focus()
    },

    controlHandler(type) {
      switch (type) {
        case "prev":
          setTimeout(_ => this.playChannel(this.prevCh, this.playingFavs, true), this.minimized ? 1 : 999)
          break;
        case "next":
          setTimeout(_ => this.playChannel(this.nextCh, this.playingFavs, true), this.minimized ? 1 : 999)
          break;
        case "fullscreen":
          this.hideControls = true
          this.hideFavBtn = true;
          this.hideDelFavBtn = true;
          this.minimized = true
          this.hideMenuBtn = this.minimized && (document.fullscreenElement || document.webkitFullscreenElement);

          if (this.addFavClick) setTimeout(_ => this.addFavClick = false, 10000);
          if (this.delFavClick) setTimeout(_ => this.delFavClick = false, 10000);
          break;
        case "info":
          this.showEpgModal = true;
          break;
      }
    },

    minimizedToggle() {
      this.minimized = !this.minimized
      console.log("ok")
    },

    logout() {
      const {isLogged} = loginService();
      isLogged.value = false;

      localStorage.clear();

      this.$router.replace({name: "login"});
    },

    custom_fav_btn(ch) {
      const favExists = this.favoritos?.filter(fav => fav.cn_id == ch.cn_id).length > 0;

      const error = this.player.error();

      if (!error) {
        this.hideFavBtn = favExists;
        this.hideDelFavBtn = !favExists;
      }
    },

    epgBtnBugFix() {
      const ifoLab = document.querySelector(".barEPG");
      if (ifoLab) ifoLab.style.backgroundImage = `url(${require("../assets/info.png")})`;
    },

    arrow_left() {
      --this.num;
      this.draw_sections();
    },

    arrow_right() {
      ++this.num;
      this.draw_sections();
    },

    clickChannel(ch) {
      this.playingFavs = false;
      this.currentNumCat = this.num;
      this.player.userActive(false);
      this.playChannel(ch, false, false);
    },

    clickFavourite(ch) {
      this.playingFavs = true;
      this.player.userActive(false);
      this.playChannel(ch, true, false);
    },

    draw_sections() {
      const group = [];
      const current_cat_json = this.canales.filter(sec => sec.nombre.toLowerCase() == this.currentCat.toLowerCase())[0];

      current_cat_json.sections.forEach(sec => {
        if (!this.premiumsAllow.includes(sec.st_id) && sec.premium == 1) sec.canales = sec.canales.map(ch => ({
          ...ch,
          secname: sec.nombre
        }));
        group.push(...sec.canales);
      });

      this.secciones = current_cat_json.sections;
      this.playGroup = group;

      if (this.currentCh) {
        const oldCh = this.currentCh;
        const updatedCh = group.filter(cha => cha.cn_id == oldCh.cn_id);
        if (updatedCh.length == 1) this.currentCh = updatedCh[0];
      }
    },

    parentalCheck() {
      const code = this.$refs.parentcode.value;
      const validch = this.parentalChReq;

      const hash = this.parentHash.replace(/^\$2y(.+)$/i, '$2a$1');

      bcrypt.compare(code, hash, (_, res) => {
        this.badParental = false;

        if (res) {
          this.adultAllowed = true;
          this.parentalChReq = null;
          this.showParentalModal = false;
          this.playChannel(validch, false, false);
        } else {
          this.badParental = true;
        }
      });
    },

    drawProgress(mode) {
      const ch = this.currentCh;
      const modArray = ['default', 'next', 'noepg'];

      const textNow = '<h5>AHORA</h5>';
      const grayBar = '<div class="graybar"></div>';
      const textNext = '<h5 class="text-gray">PRÓXIMO</h5>';

      if (mode === 'noepg') {
        this.$refs.control_epg_now.innerHTML = textNow + '<p class="pb-1">Programación de ' + ch.nombre.replace(/^./, str => str.toUpperCase()) + '</p><div class="whitebar"></div>';
        this.$refs.control_epg_after.innerHTML = textNext + '<p class="text-gray pb-1">Programación de ' + ch.nombre.replace(/^./, str => str.toUpperCase()) + '</p>' + grayBar;
      } else {
        const im = modArray.indexOf(mode);
        const ahora = Math.round(+new Date() / 1000);
        const currBar = (perc) => '<div class="whitebar" style="background: linear-gradient(to right, #' + process.env.VUE_APP_ACCENT + ' ' + perc + '%, white 0%);"></div>';
        const hourLim = (ini, fin) => '<div class="d-flex justify--space-between pt-1"> <small>' + ini + '</small> <small>' + fin + '</small> </div>';

        const currentIni = ch.epg[im].fecha_ini;
        const currentEnd = ch.epg[im].fecha_fin;
        const nextEnd = ch.epg?.[im + 1]?.fecha_fin;

        const horaIni = new Date(currentIni * 1000).toLocaleTimeString("es").slice(0, -3);
        const horaMid = new Date(currentEnd * 1000).toLocaleTimeString("es").slice(0, -3);
        const horaFin = nextEnd ? new Date(nextEnd * 1000).toLocaleTimeString("es").slice(0, -3) : '';

        const perc = 100 - ((currentEnd - ahora) * 100 / (currentEnd - currentIni));

        this.$refs.control_epg_now.innerHTML = textNow + '<p class="pb-1">' + ch.epg[im].titulo + '</p>' + currBar(perc) + hourLim(horaIni, horaMid);
        this.$refs.control_epg_after.innerHTML = textNext + '<p class="text-gray pb-1">' + (ch.epg?.[im + 1]?.titulo ?? ('Programación de ' + ch.nombre.replace(/^./, str => str.toUpperCase()))) + '</p>' + grayBar + hourLim(horaMid, horaFin);
      }
    },

    playChannel(ch, favlist, showFavBtn) {
      this.favMsgShow = false;

      if (favlist) {
        let favAdulto = false;
        let premiumNotValid = false;
        let premiumSectionName = "";
        let premiumSectionImg = "";

        function findPremium(o, f, nombre, imagen) {
          return Object.keys(o).some(function (a) {
            if (Array.isArray(o[a]) || typeof o[a] === 'object' && o[a] !== null) return findPremium(o[a], f, (o?.nombre ?? nombre), (o?.imagen ?? imagen));
            if (o[a] === f) {
              premiumSectionName = nombre;
              premiumSectionImg = imagen;
              premiumNotValid = (o.url == "")
            }
            return o[a] === f;
          });
        }

        findPremium(this.canales, ch.cn_id);

        if (premiumNotValid) {
          this.currentSec = {};
          this.currentSec.nombre = premiumSectionName;
          this.currentSec.imagen = premiumSectionImg;
          this.showBuyPack = true;
          return;
        }

        function findAdult(o, f, adult) {
          return Object.keys(o).some(function (a) {
            if (Array.isArray(o[a]) || typeof o[a] === 'object' && o[a] !== null) return findAdult(o[a], f, (o?.adulto ?? adult));
            if (o[a] === f) favAdulto = (adult == 1);
            return o[a] === f;
          });
        }

        if (!this.adultAllowed) findAdult(this.canales, ch.cn_id);
        this.showParentalModal = favAdulto;
      } else {
        if (ch?.url == '' && this.currentSec?.premium == 1) {
          this.currentSec.nombre = ch.secname;
          this.showBuyPack = true;
          return;
        }

        if (this.currentSec?.adulto != 1) this.adultAllowed = false;
        else this.showParentalModal = !this.adultAllowed;
      }

      if (this.showParentalModal) {
        this.parentalChReq = ch;
        return;
      }

      const chList = favlist ? this.favoritos : this.playGroup;
      const currPosCh = chList.findIndex(cha => cha.cn_id == ch.cn_id);
      const totch = chList.length;

      this.prevCh = chList[(currPosCh + totch - 1) % totch];
      this.nextCh = chList[(currPosCh + 1) % totch];

      if (ch?.cn_id) {
        this.currentCh = ch;
        this.playChId = ch.cn_id;

        const churl = Boolean(parseInt(localStorage.ssl)) ? ch.url : ch.url.replace('https:', 'http:').replace(':1936', ':1935');

        this.player.src({
          type: 'application/x-mpegURL',
          src: churl
        });

        // this.chNumtext.innerHTML = ch.numero;
        // this.chImgSrc.innerHTML = '<img src="' + ch.imagen + '" height="70">';

        this.drawProgress(ch.epg && ch.epg.length > 0 ? "default" : "noepg");
        this.player.play();

        if (showFavBtn) setTimeout(_ => this.custom_fav_btn(ch), 5000);
      } else {
        this.player.src({
          type: 'application/x-mpegURL',
          src: null
        });
      }
    },

    async addtoFavs() {
      this.favMsgShow = true;
      this.addFavClick = true;

      this.player.userActive(true);

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

      const fetchAdd = await fetch(process.env.VUE_APP_API_URL + "api/set-favorite", requestOptions);
      const jsonAdd = await fetchAdd.json();

      if (jsonAdd.error) {
        this.addFavClick = false;
        this.favMsgShow = false;
        alert(jsonAdd.message);
      } else {
        this.favoritos.push(this.currentCh);
      }

      setTimeout(_ => this.player.userActive(false), 5000);
    },

    async delFromFavs() {
      this.favMsgShow = true;
      this.delFavClick = true;

      this.player.userActive(true);

      const jsonDel = await this.fetchDelFav(this.currentCh.cn_id);

      if (jsonDel.error) {
        this.delFavClick = false;
        this.favMsgShow = false;
        alert(jsonDel.message);
      } else {
        this.favoritos = this.favoritos.filter(item => item.cn_id != this.currentCh.cn_id);
      }

      setTimeout(_ => this.player.userActive(false), 5000);
    },

    async fetchDelFav(chid) {
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

      const fetchDel = await fetch(process.env.VUE_APP_API_URL + "api/delete-favorite", requestOptions);
      const jsonDel = await fetchDel.json();
      return jsonDel;
    },

    async trashFavo(ev, chid) {
      const jsonDel = await this.fetchDelFav(chid);

      if (jsonDel.error) {
        alert(jsonAdd.message);
      } else {
        ev.target.closest(".channel").style.height = 0;
        ev.target.closest(".channel").style.display = 'block';
        ev.target.closest(".channel").style.pointerEvents = 'none';

        ev.target.closest(".channel").classList.remove('mb-1');

        setTimeout(_ => this.favoritos = this.favoritos.filter(item => item.cn_id != chid), 1678);
      }
    },

    loadSelectables() {
      SpatialNavigation.init();
      SpatialNavigation.add({
        selector: "._selectable",
      });
      SpatialNavigation.makeFocusable();
    },

    playFromEpg(epgCh, ideCat) {
      this.favHidden = true;
      this.num = this.canales.findIndex(cat => cat.st_id == ideCat);
      this.draw_sections();

      const realCh = this.playGroup.filter(cha => cha.cn_id == epgCh)[0];
      this.clickChannel(realCh);
    }
  },

  beforeUnmount() {
    if (this.player) this.player.dispose();
    if (this.persistence) clearInterval(this.persistence);
  }
}
</script>
<style scoped>
.text-pack * {
  text-align: left !important
}

.vjs-error .vjs-control-bar {
  display: flex !important;
  z-index: 8 !important;
}

#contenedor {
  width: 100vw;
  height: 100vh;
  position: relative;
}
</style>
<template>
    <div class="epgcontent">
        <div class="channels" v-if="channels">
            <div class="channels_title">
                <span>Canales</span>
                <!-- <button @click="goTonow">Ir a Ahora</button> -->
            </div>
            <div
                ref="refChannelList"
                class="channels_list"
                @scroll="syncScrollChannelList"
            >
                <div
                    class="channels_item"
                    v-for="channel in channels"
                    :key="channel.cn_id"
                    @mouseover="infoCh = channel"
                    @click="$emit('clickEpg', channel.cn_id, channel.category_id)"
                >
                    <div class="channels_item_number">
                        {{ String(channel.numero).padStart(2, "0") }}
                    </div>
                    <div class="channels_item_logo">
                        <img :src="channel.imagen" />
                    </div>
                    <div class="channels_item_name">
                        {{ channel.nombre }}
                    </div>
                </div>
            </div>
        </div>
        <div class="timeline">
            <div
                class="timeline_header"
                ref="refTimelineHeader"
                @scroll="syncScrollHeader"
            >
                <span v-for="n in times" :key="n">
                    {{ n }}
                </span>
            </div>
            <div
                class="timeline_body"
                v-if="channels"
                ref="refTimeLine"
                @scroll="syncScrollY"
            >
                <div
                    class="timeline_item"
                    v-for="channel in channels"
                    :key="`timeline-${channel.cn_id}`"
                    :style="{ width: times.length * 150 + 'px' }"
                >
                    <div
                        class="timeline_program"
                        v-for="(program, index) in filterPrograms(channel.epg)"
                        :key="index"
                        :style="{
                            width: getProgramWidth(program),
                            marginLeft: index === 0 ? getOffSet(program) : '0px',
                        }"
                    >
                        <span class="timeline_program__time">
                            {{ getInitDate(program.fecha_ini) }} -
                            {{ getInitDate(program.fecha_fin) }} <br />
                            <small>{{ program.titulo }}</small>
                        </span>
                    </div>
                </div>
                <div
                    class="timeline_marker"
                    ref="refMarker"
                    :style="`height: ${channels.length * 73}px`"
                ></div>
            </div>
        </div>
    </div>
    <div id="chdesc" v-if="infoCh">
        <h2>{{infoCh.nombre}}</h2>
        <br>
        <p>{{infoCh.descripcion}}</p>
    </div>
</template>

<script>
import '../assets/css/epg.scss';

import moment from "moment";
import {onDeactivated, onMounted, ref} from "vue";

export default {
    props: {
        'currChId': {
            type: Number,
            required: true
        }
    },
    emits: ["clickEpg"],
    expose: [
      'scrollHandler'
    ],
    setup(props) {
        const channels = ref(null);
        const times = [
            "00:00",
            "00:30",
            "01:00",
            "01:30",
            "02:00",
            "02:30",
            "03:00",
            "03:30",
            "04:00",
            "04:30",
            "05:00",
            "05:30",
            "06:00",
            "06:30",
            "07:00",
            "07:30",
            "08:00",
            "08:30",
            "09:00",
            "09:30",
            "10:00",
            "10:30",
            "11:00",
            "11:30",
            "12:00",
            "12:30",
            "13:00",
            "13:30",
            "14:00",
            "14:30",
            "15:00",
            "15:30",
            "16:00",
            "16:30",
            "17:00",
            "17:30",
            "18:00",
            "18:30",
            "19:00",
            "19:30",
            "20:00",
            "20:30",
            "21:00",
            "21:30",
            "22:00",
            "22:30",
            "23:00",
            "23:30",
        ];
        const refTimeLine = ref(null);
        const refChannelList = ref(null);
        const refTimelineHeader = ref(null);
        const refMarker = ref(null);
        const infoCh = ref(null);
        const chIdx = ref(null);

        let interval = null;

        const getProgramWidth = (program) => {
            const init = moment.unix(program.fecha_ini);
            const end = moment.unix(program.fecha_fin);
            const actualDay = moment().day();

            if (end.day() !== actualDay) {
                end.set({
                    day: actualDay,
                    hour: 23,
                    minute: 59,
                });
            }

            const diff = end.diff(init, "minutes");

            return `${diff * 5}px`;
        };

        const getOffSet = (program) => {
            const init = moment.unix(program.fecha_ini);

            const offsetDate = moment().set({
                day: moment().day(),
                hour: 0,
                minute: 0,
            });

            let diff = init.diff(offsetDate, "minutes");

            if (diff > 0) diff++;

            return `${(diff * 300) / 60}px`;
        };

        const loadChannels = async () =>
        {
            const epgBody = new FormData();
            epgBody.append("user", localStorage.mail);

            const fetchEPG = await fetch(process.env.VUE_APP_API_URL+'api/get-epgguide',{method:'POST',body:epgBody,redirect:'follow'});
            const jsonEPG = await fetchEPG.json();
            const chanide = jsonEPG.findIndex((item) => item.cn_id == props.currChId);
            
            chIdx.value = chanide;
            channels.value = jsonEPG;
            infoCh.value = jsonEPG[chanide];
        };

        const filterPrograms = (programs) => {
            const filterPrograms = [];

            programs.forEach((p) => {
                const actualDay = moment().day();
                const programDay = moment.unix(p.fecha_ini).day();

                const programWithDateDuplicated = filterPrograms.find((_p) =>
                    moment.unix(_p.fecha_ini).isSame(moment.unix(p.fecha_ini))
                );

                if (actualDay === programDay && !programWithDateDuplicated) {
                    filterPrograms.push(p);
                }
            });

            return filterPrograms;
        };

        const syncScrollY = () => {
          refChannelList.value.scrollTop = refTimeLine.value.scrollTop
          refTimelineHeader.value.scrollLeft = refTimeLine.value.scrollLeft
        };

        const syncScrollHeader = () => {
          refTimeLine.value.scrollLeft = refTimelineHeader.value.scrollLeft
        };

        const syncScrollChannelList = () => {
          refTimeLine.value.scrollTop = refChannelList.value.scrollTop
        };

        const getInitDate = (date) => moment.unix(date).format("HH:mm");

        const checkMarker = () => {
            if (!refMarker.value) return;

            const hour = moment().hour();
            const minutes = moment().minute();

            refMarker.value.style.left = hour * 300 + minutes * 5 + "px";
        };

        const sleep = (time) => {
            return new Promise((resolve) => setTimeout(resolve, time));
        };

        const goTonow = () => {
            const hour = moment().hour();
            const minutes = moment().minute();

            refTimelineHeader.value.scroll({
                left: hour * 300 + minutes * 5 - 100,
            });

            refTimeLine.value.scroll({
                left: hour * 300 + minutes * 5 - 100,
            });
        };

        onMounted(async () => {
            let isLoaded = false;

            while (!isLoaded) {
                if (refTimelineHeader.value && refTimeLine.value) {
                    isLoaded = true;
                    if(chIdx.value>0) refTimeLine.value.scrollTop = 73*chIdx.value - 2;
                }
                await sleep(50);
            }

            goTonow()
        });

        loadChannels();
        checkMarker();

        interval = setInterval(() => {
            checkMarker();
        }, 1000);

        onDeactivated(() => {
            clearInterval(interval);
        });

        const scrollHandler = (type, value) =>{
          if(type === "horizontal"){
            refTimeLine.value.scrollLeft =  refTimelineHeader.value.scrollLeft + value;
            return
          }

          refChannelList.value.scrollTop = refChannelList.value.scrollTop + value
        }

        return {
            channels,
            times,

            refTimeLine,
            refChannelList,
            refTimelineHeader,
            refMarker,

            getInitDate,
            syncScrollY,
            syncScrollHeader,
            syncScrollChannelList,
            getProgramWidth,
            filterPrograms,
            getOffSet,
            goTonow,
            infoCh,
            scrollHandler
        };
    },
};
</script>
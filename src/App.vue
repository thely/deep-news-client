<template>
  <div id="app" @click="clickCounter" v-if="hasName">
    <AudioManager :start="enableAudioManager" />
    <ChatBox :controls="controls" />
    <TVGroup v-if="vidFilesExist" :controls="controls" />
    <StockChart v-if="hasStocks" />
    <StockPopup />
    <NewsTicker />
    <Tutorial @endTutorial="enableAudioManager = true" />
    <StockEventJumper />
    <!-- <v-idle @idle="onIdle" /> -->
  </div>
</template>

<script>
/* eslint-disable vue/no-unused-components */
import ChatBox from './components/ChatBox.vue';
import StockChart from './components/StockChart.vue';
import NewsTicker from './components/NewsTicker.vue';
import StockPopup from './components/StockPopup.vue';
import AudioManager from './components/AudioManager.vue';
import TVGroup from './components/TVGroup.vue';
import Tutorial from './components/Tutorial.vue';
import StockEventJumper from './components/StockEventJumper.vue';

// https://en.wikipedia.org/wiki/Special:RandomInCategory/Category:Member_states_of_the_United_Nations

export default {
  name: 'App',
  components: {
    ChatBox,
    // Xebra,
    StockChart,
    StockPopup,
    NewsTicker,
    AudioManager,
    TVGroup,
    Tutorial,
    StockEventJumper
},
  data() {
    return {
      vidFilesExist: false,
      clickCount: 0,
      enableAudioManager: false,
    }
  },
  computed: {
    loaders() {
      const players = JSON.parse(JSON.stringify(this.$store.state.videos.loaders));
      return players;
    },
    controls() {
      const controls = {
        speed: parseFloat(this.$store.state.speed),
        netWorth: this.$store.getters["market/getUserNetWorth"],
        otherNetWorth: this.$store.getters["market/getOtherNetWorth"],
        currentStockShares: this.$store.getters["market/getCurrentStockCount"],
        currentStockClose: this.$store.getters["market/getCurrentStockClosePrice"],
        messageLength: this.$store.getters["chat/getLastMessageLength"],
        clickCount: this.clickCount
      }

      return controls;
    },
    audioStarted() {
      return this.$store.state.audioStarted;
    },
    hasName() {
      const n = this.$store.getters["chat/getOwnUsername"];
      return n ? true : false; 
    },
    hasStocks() {
      const stocks = this.$store.state.market.stockWords;
      return stocks.length > 0 ? true : false;
    }
  },
  mounted() {
    this.$store.dispatch("videos/getAllFiles").then(() => {
      this.vidFilesExist = true;
    });

    if (!("seentut" in localStorage)) {
      localStorage.seentut = false;
    }
  },
  // updated() {
  //   console.log("main recomputes");
  // },
  sockets: {
    connect() {
      console.log("connected");
    },
  },
  methods: {
    clickCounter() {
      this.clickCount++;
    },
    onIdle() {
      this.$store.commit("chat/removeBans");
    },
    // mediaload(e) {
    //   const vid = e.target;
    //   console.log(vid);
    //   console.log("loaded video");
    //   const h = new Hydra({
    //     makeGlobal: false,
    //     detectAudio: false,
    //     numSources: 1,
    //     numOutputs: 1,
    //     width: 800,
    //     height: 400
    //   }).synth;

    //   // use video within hydra
    //   h.s0.init({src: vid})
    //   h.src(h.s0)
    //     .rotate(0, 0.2)
    //     .repeat(5, 3, 0.5)
    //     .saturate(3.0)
    //   //  .color(1.0, 0.7, -1)
    //     .scrollX(0, -0.1)
    //     .diff(h.osc(2, 0.3, 2))
    //   //  .kaleid(3)
    //     .diff(h.src(h.s0).saturate().hue(0.2))
    //     .out()
    // }

    // vid.src = "/video/vid1.mp4";
    // vid.load();
    // console.log(vid);
  }
}
</script>

<style>
:root {
  --mono-font: monospace;
  --chat-font: "Helvetica Neue", sans-serif;
}
* {
  box-sizing: border-box;
  /* font-family: monospace; */
}

body {
  margin: 0;
}

#app {
  background: #0b105e;
  position: absolute;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  max-width: 100vw;
  overflow: hidden;
}
</style>

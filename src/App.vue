<template>
  <div id="app" @click="clickCounter" v-if="hasName">
    <AudioManager :start="enableAudioManager" :clicks="clickCount"/>
    <ChatBox :controls="controls" />
    <TVGroup v-if="vidFilesExist" :controls="controls" />
    <StockChart v-if="hasStocks" />
    <StockPopup />
    <NewsTicker />
    <StockEventJumper />

    <div class="top-controls">
      <LangSwitcher />
      <IntroTour @startAudio="enableAudioManager = true" :idling="idling"/>
    </div>
    <v-idle @idle="onIdle" @wake="onWake"/>
  </div>
</template>

<script>
import ChatBox from './components/ChatBox.vue';
import StockChart from './components/StockChart.vue';
import NewsTicker from './components/NewsTicker.vue';
import StockPopup from './components/StockPopup.vue';
import AudioManager from './components/AudioManager.vue';
import TVGroup from './components/TVGroup.vue';
import StockEventJumper from './components/StockEventJumper.vue';
import IntroTour from './components/IntroTour.vue';
import LangSwitcher from './components/LangSwitcher.vue';

export default {
  name: 'App',
  components: {
    ChatBox,
    StockChart,
    StockPopup,
    NewsTicker,
    AudioManager,
    TVGroup,
    IntroTour,
    StockEventJumper,
    LangSwitcher
},
  data() {
    return {
      vidFilesExist: false,
      clickCount: 0,
      enableAudioManager: false,
      idling: false,
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
      console.log("you've idled!");
      this.idling = true;

      this.$store.dispatch("resetUser");
    },
    onWake() {
      if (!this.idling) {
        return;
      }
      this.idling = false;
      console.log("wake up!!");
      this.$store.dispatch("resetUser", false);
    }
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

.top-controls {
  position: absolute;
  top: 0;
  right: 0;

  display: flex;
}
</style>

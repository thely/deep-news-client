<template>
  <div class="tv-display">
    <div :class="'patch-parent patch-' + size">
      <canvas :id="`hydra-${size}`" class="patch"></canvas>
      <ChannelMarker :channel="channelText" />
    </div>

    <TVVideoLoader :index="index" :automute="false" :hide="hiderawvid" @videoloaded="initPatch" @videoended="switchPatch"></TVVideoLoader>
  </div>
</template>

<script>
import TVVideoLoader from "../tv/TVVideoLoader.vue";
import ChannelMarker from "../ChannelMarker.vue";
import HydraHandle from "../../utils/HydraPatch.js";
let hydra;

export default {
  components: { TVVideoLoader, ChannelMarker },
  props: {
    index: {
      type: Number,
      default: 0,
    },
    channelText: {
      type: String,
      default: "CH 5"
    },
    size: {
      type: String,
      default: "large"
    },
    hiderawvid: Boolean,
    controls: Object,
    // files: Array,
  },
  computed: {
    currentStock() {
      return this.$store.state.market.selectedStock;
    },
    recentReact() {
      return this.$store.state.chat.recentReact;
    }
  },
  watch: {
    controls(newV) {
      hydra.runAll(newV);
    },
    currentStock() {
      hydra.switchOne();
      hydra.runAll(this.controls);
    },
    recentReact(newV, oldV) {
      if (newV && !oldV) {
        hydra.revealOne();
        hydra.runAll(this.controls);

        this.$store.commit("chat/resetRecentReact", false);
      }
    }
  },
  mounted() {
    hydra = new HydraHandle();
  },
  methods: {
    initPatch(player) {
      // pause the change very slightly for chrome
      setTimeout(() => {
        // console.log("starting patch");
        hydra.videoNotify(player, this.index);
        hydra.runOne(this.index);
      }, 100);
      
    },
    switchPatch(player) {
      // console.log("switching player");
      // setTimeout(() => {
        hydra.videoNotify(player, this.index);
      // }, 100);
      
    }
    // switchHydraVideo(player) {
    //   // const player = this.getPlayer(newV.loader, newV.player);
    //   hydra.videoNotify(player, this.index);
    // }
  }
}
</script>

<style>

.patch-large {
  top: 1em;
  right: 1em;
}

.patch-small {
  bottom: 5rem;
  right: 1.5em;
  z-index: 100;
}

.patch-parent {
  background: black;
  position: absolute;
  border: 3px solid white;
  padding: 1em;
}

</style>
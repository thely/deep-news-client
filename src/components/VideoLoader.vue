<template>
  <div class="video-container" :class="hide ? 'hidden' : ''">
      <div :class="`loader-parent loader-${index}`" :key="index" v-for="(loader, index) in loaders">
        <video 
          v-for="(player, pindex) in loader.players"
          :key="pindex"
          :data-index="index"
          :data-pindex="pindex"
          :class="`loader-single video-${index}-${pindex}`"
          playsinline 
          :src="getFilename(index, pindex)"
          @playing="videoStarted" 
          @ended="videoEnded"
          crossorigin="anonymous"
          :muted="automute"
        >
        </video>
      </div>
  </div>
</template>

<script>
export default {
  props: {
    hide: {
      type: Boolean,
      default: true,
    },
    automute: {
      type: Boolean,
      default: true,
    }
  },
  computed: {
    loaders() {
      return this.$store.state.videos.loaders;
    },
  },
  mounted() {
    const firstPlayers = this.$el.querySelectorAll(".video-0-0, .video-1-0");
    
    firstPlayers.forEach((player) => {
      player.addEventListener("loadeddata", (e) => {
        console.log("data loaded for " + player.dataset.index);
        e.target.play();
        this.$store.commit("videos/updateHasLoadedOnce", player.dataset.index);
      }, { "once": true });
    });
  },
  updated() {
    console.log("loaders recompute");
  },
  methods: {
    getFilename(index, pindex) {
      const filename = this.$store.getters['videos/getFilename'](index, pindex);
      // console.log(filename + " for " + index + " " + pindex);
      return filename;
    },
    videoStarted(e) {
      // Video started: tell everyone who's happening
      var currLoader = parseInt(e.target.dataset.index);
      var currPlayer = parseInt(e.target.dataset.pindex);
      this.$store.commit("videos/updateActivePlayer", {
        loader: currLoader,
        player: currPlayer
      });
      
      // Preload setup
      var nextPlayer = Math.abs(currPlayer - 1);
      this.$store.commit("videos/toRandomFile", {
        loader: currLoader,
        player: nextPlayer
      });

      // Prevent preloaded video from playing
      const sibling = currPlayer == 0 ? e.target.nextSibling : e.target.previousSibling;
      sibling.pause();
    },
    videoEnded(e) {
      if (e.target.nextSibling != null) {
        e.target.nextSibling.play();
      } else {
        e.target.previousSibling.play();
      }
    },
  }
}
</script>

<style lang="scss">
  .video-container {
    &.hidden {
      visibility: hidden;
      position: absolute;
      top: 0;
      z-index: -1000;
    }

    video {
      width: 200px;
    }
  }
</style>
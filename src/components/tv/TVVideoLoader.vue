<template>
  <div :class="['loader-parent', `loader-${index}`, hide ? 'hidden' : '']">
    <video 
      v-for="(file, pindex) in isLoaded"
      :key="pindex"
      :data-loader="index"
      :data-player="pindex"
      :class="`loader-single video-${index*2 + pindex}`"
      playsinline 
      :src="$store.getters['videos/getFname'](index*2 + pindex)"
      @playing="videoStarted" 
      @ended="videoEnded"
      @loadeddata="videoLoading"
      crossorigin="anonymous"
      :muted="muteState"
      :data-active="$store.state.videos.nowPlaying"
      controls
    >
    </video>
  </div>
</template>

<script>
export default {
  props: {
    index: Number,
    hide: {
      type: Boolean,
      default: true,
    },
    automute: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
      isLoaded: [false, false],
      activePlayer: 0,
    }
  },
  computed: {
    audioStarted() {
      return this.$store.state.audioStarted;
    },
    muteState() {
      // return false;
      if (this.automute) {
        return true;
      } else {
        return !this.audioStarted;
      }
    }
  },
  methods: {
    getFilename(index, pindex) {
      const filename = this.$store.getters['videos/getFname'](index*2 + pindex);
      console.log(filename + " for " + index + " " + pindex);
      return filename;
    },
    videoStarted(e) {
      // Video started: tell everyone who's happening
      var currPlayer = parseInt(e.target.dataset.player);

      if (this.activePlayer == currPlayer) {
        console.log("are you seeking inside the video rn?");
        return;
      }
      var currLoader = parseInt(e.target.dataset.loader);
      this.$store.commit("videos/updateActivePlayer", {
        loader: currLoader,
        player: currPlayer
      });
      
      // Preload setup
      var nextPlayer = Math.abs(currPlayer - 1);
      this.$store.commit("videos/toRandomF", currLoader*2 + nextPlayer);
      // this.isLoaded[nextPlayer] = false;

      // Prevent preloaded video from playing
      const sibling = currPlayer == 0 ? e.target.nextSibling : e.target.previousSibling;
      sibling.pause();
      sibling.load();

      this.activePlayer = nextPlayer;
    },

    videoEnded(e) {
      console.log("video ended");
      console.log(e);

      const sibling = e.target.dataset.player == 0 ? e.target.nextSibling : e.target.previousSibling;
      sibling.play();
      this.$emit("videoended", sibling);
    },

    videoLoading(e) {
      console.log("data loaded for " + e.target.dataset.player);
      const playIndex = e.target.dataset.player;
      if (playIndex == 0 && !this.isLoaded[playIndex]) {
        // e.target.volume = 0;
        e.target.play();
        this.$emit('videoloaded', e.target);
      }

      this.isLoaded[playIndex] = true;
    }
  }
}
</script>

<style lang="scss">
  .loader-parent {
    &.hidden {
      visibility: hidden;
      position: absolute;
      top: 0;
      z-index: -1000;
    }

    video {
      width: 400px;
    }
  }
</style>
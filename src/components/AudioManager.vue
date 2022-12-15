<template>
  <div class="audiohandler" :data-last="messageBump">
    <!-- <button class="audiostart" @click="startAudio" :data-last="messageBump">
      <slot></slot>
    </button> -->
  </div>
</template>

<script>
import * as Tone from "tone";
import VideoSpeakerManager from "../utils/VideoSpeaker.js";
import BGMusic from "../utils/BGMusic.js";
import ClickCounter from "../utils/ClickCounter.js";
let speakers = {}, bgm = {}, clicker = {};

export default {
  props: {
    start: Boolean,
    clicks: Number,
  },
  data() {
    return {
      doneLoading: false,
      videoPlaying: -1,
    }
  },
  computed: {
    audioStarted() {
      return this.$store.state.audioStarted;
    },
    activeSpeakers() {
      return this.$store.state.videos.nowPlaying;
    },
    messageCount() {
      return this.$store.state.chat.messageCount;
    },
    messageBump() {
      const id = this.$store.getters['chat/getLastMessageID'];
      console.log("inside messagebump");
      console.log(id);
      return id;
    }
  },
  watch: {
    start(newV) {
      if (newV) {
        this.startAudio();
      }
    },
    messageBump(newV) {
      console.log("we're getting bumped at " + newV);
      if (!this.audioStarted) return;
      if (Math.random() > 0.6) {
        console.log("SHIFTING!!!!!!!");
        // this.sendToMax("delayShift", newV);
        this.randomShift();
      }

      const senderIsOther = this.$store.getters['chat/getLastMessageSender'];
      console.log(senderIsOther);
      if (senderIsOther && newV % 3 != 1) {
        console.log("from other!");
        const time = Math.random() * 100 + 50;
        // let x = this;
        setTimeout(() => {
          speakers.hearPerson();
          // x.sendToMax("voices", newV);
        }, time);
      }
    },
    clicks(newV) {
      if ("clickTotal" in clicker) {
        clicker.changeTotal(newV);
      }
    }
  },
  methods: {
    async startAudio() {
      // start audio
      await Tone.start();
      Tone.Transport.start();
      this.$store.commit("setAudioStarted", true);
      bgm = new BGMusic(Tone, this.doneLoadingCallback);

      speakers = new VideoSpeakerManager(Tone, this.activeSpeakers);
      speakers.output.connect(bgm.pitchShift);

      clicker = new ClickCounter(Tone);
      clicker.clickometer();

      this.$emit("audioStarted");
    },
    doneLoadingCallback() {
      this.doneLoading = true;
      bgm.startBackground();
    },
    randomShift() {
      bgm.randomShift();
      speakers.hearPerson();
    },
    hearPerson() {
      speakers.hearPerson();
    },
  }
}
</script>

<style>

</style>
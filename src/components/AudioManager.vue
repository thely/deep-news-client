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
// import notes from "../data/notes.json";
// import chords from "../data/chords.json";
// let notePlayer, noteMap, chordPlayer, chordMap, chordIndex, pitchShift, feedbackDelay;
let speakers = {}, bgm = {};

export default {
  props: {
    start: Boolean,
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
    // randomShift() {
    //   // const target = (Math.random() * 14 + 6) * (Math.random() > 0.5 ? -1 : 1);
    //   const target = (Math.random() * 10 + 4) * -1;
    //   console.log("target is " + target);
    //   // pitchShift.pitch = val;
    //   let gate = false;
    //   // let interval = setInterval(() => pitchInterval(interval, val, gate), 100);
    //   // speakers.hearPerson();

    //   let interval = setInterval(() => {
    //     if (target < 0) {
    //       console.log("target is negative");
    //       console.log("going up " + pitchShift.pitch);
    //       if (pitchShift.pitch <= target || gate) {
    //         gate = true;
    //         pitchShift.pitch -= target / 20.0;

    //         if (pitchShift.pitch >= 0) {
    //           pitchShift.pitch = 0;
    //           clearInterval(interval);
    //         }
    //       } else {
    //         console.log("going down " + pitchShift.pitch);
    //         pitchShift.pitch += target / 20.0;
    //       }  
    //     } 
  
    //     // target is positive: go up, then down
    //     else {
    //       console.log("target is positive");
    //       if (pitchShift.pitch >= target || gate) {
    //         console.log("going down " + pitchShift.pitch);
    //         gate = true;
    //         pitchShift.pitch -= target / 20.0;

    //         if (pitchShift.pitch <= 0) {
    //           pitchShift.pitch = 0;
    //           clearInterval(interval);
    //         }
    //       } else {
    //         console.log("going up " + pitchShift.pitch);
    //         pitchShift.pitch += target / 20.0;
    //       }
    //     }
    //   }, 20);

    //   console.log("feedbackdelay?");
    //   feedbackDelay.feedback.rampTo(1, 1);
    //   // feedbackDelay.delayTime.rampTo(0.1, 0.3);
    //   feedbackDelay.feedback.rampTo(0.7, 1.5, "+2");
    //   // feedbackDelay.delayTime.rampTo(0.15, 0.5, "+0.5");

    //   // setInterval(() => console.log(quarterNote.toSeconds(), 1000);
    //   // pitchShift.pitch = val;
    // },
    // startBackground() {
    //   this.playChord();
    //   this.playNote();
    // },
    // // somewhere between four and eleven seconds
    // playNote() {
    //   this.playRandomSound(notePlayer, noteMap);

    //   notePlayer.onstop = () => {
    //     console.log("next note!");
    //     const delay = Math.random() * 12.0 + 4.5;
    //     this.playRandomSound(notePlayer, noteMap, delay);
    //   }
    // },
    // playChord() {
    //   chordIndex = 0;
    //   let key = Object.keys(chordMap)[chordIndex];
    //   // console.log(key, chordMap[key]);
    //   this.playSound(chordPlayer, chordMap[key]);

    //   const parent = this;

    //   chordPlayer.onstop = () => {
    //     chordIndex = (chordIndex + 1) % Object.keys(chordMap).length;
    //     const key = Object.keys(chordMap)[chordIndex];
    //     parent.playSound(chordPlayer, chordMap[key]);
    //   }
    // },
    // playSound(player, sound, delay = 0) {
    //   player.start(Tone.now() + delay, sound.start, sound.end - sound.start);
    // },
    // playRandomSound(player, map, delay = 0) {
    //   const index = Math.floor(Math.random() * Object.keys(map).length);
    //   const soundName = Object.keys(map)[index];
    //   const sound = map[soundName];
    //   this.playSound(player, sound, delay);
    // }
  }
}

// function pitchInterval(interval, target, gate) {
//   // target is negative: go down, then up
  
// }

// function playRandom() {
//   console.log("random!!");
//   const rand = 1;
//   players.player(rand).start();
// }
</script>

<style>

</style>
// import { random } from "core-js/core/number";
import Vue from "vue";
import Vuex from "vuex";
import videos from "./videos.js";
import chat from "./chat.js";
import market from "./market.js";

Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    videos,
    chat,
    market
  },
  state: () => ({ 
    audioStarted: false,
    freqVal: 20,
    modVal: 20,
    speed: 2000,
    // mouseDown: false,
  }),
  mutations: {
    setAudioStarted(state, val) {
      if (val) {
        state.audioStarted = true;
      } else {
        console.log("what happened? audio not started lol");
      }
    },
    setSpeed(state, val) {
      state.speed = val;
    },
    updateFreq(state, val) {
      state.freqVal = val;
      // console.log(state.freqVal);
    },
    updateMod(state, val) {
      state.modVal = val;
      // console.log(state.freqVal);
    }
    // triggerMouse(state, val) {
    //   val = val == null ? !state.mouseDown : val;
    //   state.mouseDown = val;
    //   // console.log(state.mouseDown);
    // }
  },
  actions: {
    resetUser({state}, isIdle=true) {
      console.log("inside resetuser!");
      const obj = {
        userid: state.chat.userID,
        socket: state.chat.selfID,
        state: isIdle
      };

      Vue.prototype.$socket.client.emit("idleUser", obj);
    },
    socket_resetAll({commit}) {
      console.log("we're being told to kill everything. start fresh!!");
      commit("chat/resetChat");
      commit("market/resetMarket");
    }
  }
});
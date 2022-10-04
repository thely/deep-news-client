import Vue from "vue";
// import config from "../config.json";

const videos = {
  namespaced: true,
  state: () => ({
    // urlBase: "./assets",
    // urlBase: config.url + "/assets",
    urlBase: "./video",
    loads: [0, 1, 2, 3],
    loaders: [
      { players: [0, 0], nowPlaying: -1 },
      { players: [2, 2], nowPlaying: -1 }
    ],
    loadedOnce: [false, false],
    nowPlaying: [0, 0],
    files: []
  }),

  // Mutations
  mutations: {
    // Generic player-updater, not used
    updatePlayer(state, obj) {
      state.players[obj.i][obj.field] = obj.value;
    },

    updateActivePlayer(state, obj) {
      // state.nowPlaying[obj.index] = obj.player;
      // console.log(obj);
      Vue.set(state.nowPlaying, obj.loader, obj.loader * 2 + obj.player);
      console.log(state.nowPlaying);
    },

    updateHasLoadedOnce(state, index) {
      state.loadedOnce[index] = true;

      Vue.set(state.loadedOnce, index, true);
    },

    // Set upcoming player to next video, following the playingIndex value
    toNextFile(state, obj) {
      // go one up from your sibling player's file
      const sibling = Math.abs(obj.player - 1);
      const loader = state.loaders[obj.loader];
      const fileIndex = (loader.players[sibling] + 1) % state.files.length;

      Vue.set(state.loaders[obj.loader].players, obj.player, fileIndex);
    },

    // Set to random file not currently in either player, ignore playingIndex
    toRandomFile(state, obj) {
      // condense down to just the files in use
      let originals = state.loaders.map((loader, index) => {
        return loader.players.map((player, pindex) => {
          if (index != obj.loader || pindex != obj.player) {
            return player;
          } else {
            return;
          }
        }).filter(Boolean);
      });

      originals = originals.flat();

      // pick a random new index
      let fileIndex = Math.floor(Math.random() * state.files.length);
      while (originals.includes(fileIndex)) {
        fileIndex = Math.floor(Math.random() * state.files.length);
      }

      Vue.set(state.loaders[obj.loader].players, obj.player, fileIndex);
    },

    toRandomF(state, index) {
      let fileIndex = Math.floor(Math.random() * state.files.length);
      while (state.loads.includes(fileIndex)) {
        fileIndex = Math.floor(Math.random() * state.files.length);
      }

      state.loads[index] = fileIndex;

      Vue.set(state.loads, index, fileIndex);
    },

    loadFileList(state, files) {
      state.files = files;
    }
  },

  getters: {
    getFilename: (state) => (index, pindex) => {
      const url = state.urlBase + "/" + state.files[state.loaders[index].players[pindex]];
      return url;
    },
    getFname: (state) => (index) => {
      const url = state.urlBase + "/" + state.files[state.loads[index]];
      // console.log(url + " for " + index);
      return url;
    },
    getClasses: (state) => {
      const classes = state.players.map(({ className }) => { return className; });
      return classes;
    }
  },
  actions: {
    async getAllFiles ({ commit, dispatch }) {
      commit("loadFileList", vidList);
      // const urlReq = "http://localhost:8081/videos";
      // const urlReq = config.url + "/videos";
      // return fetch(urlReq).then(response => response.json()).then(data => {
      //   const list = data.videos;
      //   console.log(list);
      //   commit("loadFileList", list);

        dispatch("allRandom");
      // });
    },
    allRandom({ state, commit }) {
      console.log("running allrandom");
      for (let i = 0; i < state.loads.length; i++){ 
        commit("toRandomF", i);
      }
    }
  }
}

const vidList = [
  "vid1.mp4",
  "vid2.mp4",
  "vid3.1.mp4",
  "vid3.2.mp4",
  "vid3.3.mp4",
  "vid6.0.mp4",
  "vid6.1.mp4",
  "vid6.2.mp4",
  // "vid6.3.mp4",
  "vid6.4.mp4",
  "vid6.5.mp4",
  "vid7.1.mp4",
  "vid7.2.mp4",
  // "vid8.1.mp4",
  "vid8.2.mp4",
];

export default videos;
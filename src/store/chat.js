import Vue from "vue";
import emojis from "@/data/emoji-list.json";

const chat = {
  namespaced: true,
  state: () => ({ 
    users: {},
    selfID: "", // socket port
    userID: -1, // actual number
    messages: [],
    bannedWords: [],
    messageCount: 0,
    recentReact: false,
    messageLimit: parseInt(process.env.VUE_APP_MSG_LIMIT),
  }),
  mutations: {
    resetChat(state) {
      state.messages = [];
      state.bannedWords = [];
      state.messageCount = 0;
      state.recentReact = false;
    },
    SOCKET_ADDUSER(state, obj) {
      console.log("get user");
      // let name = "";
      console.log(obj);

      if (obj.isSelf) {
        userInit(state, obj);
      }
      // state.selfID = obj.id;
      Vue.set(state.users, obj.id, { name: obj.username, userid: obj.userid });
      localStorage.userid = obj.userid;
    },

    SOCKET_DELETEUSER(state, obj) {
      try {
        delete state.users[obj.id];
      } catch (e) {
        console.log("no such user was found");
        console.log(e);
      }
    },
    
    SOCKET_NAMECHANGE(state, obj) {
      console.log("attempting name change");
        const u = state.users[obj.id];
        u.name = obj.name;
        Vue.set(state.users, obj.id, u);
    },

    SOCKET_MESSAGE(state, msg) {
      const user = state.users[msg.user];
      
      const choices = buildChoices();
      // msg.choices = choices.main;
      // msg.up = choices.up;
      // msg.down = choices.down;

      state.messages.push({
        msgID: msg.msgID,
        userid: user.userid,
        id: msg.user,
        username: user.name,
        
        text: msg.text,
        original: msg.text,

        time: msg.time,
        reactions: [],
        choices: choices.main,
        up: choices.up,
        down: choices.down
      });

      state.messageCount++;

      if (state.messages.length > state.messageLimit) {
        state.messages.shift();
        this.dispatch("market/analyseForStockRemoval", state.messages.map((e) => e.text), { root: true });
      }
    },

    SOCKET_UPDATEMESSAGE(state, msg) {
      let mIndex = state.messages.findIndex(m => m.msgID == msg.msgID);
      Vue.set(state.messages, mIndex, msg);
    },

    SOCKET_MESSAGELIST(state, msgs) {
      console.log("get message list");
      console.log(msgs);
      for (let msg of msgs) {
        if (!("reactions" in msg)) {
          msg.reactions = [];
        }

        const choices = buildChoices(msg.reactions, state.userID);
        msg.choices = choices.main;
        msg.up = choices.up;
        msg.down = choices.down;
        
        msg.msgID = msg.messageid;
      }
      state.messages = msgs;
    },

    sendMessage(state, text) {
      Vue.prototype.$socket.client.emit("message", { 
        msg: text, 
        id: state.selfID, 
        userid: state.users[state.selfID].userid,
        username: state.users[state.selfID].name
      });
    },

    updateOwnName(state, name) {
      Vue.prototype.$socket.client.emit("nameChange", { userid: state.users[state.selfID].userid, name: name });
      Vue.set(state.users[state.selfID], "name", name);
    },

    // OLD -- ignore most of the time
    updateMessage(state, obj) {
      // console.log("receiving the updatemessage thingy?");
      Vue.set(state.messages, obj.index, obj.message);
    },

    // eslint-disable-next-line no-unused-vars
    updateMsgReaction(state, {msgID, react, user, enabled}) {
      let m = state.messages.find((m) => m.msgID == msgID);
      let mIndex = state.messages.findIndex((m) => m.msgID == msgID);
      let oldIndex = m.reactions.findIndex((r) => r.emoji == react.emoji && react.by == user);

      state.recentReact = enabled ? true : false;

      // if this is the first reaction on the list
      if (oldIndex == -1 && enabled) {
        console.log("new around here");
        react.by = user;
        m.reactions.push(react);

      } else {
        console.log("old around here");
        m.reactions.splice(oldIndex, 1);
      }

      Vue.set(state.messages, mIndex, m);
      Vue.prototype.$socket.client.emit("updateMessage", m);

      Vue.prototype.$socket.client.emit("updateMarket", {
        data: react,
        state: enabled,
        message: m.text,
        user: user,
        msgID: msgID,
      });
    },
    resetRecentReact(state, v) {
      state.recentReact = v;
    },
    SOCKET_BANWORDS(state, words) {
      words.forEach((word) => {
        if (!state.bannedWords.includes(word)) {
          state.bannedWords.push(word);
        }
      });
    },
    banWords(state, words) {
      words.forEach((word) => {
        if (!state.bannedWords.includes(word)) {
          state.bannedWords.push(word);
        }
      })
    },
    removeBans(state) {
      state.bannedWords = [];
    },
    updateChoice(state, obj) {
      // console.log(obj);
      const m = state.messages.find((m => m.msgID == obj.msgID));
      // console.log(state.messages[0]);
      const mIndex = state.messages.findIndex((m => m.msgID == obj.msgID));

      if (obj.type == "up" || obj.type == "down") {
        m[obj.type] = obj.react;
        // console.log(m[obj.type]);
      } else {
        let index = m.choices.findIndex((e) => e.emoji == obj.react.emoji);
        m.choices[index] = obj.react;
        // console.log(m.choices[index]);
      }

      // console.log("updated choice: ");
      
      Vue.set(state.messages, mIndex, m);
    }
    // addChoices(state, obj) {
    //   // console.log("adding chocies");
    //   const m = state.messages.find((m) => m.msgID == obj.msgID);
    //   m.choices = obj.choices;
    //   Vue.set(state.messages, obj.msgID, m);
    // }
  },
  getters: {
    getOwnUsername: (state) => {
      console.log("calling getownusername");
      try {
        console.log(state.users[state.selfID]);
        return state.users[state.selfID].name;
      } catch(e) { // needed pre-render
        return "...";
      }
    },
    getMessageByID: (state) => (msgID) => {
      const msg = state.messages.filter(m => m.msgID == msgID);
      if (msg.length > 0) {
        return msg[0];
      } else {
        console.log("no message found like this one");
      }
    },
    getLastMessageLength: (state) => {
      if (state.messages.length <= 0) return 0;
      
      return state.messages[state.messages.length - 1].text.length;
    },
    getLastMessageSender: (state) => {
      if (state.messages.length <= 0) return -1;
      
      const id = state.messages[state.messages.length - 1].id;
      if (id != state.selfID) {
        return true;
      }

      return false;
    },
    getLastMessageID: (state) => {
      try {
        const id = state.messages[state.messages.length - 1].msgID;
        return id;
      } catch(e) {
        return -1;
      }
    },
    getLastMessage: (state) => (index) => {
      if (index && state.messages.length - index > 0) {
        return state.messages[state.messages.length - (index+1)].text;
      }

      return false;
    },
    getSelfUserID: (state) => {
      return state.users[state.selfID].userid;
    }
  },
  // actions: {
  //   censorship: ({ state, commit }) => {
  //     for (let i = 0; i < state.messages.length; i++) {
  //       let m = state.messages[i].text;
  //       m = alterToRule(m, state.rules);

  //       if (m != state.messages[i].text) {
  //         state.messages[i].text = m;

  //         commit("updateMessage", {
  //           index: i,
  //           message: state.messages[i],
  //         });
  //       }
  //     }
  //   }
  // }
};

function userInit(state, obj) {
  // let name;
  state.selfID = obj.id;
  state.userID = obj.userid;
  // name = randomName();

  for (let u of obj.others) {
    if (u.id != obj.id) {
      Vue.set(state.users, u.id, { name: u.data.username });      
    }
  }
}

function buildChoices(reacts = [], user = -1) {
  let tester = [];
  const allCats = Object.keys(emojis);
  // console.log(JSON.stringify(reacts));
  // console.log(user);

  for (let i = 0; i < 4; i++) {
    const c = allCats[Math.floor(Math.random() * allCats.length)];
    const index = Math.floor(Math.random() * emojis[c].length);
    const emoji = emojis[c][index];

    const r = reacts.filter((e) => e.userid == user && e.emoji == emoji);
    tester.push({
      emoji: emoji.emoji,
      category: c,
      index: index,
      clicked: r.length > 0 ? true : false,
      by: r.length > 0 ? user : -1,
    });
  }

  let r = reacts.filter((e) => e.userid == user && e.emoji == "👍");
  const choiceUp = {
    emoji: "👍",
    category: "smileys",
    clicked: r.length > 0 ? true : false,
    by: r.length > 0 ? user : -1,
  };

  r = reacts.filter((e) => e.userid == user && e.emoji == "👎");
  const choiceDown = {
    emoji: "👎",
    category: "smileys",
    clicked: r.length > 0 ? true : false,
    by: r.length > 0 ? user : -1,
  };

  return {
    main: tester,
    up: choiceUp,
    down: choiceDown
  };
}


export default chat;
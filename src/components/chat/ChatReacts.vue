<template>
  <div class="chat-reacts" v-click-outside="hideDisplay">
    <div v-if="showArray" class="react-array">
      <ul>
        <li class="emoji-single" v-for="(em, index) in choices" :key="index">
          <span 
              @click="emojiClick($event, index)" 
              :class="em.clicked ? 'clicked' : ''">
                {{ em.emoji }}
          </span>
        </li>
      </ul>
    </div>
    <div class="react-toggle hand" :class="up ? 'enabled' : ''" @click="reactUp"><span>👍</span></div>
    <div class="react-toggle hand hand-down" :class="down ? 'enabled' : ''" @click="reactDown"><span>👎</span></div>
    <div class="react-toggle" @click="showArray = !showArray" :class="showArray ? 'react-toggle-active' : ''">
      <span>▾</span>
    </div>
  </div>
</template>

<script>
// import emojis from "@/data/emoji-list.json";

export default {
  props: {
    messageID: Number,
    user: Number,
    reacts: Array,
    choices: Array,
    upState: Object,
    downState: Object,
    // choicesX: Array,
  },
  data() {
    return {
      showArray: false,
      // choices: [],
      // up: false,
      // down: false,
    }
  },
  computed: {
    up() {
      return this.upState.clicked;
    },
    down() {
      return this.downState.clicked;
    },
  },
  mounted() {
    // console.log("-----for message #" + this.messageID + "-------");
    // console.log(JSON.stringify(this.reacts));
    // console.log(JSON.stringify(this.choices));
    // console.log(JSON.stringify(this.upState));
    // console.log(JSON.stringify(this.downState));
  },
  methods: {
    emojiClick(_e, index) {
      this.choices[index].clicked = !this.choices[index].clicked;

      this.toVuex(this.choices[index], this.choices[index].clicked, "main");
      // console.log("done sending to store");
    },
    reactUp() {
      const newUp = !this.up;
      const upBlock = {
        emoji: "👍",
        category: "smileys",
        clicked: newUp,
        by: this.user,
      };

      this.toVuex(upBlock, newUp, "up");

      if (this.down && newUp) {
        this.reactDown();
      }
    },
    reactDown() {
      const newDown = !this.down;
      const downBlock = {
        emoji: "👎",
        category: "smileys",
        clicked: newDown,
        by: this.user,
      };

      this.toVuex(downBlock, newDown, "down");

      if (newDown && this.up) {
        this.reactUp();
      }
    },
    toVuex(react, enabled, type) {
      this.$store.commit("chat/updateMsgReaction", {
        msgID: this.messageID,
        user: this.user,
        react: react,
        enabled: enabled,
      });

      this.$store.commit("chat/updateChoice", {
        msgID: this.messageID,
        type: type,
        react: react,
      })
    },
    hideDisplay() {
      this.showArray = false;
    },
    selfHasClicked(em) {
      console.log(this.messageID, this.user);
      const r = this.reacts.filter((e) => e.by == this.user && e.emoji == em.emoji);
      return r.length > 0 ? true : false;
    }
  }
}
</script>

<style lang="scss">
.chat-reacts {
  position: relative;

  display: flex;
  align-items: center;

  .react-toggle {
    position: relative;
    border: 1px solid #5baad938;
    color: #f824bb;
    margin-right: 0.1em;
    text-align: center;
    border-radius: 50%;
    width: 1.2em;
    height: 1.2em;

    display: flex;
    justify-content: center;
    align-items: center;

    cursor: pointer;

    &:hover {
      background-color: rgb(185, 225, 243);
      color: blue;
    }

    .toggle-up {
      margin-top: -0.25em;
    }

    &.hand span {
      filter: sepia(1) saturate(90) hue-rotate(300deg);
      font-size: 0.9em;
    }

    &.hand.hand-down span {
      margin-top: 3px;
    }

    &.enabled {
      background-color: rgb(89, 202, 255);
    }

    &.react-toggle-active {
      border-top-left-radius: 0;
      border-top-right-radius: 0;
      border: 0px solid transparent;
      background: white;
      color: black;
    }
  }

  .react-array {
    position: absolute;
    top: -1em;
    right: 0;
    width: 5em;
    z-index: 100;

    font-size: 1.35em;

    border: 1px solid white;
    border-radius: 10px;
    background-color: white;
    padding: 2px 1px 0;

    ul {
      display: flex;
      justify-content: space-around;
    }

    li {
      cursor: pointer;
      display: inline;
      padding-bottom: 0;

      .clicked {
        background-color: yellow;
      }

      &:hover {
        background-color: yellow;
      }
    }
  }
}

.is-self .chat-reacts {
  display: flex;
  justify-content: right;

  .react-array {
    left: 0;
    right: auto;
  }
}
</style>
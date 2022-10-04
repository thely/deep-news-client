<template>
  <div v-if="reactions.length > 0" class="msg-reactions-parent">
    <div class="msg-reactions" v-if="upOnly.length > 0">
      <span>👍</span>
      <span class="react-length">{{ upOnly.length }}</span>
    </div>
    <div class="msg-reactions" v-if="downOnly.length > 0">
      <span>👎</span>
      <span class="react-length">{{ downOnly.length }}</span>
    </div>
    <div class="msg-reactions" :title="otherAsString" v-if="otherEmojis.length > 0">
      <span v-if="otherEmojis.length > truncatedEmojis.length">...</span>
      <span class="single-emoji" v-for="(react, rindex) in truncatedEmojis" :key="rindex">{{ react.emoji }}</span>
      <span>{{ otherEmojis.length }}</span>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    reactions: Array,
  },
  computed: {
    upOnly() {
      return this.reactions.filter(e => e.emoji == "👍");
    },
    downOnly() {
      return this.reactions.filter(e => e.emoji == "👎");
    },
    otherEmojis() {
      return this.reactions.filter(e => e.emoji != "👎" && e.emoji != "👍");
    },
    otherAsString() {
      const filt = this.otherEmojis.map(e => e.emoji);
      return filt.join('');
    },
    truncatedEmojis() {
      const trunc = this.otherEmojis.slice(-5);
      return trunc;
    },
  },
}
</script>

<style lang="scss">
.msg-reactions-parent {
  position: absolute;
  top: -1em;
  right: 0;

  display: flex;
}
.msg-reactions {
  font-size: 0.9em;
  letter-spacing: -1px;
  background: white;
  padding: 0.1em 0.2em;
  // border: 1px solid grey;
  border-radius: 5px;
  box-shadow: 1px 1px 1px rgba(0,0,0,0.25);
  margin-left: 0.3em;

  .single-emoji {
    margin-right: 0.1em;
  }

  .react-length {
    font-size: 0.9em;
    padding-left: 5px;
  }
}
</style>
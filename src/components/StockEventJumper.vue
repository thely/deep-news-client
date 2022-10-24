<template>
  <div class="stock-jumper">
    <p class="jump jump-remove" :class="{'active': removeState}">
      <span><strong>{{ recentRemove }}</strong> was delisted!</span>
    </p>
    <p class="jump jump-add" :class="{'active': addState}">
      <span><strong>{{ recentAdd }}</strong> was added!</span>
    </p>
  </div>
</template>

<script>
export default {
  data() {
    return {
      addState: "",
      removeState: "",
    }
  },
  computed: {
    banned() {
      return this.$store.state.chat.bannedWords;
    },
    stocks() {
      return this.$store.state.market.stockWords;
    },
    recentAdd() {
      return this.$store.state.market.recentAdd;
    },
    recentRemove() {
      return this.$store.state.market.recentRemove;
    }
  },
  watch: {
    recentAdd() {
      this.addState = true;
      var ref = this;

      setTimeout(() => {
        ref.addState = false;
      }, 4000);
    },
    recentRemove() {
      this.removeState = true;
      var ref = this;

      setTimeout(() => {
        ref.removeState = false;
      }, 4000);
    }
  }
}
</script>

<style lang="scss">
.stock-jumper {
  // background-color: white;
  position: absolute;
  right: 4vw;
  bottom: 0;
  text-align: right;
  z-index: 111;

  .jump {
    // display: none;
    font-family: var(--chat-font);
    font-size: 2em;
    margin: 1em 0;
    position: relative;
    bottom: -10em;
    transition: bottom 0.2s;

    span {
      background: white;
      padding: 0.3em;
    }

    &.jump-remove span {
      background: #e66060;
    }

    &.jump-add span {
      background: #6bd05d;
    }

    &.active {
      // display: block;
      bottom: 0;
      transition: bottom 0.2s;
      // opacity: 1;
    }
  }
}
</style>
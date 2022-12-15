<template>
  <div class="tutorial-parent" v-if="!hideSelf">
    <div class="tutorial">
      <div class="current-page">
        <div class="img-block">
          <img v-if="'image' in pages[index]" :src="pages[index].image" />
        </div>
        <div class="text-block">
          <h2>{{ pages[index].title }}</h2>
          <p>{{ pages[index].text }}</p>
        </div>
      </div>
      <div class="buttons">
        <button v-if="index > 0" @click="index--">Prev</button>
        <button v-if="index < pages.length - 1" @click="index++">Next</button>
        <button @click="hideTut" v-else>Begin</button>
      </div>

    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      pages: pages,
      index: 0,
      hideSelf: false,
    }
  },
  methods: {
    hideTut() {
      this.$emit("endTutorial")
      this.hideSelf = true;
      localStorage.seentut = true;
    }
  },
  mounted() {
    if (localStorage.seentut) {
      this.pages = alt;
    }
  }
}

const alt = [{
  text: "Welcome back to 'fake or far away!' Please be advised that this piece incorporates (relaxing) sound and potentially flashing colors. Press 'Begin' to start sound.",
  title: "Begin"
}];

const pages = [
  {
    text: "Welcome to 'fake or far away!' Please be advised that this piece incorporates (relaxing) sound and potentially flashing colors.",
    title: "Quick tutorial"
  },
  {
    image: "/images/tut1.png",
    title: "Chatting",
    text: "Type to your friends and react to their messages as you might normally in any other messenger app."
  },
  {
    image: "/images/tut2.png",
    title: "Stocks",
    text: "Underlined words are stocks exposed by the market. Click on them to buy or sell shares. But be careful not to let your stock disappear from the chat...!"
  },
  {
    image: "/images/tut3.png",
    title: "Experience",
    text: "As you interact with the page, the sound and appearance of the news will change with you. What will you discover? Hit 'Begin' to get started."
  }
];
</script>

<style lang="scss">
.tutorial-parent {
  align-items: center;
  background: #8080808a;
  display: flex;
  justify-content: center;
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 200;

  .tutorial {
    background: white;
    border-radius: 10px;
    box-shadow: 3px 3px 3px 0 rgba(0, 0, 0, 0.25);
    display: flex;
    flex-direction: column;
    justify-content: center;
    padding: 2em;
    position: relative;
    width: 50vw;
    height: 50vh;
  }

  .current-page {
    display: grid;
    grid-template-columns: 0.75fr 1fr;
    column-gap: 2em;
  }

  img {
    max-width: 100%;
    max-height: 300px;

    box-shadow: 1px 1px 3px 3px #0000001f;
    padding: 1em;
  }

  .img-block {
    margin-top: -3em;
  }

  .text-block {
    margin-top: 3em;
  }

  .buttons {
    position: absolute;
    bottom: 2em;
    width: calc(100% - 4em);
    display: flex;
    justify-content: space-evenly;

    button {
      width: 45%;
    }
  }

  h2,
  button {
    font-family: var(--mono-font);
  }

  p {
    font-family: var(--chat-font);
  }
}
</style>
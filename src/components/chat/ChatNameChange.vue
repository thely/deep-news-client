<template>
  <div class="chat-name">
    <h4>{{$t('chat.name')}}
      <span v-show="!changeActive" class="username-display" @click="openField">{{ name }}</span>
      <form v-show="changeActive" class="username-change" action="" @submit.prevent="changeName">
        <input type="text" class="username-text" ref="textInput" v-model="tempName" />
      </form>
    </h4>
  </div>
</template>

<script>
export default {
  data() {
    return {
      tempName: "",
      changeActive: false,
    }
  },
  computed: {
    name() {
      const n = this.$store.getters["chat/getOwnUsername"];
      // console.log("our name?");
      // console.log(n);
      return n;
    }
  },
  methods: {
    openField() {
      this.tempName = "";
      this.changeActive = true;
      this.$nextTick(() => this.$refs.textInput.focus())
    },
    changeName() {
      this.changeActive = false;
      if (this.tempName != "") {
        this.$store.commit("chat/updateOwnName", this.tempName);
        // this.$socket.client.emit("nameChange", { name: this.tempName });
      } else {
        console.log("needs actual letters!");
      }
    }
  }
}
</script>

<style lang="scss">
.chat-name {
  display: flex;
  justify-content: center;
  font-family: var(--chat-font);
  padding: 1em;
  
  h4 {
    font-weight: normal;
    margin: 0;
    text-align: center;
  }

  form {
    display: inline;
  }

  span {
    border-radius: 5px;
    box-shadow: 1px 1px 2px rgba(0, 0, 0, 0.25);
    font-weight: bold;
    padding: 3px;
    color: black;
    background-color: #bfdef0;
  }

  span:hover {
    background-color: yellow;
    cursor: pointer;
  }
}
</style>
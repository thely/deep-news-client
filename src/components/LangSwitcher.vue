<template>
  <div class="lang-switcher">
    <span class="lang" :class="{active: locale == 'en'}" @click="$i18n.locale = 'en'">EN</span>
    <!-- <span>|</span> -->
    <span class="lang" :class="{active: locale == 'de'}" @click="$i18n.locale = 'de'">DE</span>
  </div>
</template>

<script>
export default {
  computed: {
    locale() {
      return this.$i18n.locale;
    }
  }
}
</script>

<style lang="scss">
.lang-switcher {
  font-family: var(--mono-font);
  font-size: 1.3em;
  padding: 0.2em;
  // position: absolute;
  // top: 0;
  // right: 2em;
  background: white;
  border: 3px solid blue;

  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 4.3em;

  .lang {
    cursor: pointer;
    padding: 0.2em;
  }
  
  .active {
    background: blue;
    color: white;
  }

  // span:first-child {
  //   margin-right: 0.5em;
  // }
}
</style>
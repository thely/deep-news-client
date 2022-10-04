<template>
  <div class="tv-display-group">
    <!-- <TVDisplay v-for="" -->
    <TVDisplay 
        v-for="(d, index) in displays"
        :key="index"
        :index="d.index"
        :size="d.size"
        :channel="d.channel"
        :controls="controls"
        :hiderawvid="hideVideos"
    >
    </TVDisplay>
    <!-- <TVDisplay :index="1" :size="'small'" :channel="'CH 6'"></TVDisplay> -->
  </div>
</template>

<script>
import TVDisplay from './tv/TVDisplay.vue'
export default {
  components: { TVDisplay },
  props: {
    controls: Object,
    hideVideos: {
      type: Boolean,
      default: true,
    }
  },
  data() {
    return {
      displays: [
        {
          index: 0,
          size: 'large',
          channel: 'CH 5'
        },
        {
          index: 1,
          size: 'small',
          channel: 'CH 6'
        }
      ]
    }
  }
  // computed: {
  //   loaders() {
  //     return this.$store.state.videos.loads;
  //   },
  //   top() {
  //     return this.loaders.slice(0, 2);
  //   },
  //   bot() {
  //     return this.loaders.slice(2, 4);
  //   },
  // },
  // watch: {
  //   loaders(newV) {
  //     console.log(newV);
  //   }
  // }
}
</script>

<style>

</style>
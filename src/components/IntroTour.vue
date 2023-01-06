<template>
  <div class="interactive-tour" :class="{'ongoing': tourStarted}" :data-lastid="messageID" :data-user="username" :stock="currentStock">
    <div class="tutorial-start" @click="startTour" title="View tutorial">🔍</div>
  </div>
</template>

<script>

export default {
  data() {
    return {
      expectedStep: 0,
      tour: null,
      tourStarted: false,
    }
  },
  computed: {
    messageID() {
      return this.$store.getters["chat/getLastMessageID"];
    },
    username() {
      return this.$store.getters["chat/getOwnUsername"];
    },
    currentStock() {
      return this.$store.state.market.selectedStock;
    },
    openPopup() {
      return this.$store.state.market.openPopup;
    },
    funds() {
      return this.$store.state.market.funds;
    }
  },
  watch: {
    messageID(newV, oldV) {
      if (newV != oldV && oldV != -1 && this.getStepID() == "chat-type") {
        this.tour.next();
      }
    },
    username(newV, oldV) {
      console.log(newV, oldV);
      console.log("checking username");
      if (newV != oldV && oldV != "..." && this.getStepID() == "name-change") {
        console.log("proceeding from name change");
        this.tour.next();
      }
    },
    openPopup(newV) {
      console.log(this.tour.getCurrentStep());
      if (newV && this.getStepID() == "chat-large") {
        console.log("proceeding from intro popup");
        this.tour.next();
      } else if (this.funds != 1000 && !newV && this.getStepID() == "stock-invest") {
        this.tour.next();
      }
    },
  },
  mounted() {
    const ref = this;
    this.$nextTick(() => {
      const steps = [
        {
          id: "welcome",
          text: () => { return ref.$t('greetings') },
          buttons: [
            {
              text: () => { return ref.$t('buttons.begin') },
              action: () => { 
                this.$emit("startAudio");
                this.tour.next();
              }
            }
          ]
        },
        {
          id: 'chat-type',
          attachTo: {
            element: ".chat-form",
            on: "bottom"
          },
          text: () => { return ref.$t('tutorial[0]') },
          popperOptions: {
            modifiers: [{ name: 'offset', options: {'offset': [30,] }}]
          }
        },
        {
          id: 'name-change',
          attachTo: {
            element: ".chat-name h4",
            on: "bottom"
          },
          text: () => { return ref.$t('tutorial[1]') },
        },
        {
          id: 'chat-large',
          attachTo: {
            element: ".chat-block",
            on: "right"
          },
          text: () => { return ref.$t('tutorial[2]') }
        },
        {
          id: 'stock-invest',
          attachTo: {
            element: ".stock-word-parent",
            on: "top"
          },
          text: () => { return ref.$t('tutorial[3]', [ref.currentStock]) }
        },
        {
          id: 'stock-chart',
          attachTo: {
            element: ".stock-parent",
            on: "top"
          },
          text: () => { return ref.$t('tutorial[4]') },
          buttons: [
            {
              text: () => { return ref.$t('buttons.next') },
              action: () => { this.tour.next(); }
            }
          ]
        },
        {
          id: 'video-check',
          attachTo: {
            element: ".patch-large",
            on: "left"
          },
          text: () => { return ref.$t('tutorial[5]') },
          buttons: [
            {
              text: () => { return ref.$t('buttons.next') },
              action: () => { this.tour.next(); }
            }
          ]
        },
        {
          id: 'chat-censor',
          attachTo: {
            element: ".chat-block",
            on: "right"
          },
          text: () => { return ref.$t('tutorial[6]') },
          buttons: [
            {
              text: () => { return ref.$t('buttons.finish') },
              action: () => { 
                this.tour.complete();
                this.tourStarted = false;
              }
            }
          ]
        },
      ];

      ref.tour = ref.$shepherd({
        useModalOverlay: true,
        keyboardNavigation: false,
        exitOnExcape: false,
        defaultStepOptions: {
          // popperOptions: {
          //   modifiers: [{ name: 'offset', options: {'offset': [15,15] }}]
          // },
          modalOverlayOpeningPadding: 15,
          modalOverlayOpeningRadius: 15
        }
      });

      ref.tour.addSteps(steps);
      this.tour.start();
      document.addEventListener("keyup", this.pressEscape);
    });
  },
  destroyed() {
    document.removeEventListener("keyup", this.pressEscape);
  },
  methods: {
    getStepIndex() {
      console.log(this.tour.currentStep);
      return this.tour.steps.indexOf(this.tour.currentStep);
    },
    getStepID() {
      return this.tour.currentStep.id;
    },
    startTour() {
      this.tour.start();
      this.tourStarted = true;
    },
    pressEscape(e) {
      if(e.key == "Escape"){
        this.tourStarted = false;
        this.tour.cancel();
      }
    }
  }
}
</script>

<style lang="scss">
@import '~shepherd.js/dist/css/shepherd.css';

.interactive-tour {
  background-color: white;
  border: 3px solid blue;
  cursor: pointer;

  .tutorial-start {
    font-size: 1.3em;
    padding: 0.2em;
  }

  &.ongoing {
    background-color: lightgrey;
    color: transparent;
    text-shadow: 0 0 0 rgb(161, 161, 161);
  }
}
</style>
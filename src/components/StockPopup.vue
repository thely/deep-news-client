<template>
  <div v-if="isPopupOpen" class="stock-word-parent popup-parent" v-click-outside="hideDisplay">
    <h3>{{ currentStock }}</h3>
    <p>
      <span v-if="shares > 0">You have {{ shares }} shares in "{{ currentStock }}."</span>
      <span v-else>You have no "{{ currentStock }}" shares.</span>
    </p>
    
    <div class="price-block-parent">
      <div class="price-block">
        <h4>Buy stock</h4>
        <ul class="seller-list">
          <li v-for="(seller, index) in sellers" :key="index">
            <span>${{ seller }}</span>
            <button @click="buyStock($event, seller, index)" :disabled="seller > funds">Buy</button>
          </li>
        </ul>
      </div>

      <div class="price-block">
        <h4>Sell stock</h4>
        <div v-if="shares > 0">
          <ul class="buyer-list seller-list">
            <li v-for="(buyer, index) in buyers" :key="index">
              <span>${{ buyer }}</span>
              <button @click="sellStock($event, buyer)">Sell</button>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  // props: {
  //   word: String,
  // },
  data() {
    return {
      // showSellers: false,
      sellPrice: 0,
    }
  },
  computed: {
    closePrice() {
      const price = this.$store.getters['market/getCurrentStockClosePrice'];
      // console.log(price);
      return parseFloat(price);
    },
    sellers() {
      // const numSellers = Math.ceil(Math.random() * 5);
      const numSellers = 3;
      let sellers = [];
      for (let i = 0; i < numSellers; i++) {
        let direction = Math.random() > 0.7 ? 1 : -1;
        let volatility = (Math.random() * 2 * direction);
        // console.log(this.closePrice + volatility);
        sellers.push((this.closePrice + volatility).toFixed(2));
      }

      return sellers;
    },
    buyers() {
      const buyCount = Math.min(4, Math.ceil(this.shares / 3));
      let buyers = [];
      for (let i = 0; i < buyCount; i++) {
        let direction = Math.random() > 0.5 ? 1 : -1;
        let volatility = (Math.random() * 2 * direction);
        buyers.push(parseFloat(this.closePrice + volatility).toFixed(2));
      }

      return buyers;
    },
    shares() {
      return this.$store.getters['market/getUserStockCount'](this.currentStock);
    },
    funds() {
      return this.$store.state.market.funds;
    },
    currentStock() {
      return this.$store.state.market.selectedStock;
    },
    isPopupOpen() {
      const p = this.$store.state.market.openPopup;
      // console.log("popup is " + p);
      return p;
    },
    selfID() {
      return this.$store.getters["chat/getSelfUserID"];
    }
  },
  methods: {
    buyStock(e, seller) {
      this.$store.commit("market/buyStock", {
        stock: this.currentStock,
        cost: seller,
        user: this.selfID
      });

      // this.$socket.client.emit("buyStock", this.currentStock);
    },
    sellStock(e, buyer) {
      this.$store.commit("market/sellStock", {
        stock: this.currentStock,
        cost: buyer,
        user: this.selfID
      });

      // this.$socket.client.emit("sellStock", this.currentStock);
    },
    hideDisplay(e) {
      const list = e.target.parentElement.classList;
      console.log(list);
      if (!list.contains("stock-word") && !list.contains("stock-select")) {
        this.$store.commit("market/changePopupState", false);
      }
    }
  }
}
</script>

<style lang="scss">
.popup-parent {
  background: white;
  border: 1px solid grey;
  color: black;
  font-family: var(--mono-font);
  font-size: 1em;
  max-width: 24vw;
  padding: 1.35em;
  position: absolute;
  left: 32vw;
  bottom: calc(5em + 283px);
  z-index: 100;
  
  h3 {
    margin-top: 0;
  }

  .price-block-parent {
    display: grid;
    grid-template-columns: 1fr 1fr;
    column-gap: 2em;
  }

  h4 {
    font-size: 1.1em;
    // margin: 0;
    margin: 0.25em 0;
  }

  .seller-list {
    list-style-type: none;
    margin-bottom: 0;
    padding-left: 0;

    li {
      background: white;
      color: black;
      
      padding-bottom: 0;
      padding: 0.5em 0;

      display: grid;
      grid-template-columns: 3fr 1fr;

      span {
        line-height: 2;
      }

      button {
        font-family: var(--mono-font);
        // font-size: 0.9em;
      }
    }
  }
}
</style>
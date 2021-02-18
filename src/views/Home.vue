<template>
  <div class="home">
    <div class="card-wrapper" v-for="(coin, i) in coins" :key=i>
      <CoinCard :coin="coin" :ethPrice="price" />
    </div>
  </div>
</template>

<script lang="ts">
import CoinCard from '@/common/CoinCard.vue';
import { defineComponent, onMounted, ref } from 'vue';
import { coins } from '@/assets/coins/coins';

export default defineComponent({
  name: 'Home',
  components: {
    CoinCard 
  },
  setup() {

    const price = ref(0);

    async function fetchEthPrice() {
      const url = 'https://api.coingecko.com/api/v3/coins/ethereum?tickers=true&market_data=true&community_data=false&developer_data=false&sparkline=false';
      const data = await fetch(url).then((res: any) => res.json());
      price.value = data.market_data.current_price.usd;
    }

    onMounted(() => {
      fetchEthPrice();
    })

    return { coins, price }
  }
});
</script>

<style lang="scss" scoped>
@import '../assets/css/common.scss';

.home {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
}

.card-wrapper {
  width: 25%;
  height: 200px;
  padding: 5px;

  @include breakpoint {
    width: 50%;
  }

  @include breakpoint1 {
    width: 100%;
  }
}

</style>
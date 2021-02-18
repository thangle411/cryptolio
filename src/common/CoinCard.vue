<template>
    <div class="card-container">
        <h2>{{ coin?.name }}</h2>
        <span>
            {{coin?.name}} in pool: {{coinAmount}}
        </span>
        <span>
            ETH in pool: {{ethAmount}}
        </span>
        <!-- <div class="price" :style="{ color: `${newPrice > oldPrice ? '#4CAF50' : '#F44336' }` }">
            $<Roller :text="currentPrice"></Roller>
        </div> -->
        <div class="price" :style="{color: `${color}`}">
            $<Roller :text="currentPrice"></Roller>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref, watch } from 'vue';
import {  contractSetup } from '../utils/contractSetup';
import Roller from './Roller.vue';

export default defineComponent({
    name: "CoinCard",
    props: {
        coin: {type: Object},
        ethPrice: {type: Number, default: 0}
    },
    components: {
        Roller
    },
    setup(props) {
        const coinContract = contractSetup(props.coin?.coinAddress);
        const ethContract = contractSetup('0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2');
        const coinAmount = ref('');
        const ethAmount = ref('');
        const currentPrice = ref('');
        const newPrice = ref(0);
        const oldPrice = ref(0);
        const color = ref('');

        async function getCoinAmount() {
            const ethInPool = ((await ethContract.methods.balanceOf(props.coin?.pairAddress).call()) / 10**18);
            ethAmount.value = ethInPool.toLocaleString();
            const totalCoinAmt = await coinContract.methods.balanceOf(props.coin?.pairAddress).call();
            const coinDecimal = await coinContract.methods.decimals().call();
            const coinInPool = (totalCoinAmt / (10**coinDecimal));
            coinAmount.value = coinInPool.toLocaleString();
            currentPrice.value = (ethInPool / coinInPool * props.ethPrice).toLocaleString();
            newPrice.value = (ethInPool / coinInPool * props.ethPrice);
        }

        watch(newPrice, (current, previous) => {
            oldPrice.value = previous;
            if(current > previous) {
                color.value = '#4CAF50'
            } else {
                color.value = '#F44336'
            }
            setTimeout(() => {
                color.value = 'white'
            }, 1000);
        })

        onMounted(() => {
            setInterval(() => {
                getCoinAmount();
            },1000)
        })

        return { coinAmount, ethAmount, currentPrice, newPrice, oldPrice, color}
    }
})
</script>

<style lang="scss" scoped>
@import '../assets/css/common.scss';

.card-container {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 100%;
    background: $primary-color;
    color: $grey;

    .price {
        display: flex;
        align-items: center;
        font-size: 40px;
        font-weight: bold;
        color: white;
    }

    span {
        padding: 5px 0;
        color: $dark-grey;
    }
}

</style>
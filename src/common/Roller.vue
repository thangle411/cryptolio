<template>
	<div v-if="isStatic && isAnimationEnd" class="roller">
		<component :is="t != '\n' ? 'div' : 'br'" class="roller__char rollerBlock" v-for="(t, idx) in getText()" :key="idx" :style="{ opacity: t == ' ' ? 0 : 1 }">
			{{ t == " " ? "-" : t }}
		</component>
	</div>
	<transition-group tag="div" name="roller" class="roller" v-else>
		<component :is="t != '\n' ? 'div' : 'br'" class="roller__wrapper" v-for="(t, idx) in getText()" :key="idx">
			<ul
				v-if="t != '\n'"
				class="roller__char rollerBlock"
				:style="{ top: `${isRollStart ? findCharIndex(t) * -100 : getDefaultCharIndex(idx) * -100}%`, height: `${charList.length * 100}%`, transition: `${transition}s` }"
			>
				<li class="roller__char__item" :class="{ copyable: t == char }" v-for="char in findCharIndex(t, true) != -1 ? charList : [t]" :key="char" :style="{ opacity: char == ' ' ? 0 : 1 }">
					{{ char == " " ? "-" : char }}
				</li>
			</ul>
		</component>
	</transition-group>
</template>

<script lang="ts">
import { defineComponent, onMounted, PropType, ref } from 'vue';

export default defineComponent ({
	name: "Roller",
    props: {
        text: {type: String, default: '0000'},
        isNumberFormat: {type: Boolean, default: false},
        isStatic: {type: Boolean, default: false},
        charList: {type: Array as PropType<string[]>, default: () => ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"]},
        transition: {type: Number, default: 0.5},
        defaultChar: {type: String, default: ''},
        wordWrap: {type: Number, default: 0}
    },
    setup(props) {
        
        const isRollStart = ref(false);
        const isAnimationEnd = ref(false);

        // get pre processing text
        function getText() {
            return props.text.split('');
        }

        function getDefaultCharIndex(idx: number): number {
            const result = props.charList.indexOf(props.defaultChar[idx] || props.defaultChar[0]);
            return result == -1 ? 0 : result;
        }

        function isIncludeCharList(t: string): boolean {
            return props.charList.indexOf(t) != -1;
        }

        function getIndex(t: string, idx: number): string {
            if (!isIncludeCharList(t)) {
                if (!String(t).trim()) return "NULL" + idx;
                else return String(t) + String(idx);
            }
            if (props.isNumberFormat) {
                // comma match
                const reg = getText()
                    .join("")
                    .substring(0, idx + 1)
                    .match(/,/gi);
                return (idx - (reg ? reg!.length || 0 : 0)).toString();
            }
            return idx.toString();
        }

        function findCharIndex(t: string, isOriginal = false) {
            const idx = props.charList.indexOf(t);
            if (idx == -1 && !isOriginal) return 0;
            else return idx;
        }   

        onMounted(() => {
            setTimeout(() => {
			isRollStart.value = true;
			// transition end
			setTimeout(() => {
				isAnimationEnd.value = true;
			}, props.transition * 1000 + 200);
		}, 200);
        })

        return { isRollStart, isAnimationEnd, getText, getDefaultCharIndex, getIndex, findCharIndex }
    }
})
</script>

<style lang="scss" scoped>
* {
	margin: 0;
	padding: 0;
	box-sizing: border-box;
}
.roller-leave-active,
.roller-enter-active {
	transition: top 0.75s, opacity 0.75s, width 0.75s;
}
.roller-leave-active {
	position: absolute;
}
.roller-item {
	transition: 0.5s;
}
.roller-move {
	transition: 0.5s;
}
.roller-enter {
	opacity: 0;
	.roller__char {
		top: 100% !important;
	}
}
.roller-enter-to {
	opacity: 1;
}
.roller-leave {
	opacity: 1;
	width: 1em;
}
.roller-leave-to {
	opacity: 0;
	width: 0;
	.roller__char {
		top: 100% !important;
	}
}
.roller {
	flex-wrap: wrap;
	overflow: hidden;
	width: fit-content;
	.roller__wrapper {
		display: inline-flex;
		position: relative;
		height: 1.5em !important;
		overflow: hidden;
		mask-image: linear-gradient(0deg, rgba(255, 255, 255, 0) 0%, rgba(0, 0, 0, 1) 25%, rgba(0, 0, 0, 1) 75%, rgba(255, 255, 255, 0) 100%);
		-webkit-mask-image: linear-gradient(0deg, rgba(255, 255, 255, 0) 0%, rgba(0, 0, 0, 1) 25%, rgba(0, 0, 0, 1) 75%, rgba(255, 255, 255, 0) 100%);
	}
	/* hr.roller__wrapper {
		margin-left: 100%;
		height: 0 !important;
		border: none;
	} */
	.roller__char {
		display: inline-flex;
		line-height: 1.5em;
		transition: 0.5s;
		position: relative;
		list-style: none;
		flex-direction: column;
		.roller__char__item {
			user-select: none;
			flex: 1;
		}
		.copyable {
			user-select: all;
		}
	}
}
.block {
	padding: 0 !important;
	margin-top: 0 !important;
	margin-bottom: 0 !important;
}
</style>
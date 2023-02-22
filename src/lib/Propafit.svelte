<script>
	import { tick, onMount } from 'svelte';
	import gsap from 'gsap';
	import { setAnimations, makeId, sleep } from './utils';
	export let text = 'PROPAGANDA\rIS\rAWESOME';
	export let fontSize=10;
	export { className as class };
	export let bg="unset";
	export let color = 'white';
    export let animations = null;
	export let onScroll = null;
	export let fontFamily = 'inherit';
	export let lineHeight = 1.2;
	export let id = makeId();
	export let border = false;
	export let container;
	export let timeline;

	let className;
	let styles = [];
	let mainElement;
	const tlAnimations = gsap.timeline();
	
	$: lines = Array.isArray(text) ? text.map(t => t.text) : text.trim().split(/\s*[\r\n]+\s*/g);
	$: if(Array.isArray(text)) {
		styles = text.map(t => { 
			const {text, ...rest} = t; 
			return Object.entries(rest).map(([key, value]) => `${key}:${value}`).join(';');
		}) 
	}
	
	async function setPropagandaFontSize(el, obj) {
		let { fontSize }=obj;
		const p = el.parentNode;
		el.style.fontSize = fontSize + "px";
		await tick();
		const { width : ew, height : eh } = el.getBoundingClientRect();
		const { width : pw, height : ph } = p.getBoundingClientRect();
		const sizeH = (fontSize*(ph)) / (eh);
		const sizeW = (fontSize*(pw)) / (ew);
		await tick();
		fontSize = Math.min(sizeH,sizeW);
		el.style.fontSize = (fontSize) + "px";
	}

	onMount(async()=>{
		await tick();
			
		setAnimations({ timeline, animations : onScroll, mainElement })
		setAnimations({ timeline : tlAnimations, animations, mainElement })
		
		return () => {
			tlAnimations.kill(true);
			timeline.kill(true);
			gsap.set(mainElement, {clearProps: true});
		} 
	})
	 
</script>

<div id="{id}" class="mainElement {className}"
	class:border
	bind:this={mainElement} 
	style="
		font-family:{fontFamily};
		--propanda-fit-font_size:{fontSize}; 
		--propanda-fit-bg:{bg}; 
		--propanda-fit-color:{color};
		--propanda-fit-line-height:{lineHeight}ch;
	">
	{#each lines as line,i(i)}
  	<div class="propafit-line" use:setPropagandaFontSize={{fontSize,line}}
		style="{styles[i]};"
	>
		{line}
	</div>
	{/each}
</div>

<style>
.propafit {
  display: block;
  background-color: var(--propanda-fit-bg);
  color:var(--propanda-fit-color);
  padding:0px;
}
.propafit-line {
	display: table;
	margin: 0 auto;
	text-align: center;
	color: currentColor;
	font-size: var(--propanda-fit-font_size);
	line-height: var(--propanda-fit-line-height);
	padding:0px;
}
.border {
	border : 1px solid red;
}
</style>
<script>
	export let text = 'PROPAGANDA\rIS\rAWESOME';
	export let textPath = {}
    export { className as class };

	const defaults = { 
		path : 'circle', 
		radius : 110, 
		startOffset : 0,
		rotate : 0,
		textPadding : 0,
		bg : 'none',
		stroke : 'none',
		strokeWidth : 'none'
	}
	
	let className;
	let ajust = 4;
	let ajust2 = 1.5;
	let id = Math.round(`${+performance.now().toString().replace('.', ~~(Math.random()*1000))}`).toString(36);
	$: options = {...defaults, ...textPath}
	 
</script>

{#if options.path}
    <svg 
        style="--propa-textpath-rotate:{options.rotate}deg;"
        viewBox="0 0 {options.radius * ajust} {options.radius * ajust}" width="{options.radius*ajust2}" height="{options.radius*ajust2}">

		{#if options.path === 'circle' && options.radius}

        <path id="propa-textpath" transform-origin="50%" 
            transform="rotate({options.rotate})"
            fill="{options.bg}"
            stroke="{options.stroke}"
            d="
                M {options.radius*2}, {options.radius*2}
                m {-options.radius}, 0
                a {options.radius},{options.radius} 0 1,1 {options.radius*2},0
                a {options.radius},{options.radius} 0 1,1 -{options.radius*2},0
            "/>

        {:else}

        <path id="propa-textpath" 
            d="{options.path}"
        />
        
        {/if}

        <text font-size="17" dy="-{options.textPadding}">
            <textPath xlink:href="#propa-textpath" class="{className}"
                font-size="{options.fontSize/10}vmin" 
                startOffset="{options.startOffset}%"
                letter-spacing="{options.letterSpacing}"
            >
                {text}
            </textPath>
        </text>
    </svg>

    {/if}

<style>
	text {
		color:black;
		font-size:40px;
	}
	path {
		transform-origin:"50%";
		transform:rotate(var(--propa-textpath-rotate));
	}
</style>
<script>
  // ORDRE : intro - minimalist - cheesy - typo - poetic - aquatic OR chic
  // OR MUESTRA NUEVA APPROCHE RESSEREE

  import { tick } from "svelte";
  import { MediaQuery } from "svelte/reactivity";
  import { innerHeight, innerWidth } from "svelte/reactivity/window";

  import Echoes from "./lib/Echoes.svelte";
  import CentricChild from "./lib/CentricChild.svelte";
  import PropaCentric from "./lib/PropaCentric.svelte";
  import PropaGrid from "./lib/PropaGrid.svelte";
  import PropaLayer from "./lib/PropaLayer.svelte";
  import PropaMask from "./lib/PropaMask.svelte";
  import Proparent from "./lib/Proparent.svelte";
  import { ScrollSmoother, ScrollTrigger, setupGsap } from "./lib/gsap";
  import { createPathInterpolator } from "./lib/path-morph";
  import { onScrollAssets, typographicPaths, animAssets } from "./propassets";

  setupGsap();

  const MEDIA_QUERY = "(orientation : portrait), (max-width : 675px)";
  const circle = "M35,70a35,35 0 1,0 70,0a35,35 0 1,0 -70,0";
  const elementsCheesy = 8;
  const waves = ["wave-01.png", "wave-02.png", "wave-03.png"];

  let echoesVisible = $state(false);
  /** @type {HTMLDivElement | undefined} */
  let smoothWrapper;
  /** @type {HTMLDivElement | undefined} */
  let smoothContent;
  let introContainer = $state(
    /** @type {HTMLDivElement | undefined} */ (undefined),
  );
  let introTimeline = $state(/** @type {any} */ (null));
  let cheesyContainer = $state(
    /** @type {HTMLDivElement | undefined} */ (undefined),
  );
  let cheesyTimeline = $state(/** @type {any} */ (null));
  let typographicContainer = $state(
    /** @type {HTMLDivElement | undefined} */ (undefined),
  );
  let typographicTimeline = $state(/** @type {any} */ (null));
  let poeticContainer = $state(
    /** @type {HTMLDivElement | undefined} */ (undefined),
  );
  let poeticTimeline = $state(/** @type {any} */ (null));
  let fishContainer = $state(
    /** @type {HTMLDivElement | undefined} */ (undefined),
  );
  let fishTimeline = $state(/** @type {any} */ (null));
  /** @type {any} */
  let smoother = null;
  const appState = $state({
    typographicScrollProgress: 0,
  });
  const mobileQuery = new MediaQuery(MEDIA_QUERY, false);

  const viewportWidth = $derived(innerWidth.current ?? 1440);
  const viewportHeight = $derived(innerHeight.current ?? 900);
  const isMobile = $derived(mobileQuery.current);
  const echoes = $derived(isMobile ? 6 : 10);
  const grid = $derived(isMobile ? [3, 7] : [9, 5]);
  const onScrolls = $derived(onScrollAssets(elementsCheesy, isMobile));
  const anims = $derived(animAssets(echoes));
  const aspectRatio = $derived(
    isMobile ? viewportWidth / Math.max(viewportHeight, 1) : 16 / 9,
  );
  const interpolators = $derived.by(() => {
    return typographicPaths.map((path) => {
      if (!Array.isArray(path)) {
        return null;
      }

      return path[1]
        ? [
            createPathInterpolator(circle, path[0]),
            createPathInterpolator(circle, path[1]),
          ]
        : [createPathInterpolator(circle, path[0])];
    });
  });

  /** @type {(n: number, min: number, max: number) => number} */
  const clamp = (n, min, max) => (n > max ? max : n < min ? min : n);

  $effect(() => {
    if (!smoothWrapper || !smoothContent) {
      return;
    }

    let cancelled = false;

    tick().then(() => {
      if (cancelled) {
        return;
      }

      document.body.style.background = "white";
      smoother?.kill();
      smoother = /** @type {any} */ (ScrollSmoother).create({
        wrapper: smoothWrapper,
        content: smoothContent,
        smooth: 1,
        effects: true,
        smoothTouch: 0.1,
      });
      ScrollTrigger.sort();
    });

    return () => {
      cancelled = true;
      smoother?.kill();
      smoother = null;
    };
  });

  // TODO ANIM CONFIG
</script>

<!------------------------------------ HTML -------------------------------------------------------------------->

<div id="smooth-wrapper" bind:this={smoothWrapper}>
  <div id="smooth-content" bind:this={smoothContent}>
    <!-- ANCHOR INTRO ____________________________________________________________________________________________________-->

    <Proparent
      bgColor={"unset"}
      {aspectRatio}
      id={"propa-1"}
      styles={{ justifyContent: "flex-end" }}
      bind:container={introContainer}
      bind:timeline={introTimeline}
    >
      <PropaGrid
        container={introContainer}
        {grid}
        timeline={introTimeline}
        id="propa-1-grid"
        zIndex={2}
        width={"100%"}
        styles={{
          alignSelf: "flex-start",
          //rowGap : '5px'
        }}
        oddRows={{
          transform: "translateX(50%)",
          odd: true,
        }}
        animations={{
          ...anims.intro,
          start: introContainer?.offsetTop,
          end: (introContainer?.offsetHeight ?? 0) * 1.5,
        }}
        onScroll={onScrolls.intro}
      >
        {#each { length: grid[0] * grid[1] } as _, i (`intro-${isMobile ? "mobile" : "desktop"}-${i}`)}
          <div class="balles">
            <div
              class={[
                "circle-white",
                {
                  invisible:
                    (!isMobile && i > 21 && i < 27) ||
                    (isMobile && (i == 10 || i == 9 || i == 11)),
                },
              ]}
            ></div>
            <div
              class={[
                "circle-black",
                {
                  invisible:
                    (!isMobile && i > 21 && i < 27) ||
                    (isMobile && (i == 10 || i == 9 || i == 11)),
                },
              ]}
            ></div>
          </div>
        {/each}

        <div class="title-wrapper propaganda-title-wrapper">
          <div id="title-propaganda">
            propaganda
            <span id="punch-line">Create amazing graphic websites with</span>
          </div>
        </div>
      </PropaGrid>

      <!-- ANCHOR WHETHER YOU LIKE IT ___________________________________________________________________________-->

      <div id="title-whether" style="z-index:5;">whether you like it...</div>

      <!-- ANCHOR MININALIST ___________________________________________________________________________-->

      <PropaGrid
        container={introContainer}
        {grid}
        timeline={introTimeline}
        background={"black"}
        zIndex={1}
        height={isMobile ? "102%" : "100%"}
        id={"grid-minimalist"}
      >
        {#each { length: grid[0] * grid[1] } as _, i (`minimalist-${isMobile ? "mobile" : "desktop"}-${i}`)}
          <div
            class={[
              "lignes",
              {
                invisible:
                  (!isMobile && i > 20 && i < 24) || (isMobile && i == 10),
              },
            ]}
          >
            <div class="ligne">
              <span
                style="transform:rotateZ({(i * 0.125) %
                  1}turn); border-radius : 50%;"
                class="sub-ligne"
              ></span>
            </div>
          </div>
        {/each}
        <div class="title-wrapper" style="display:contents;">
          <div id="title-minimalist" style="--fwgt : 600; --fwdt : 120;">
            minimalist
          </div>
        </div>
      </PropaGrid>
    </Proparent>

    <!-- ANCHOR CHEESY ____________________________________________________________________________________________________ -->

    <Proparent
      id={"propa-cheesy"}
      image={"propaganda/miami/miami-light-pano.jpg"}
      backgroundSize={"cover"}
      gradient={"90deg, transparent 0%, black 150%"}
      styles={{ alignItems: "center", justifyContent: "end" }}
      bind:container={cheesyContainer}
      bind:timeline={cheesyTimeline}
      bind:visible={echoesVisible}
      end={"+=200%"}
    >
      <!-- REVERBERES -->
      <PropaLayer
        container={cheesyContainer}
        timeline={cheesyTimeline}
        zIndex={3}
        id={"reverberes"}
        height={"100%"}
        onScroll={onScrolls.cheesy}
      >
        {#each { length: isMobile ? elementsCheesy / 2 : elementsCheesy } as _, i (`reverbere-${isMobile ? "mobile" : "desktop"}-${i}`)}
          <div
            class="reverbere"
            style="width:{(isMobile ? 340 : 12) / elementsCheesy + i * 3}vw"
          >
            <img
              class="reverbere-img"
              src="/propaganda/miami/reverbere.png"
              alt="palmier"
            />
          </div>
        {/each}
      </PropaLayer>

      <!-- PALMIERS -->
      <PropaLayer
        container={cheesyContainer}
        timeline={cheesyTimeline}
        id={"palmiers"}
        zIndex={1}
        height={"100%"}
      >
        {#each { length: isMobile ? elementsCheesy / 2 : elementsCheesy } as _, i (`palmier-${isMobile ? "mobile" : "desktop"}-${i}`)}
          <div
            class="palmier"
            style="width:{(isMobile ? 380 : 80) / elementsCheesy + i * 1.5}vw"
          >
            <img
              class="palmier-img"
              src="/propaganda/miami/palmier-0{(i % 3) + 1}.png"
              alt="palmier"
            />
          </div>
        {/each}
      </PropaLayer>

      <!-- ECHOES -->

      <Echoes
        container={cheesyContainer}
        timeline={cheesyTimeline}
        id={"cheesy"}
        zIndex={9}
        perspective={100}
        perspectiveOrigin={isMobile ? [100, 400] : [-100, 200]}
        styles={{
          paddingRight: "4vw",
          fontFamily: `'M PLUS Rounded 1c', sans-serif`,
          fontWeight: 500,
          opacity: 0.85,
        }}
        title={"CHEESY"}
        angle={100}
        echoesDistance={isMobile ? 30 : 14}
        {echoes}
        options={{
          transparency: 10,
          isoMetric: false,
          faceOutline: "2px",
          strokeOutline: "3px",
          faceColor: "cyan",
          color: "cyan",
          outline: true,
          spreading: "linear",
          fontSize: isMobile ? 25 : 25,
          lineSpacing: -15,
        }}
        animations={anims.echoes}
      />
    </Proparent>

    <!-- ANCHOR TYPOGRAPHIC ___________________________________________________________________________-->

    <Proparent
      bgColor={"#FCEE21"}
      {aspectRatio}
      id={"propa-4-typographic"}
      styles={{ alignItems: "center", justifyContent: "center" }}
      end={"+=200%"}
      bind:container={typographicContainer}
      bind:timeline={typographicTimeline}
      exposeProgress={true}
      bind:progress={appState.typographicScrollProgress}
    >
      <div class="title-wrapper">
        <div id="title-typographic">
          {#each "typographic" as typo, i (`typographic-title-${typo}-${i}`)}
            <span
              style="opacity:{Math.round(
                6 * ((appState.typographicScrollProgress * 1.4) / (i + 1)),
              )};"
            >
              {typo}
            </span>
          {/each}
        </div>
      </div>

      <PropaGrid
        container={typographicContainer}
        timeline={typographicTimeline}
        grid={[6, 6]}
        rowSize={15}
        colSize={15}
        gridUnits={"vmin"}
        id={"grid-typographic"}
        onScroll={onScrolls.typographic}
      >
        {#each typographicPaths as path, i (`typographic-path-${i}`)}
          {#if Array.isArray(path)}
            <svg
              id="svg-{i}"
              class="typo-svg"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 140 140"
            >
              {#if i === path.length - 3}
                <svg
                  id="t22"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 140 140"
                  ><polygon
                    class="b"
                    points="140 0 126.69 0 102.54 81.07 81.36 0 76.07 0 113.32 140 140 140 140 0"
                  /><path
                    class="b"
                    d="M77.19,121.28V0H12.31V121.28c-.8,12.17-3.79,17.12-12.31,18.55v.17H87.2c-7.61-1.29-10.31-6.28-10.01-18.72Z"
                  /></svg
                >
              {:else}
                <path
                  class="b"
                  d={interpolators[i]?.[0]?.(
                    clamp(appState.typographicScrollProgress, 0, 1),
                  ) ?? circle}
                />
                {#if path[1] && interpolators[i]?.[1]}
                  <path
                    class="b"
                    d={interpolators[i]?.[1]?.(
                      clamp(appState.typographicScrollProgress, 0, 1),
                    ) ?? circle}
                  />
                {/if}
              {/if}
            </svg>
          {:else}
            {@html path}
          {/if}
        {/each}
      </PropaGrid>
    </Proparent>

    <!-- ANCHOR  POETIC ___________________________________________________________________________-->

    <Proparent
      bgColor={"whitesmoke"}
      {aspectRatio}
      id={"propa-3-poetic"}
      backgroundSize={"cover"}
      bind:container={poeticContainer}
      bind:timeline={poeticTimeline}
      end={"+=120%"}
    >
      <!-- POETIC LETTERS -->
      <PropaGrid
        container={poeticContainer}
        timeline={poeticTimeline}
        styles={{ alignSelf: "center", gridRowGap: "30%" }}
        grid={[3, 2]}
        width={isMobile ? "70vw" : "35vw"}
        height={"50vh"}
        id={"grid-poetic"}
        onScroll={onScrolls.poetic}
      >
        {#each "poetic" as letter, i (`poetic-${letter}-${i}`)}
          <div class="poetic">
            <img src="/propaganda/letters/{letter}.png" alt={letter} />
          </div>
        {/each}
      </PropaGrid>

      <!-- PLUMES POETIC -->
      <PropaCentric
        container={poeticContainer}
        timeline={poeticTimeline}
        id={"poetic-centric"}
        radius={90}
        style={"mix-blend-mode: multiply; align-self : center;"}
        cx={50}
        cy={50}
      >
        {#each { length: 3 } as _, i (`feather-${i}`)}
          <CentricChild
            angle={120 * i}
            animation={true}
            duration={7}
            loop={true}
            ease={"linear"}
          >
            <div class="feathers">
              <img class="feather-img" alt="" src="/propaganda/feather.png" />
            </div>
          </CentricChild>
        {/each}
      </PropaCentric>
    </Proparent>

    <!-- ANCHOR FISH ____________________________________________________________________________________________________ -->
    <Proparent
      {aspectRatio}
      scrollConfig={{ scrub: 2 }}
      zIndex={3}
      id={"fish"}
      bind:container={fishContainer}
      bind:timeline={fishTimeline}
      end={"+=250%"}
    >
      <PropaMask
        container={fishContainer}
        timeline={fishTimeline}
        id="mask-test"
        styles={{ opacity: 1 }}
        clipPath={true}
        fontSize={isMobile ? 200 : 1000}
        zIndex={4}
        font={"mostra-nuova"}
        fillColor={"white"}
        text={isMobile ? "O\nR" : "OR"}
        overlayOpacity={0}
        onScroll={onScrolls.retrochic}
      >
        <!-- ANCHOR  RETROCHIC ___________________________________________________________________________-->

        {#snippet maskBg()}
          <div class="retrochic-container flexed">
            <img class="retrochic" src="/pg-bg.png" alt="retrochic" />
          </div>
          <PropaGrid
            container={fishContainer}
            grid={isMobile ? [4, 6] : [6, 5]}
            cellOverflow={"visible"}
            background={"black"}
            id={"retrochic-grid"}
            animations={anims.retrochic}
            height={"100vh"}
          >
            {#each { length: isMobile ? 24 : 30 } as _, i (`retrochic-${isMobile ? "mobile" : "desktop"}-${i}`)}
              <div
                class="retrochic-element"
                style="opacity:{0.25 + Math.random() * 0.5}"
              >
                <img src="pg-fg.png" alt="texture" class="retrochic-img" />
              </div>
            {/each}
          </PropaGrid>
        {/snippet}
      </PropaMask>
    </Proparent>

    <!-- ANCHOR OR ___________________________________________________________________________-->

    <Proparent end={"+=100%"} bgColor={"black"}></Proparent>
  </div>
</div>

<style>
  .flexed {
    display: flex;
    justify-content: center;
    align-items: center;
  }

  /* NOTE CSS GENERAL */
  /* parent servant à caler un peu tous les titres */
  .title-wrapper {
    --pouet: 2.2em;
    display: flex;
    flex-flow: column wrap;
    justify-content: center;
    align-items: flex-end;
    z-index: 1;
    right: 0em;
    height: 100vh;
    width: 100vh;
    font-size: var(--pouet);
    top: 0vh;
  }

  .title-wrapper > div {
    position: absolute;
  }

  .title-wrapper.propaganda-title-wrapper {
    display: inline-flex;
    position: absolute;
    z-index: -2;
  }

  .invisible {
    opacity: 0;
  }
  /*  Le sélecteur * cible absolument tout le monde */
  * {
    font-family: "Roboto Flex", sans-serif;
    font-weight: 700;
  }

  /* NOTE CSS INTRO */

  .balles > div {
    overflow: visible;
  }
  .balles {
    position: relative;
    margin-left: 1.2vw;
  }
  .circle-white,
  .circle-black {
    border-radius: 50%;
    width: 50%;
    position: absolute;
    aspect-ratio: 1;
    left: -5px;
  }
  .circle-white {
    background: white;
    transform-origin: 50% 50%;
    z-index: 2;
  }
  .circle-black {
    background: black;
    transform-origin: 70% 70%;
    left: -17%;
    top: 15%;
  }

  #title-propaganda {
    font-size: 2.9rem;
    margin-top: 1%;
    margin-right: 1.5%;
    letter-spacing: -0.1ex;
    font-variation-settings:
      "wght" 515,
      "wdth" 115;
    color: black;
  }
  #title-propaganda,
  #punch-line {
    font-family: Acumin Variable Concept;
  }
  #punch-line {
    letter-spacing: -0.1ex;
    font-size: 0.85rem;
    font-variation-settings:
      "wght" 115,
      "wdth" 115;
    position: absolute;
    left: 7px;
    top: -12px;
  }

  /* Intro : image de fond, précédé de :global() car l'élément est défini dans un autre fichier */
  :global(#propa-1-grid) {
    background: url(/propaganda/p1-bg.jpg) repeat;
  }

  /* NOTE CSS WHETHER YOU LIKE IT */

  #title-whether {
    mix-blend-mode: difference;
    z-index: 5;
    display: flex;
    width: 100%;
    font-size: 100px;
    justify-content: center;
    align-items: center;
    opacity: 0;
    visibility: hidden;
    mix-blend-mode: difference;
    align-self: center;
    color: white;
    font-variation-settings: "wght" 600;
    white-space: nowrap;
  }

  /* NOTE CSS MINIMALIST */

  /* Le groupe contenant les lignes */
  .lignes {
    min-height: 20vh;
    transform: scale(0);
  }
  /* Le parent de chaque ligne */
  .ligne {
    width: 10%;
    display: flex;
    flex-flow: column wrap;
    height: 100%;
    justify-content: center;
  }
  /* La ligne */
  .ligne span {
    display: flex;
    width: 120%;
    height: 12.5%;
    background: white;
    /* border-radius: 50px; */
  }
  #title-minimalist {
    font-variation-settings:
      "wght" var(--fwgt),
      "wdth" var(--fwdt);
    color: white;
    font-stretch: 100%;
    justify-self: center;
  }

  .typo-svg {
    fill: #3f3b05;
    max-width: 100%;
    max-height: 100%;
  }

  /* NOTE CSS POETIC */

  .feathers img {
    min-width: 4vw;
    max-width: 8vw;
    /* filter : drop-shadow(30px 40px 20px #4217); */
  }

  .feathers {
    position: relative;
  }

  /* Intro : image de fond, précédé de :global() car l'élément est défini dans un autre fichier */
  :global(#propa-3-poetic > .propaganda-wrapper_image) {
    background: url(/propaganda/p3-bg.jpg) repeat-y;
    height: 130%;
    background-size: cover;
  }

  /* NOTE CSS RETROCHIC */

  :global(.retrochic-grid) {
    opacity: 0;
  }
  .retrochic-container {
    position: absolute;
    top: 50%;
    left: 50%;
    z-index: 4;
    transform: translate(-50%, -50%);
    width: 100%;
    height: 100%;
    opacity: 0;
  }

  .retrochic-container > img {
    max-width: 90vw;
  }

  /* :global(#propa-retrochic > .propaganda-wrapper_image) {
        background: url(/../pg-bg.png) no-repeat center;
        background-size: calc(100% - 200px)!important;
    } */

  /* NOTE CSS TYPOGRAPHIC */

  #title-typographic {
    align-self: center;
    margin-top: -0.9ch;
    margin-left: -0.3ch;
    font-size: 19vmin;
  }
  #title-typographic > span {
    font-family: "didoni-urw", serif;
    color: #3f3b05;
    font-weight: 100;
    letter-spacing: -0.22ch;
  }

  /* NOTE CSS CHEESY */

  :global(#propa-cheesy > .propaganda-wrapper_image) {
    left: -10%;
  }
  :global(#reverberes, #palmiers) {
    align-content: flex-end;
    justify-content: flex-end;
    flex-flow: nowrap;
  }
  .reverbere,
  .palmier {
    align-self: self-end;
    margin-right: 4vw;
  }

  /* NOTE NESTED OR */

  :global(#mask-test text) {
    font-family: "mostra-nuova" !important;
    font-weight: 800;
  }
  :global(#propa-mask) {
    will-change: transform;
  }

  /* NOTE CSS FISH */

  #mask-opening-top {
    display: flex;
    place-self: flex-end;
    align-self: flex-end;
    position: absolute;
    top: 0vh;
    transform: rotate(180deg);
  }
  #mask-opening-bottom {
    display: flex;
    place-self: flex-start;
    align-self: flex-start;
    position: absolute;
    bottom: 0vh;
  }
  #typo-container {
    position: absolute;
    flex-flow: column wrap;
    display: flex;
    place-self: center;
    color: black;
    top: 8vmax;
  }

  /* NOTE CSS BREAKPOINTS MOBILE */

  @media (max-width: 768px) and (orientation: portrait) {
    #title-whether {
      white-space: break-spaces;
      text-align: center;
    }
    .title-wrapper.propaganda-title-wrapper {
      width: 100vw;
      align-items: center;
      justify-content: center;
    }
    .title-wrapper > div {
      align-self: center;
      margin-right: 0em;
    }
    #title-propaganda {
      left: 50%;
      transform: translateX(-50%);
      margin-right: 0;
      width: max-content;
      text-align: center;
    }
    #punch-line {
      left: 50%;
      transform: translateX(-50%);
      width: max-content;
      text-align: center;
    }
    .feathers {
      width: 25%;
      height: 10%;
    }
    .feathers img {
      min-width: 15vw;
      max-width: 40vw;
      /* filter : drop-shadow(30px 40px 20px #4217); */
    }
    #title-typographic > span {
      font-size: 8.6vh;
    }
    #mask-opening-top {
      border-bottom: 40vh solid white;
    }
    #mask-opening-bottom {
      border-bottom: 40vh solid white;
    }
    .poetic {
      height: 40vw;
      width: 30vw;
    }
    .poetic > * {
      height: 100%;
      width: auto;
    }

    .retrochic-element > img {
      width: 150%;
      height: 150%;
    }
  }
  @media (min-width: 768px) and (orientation: landscape) {
    #title-propaganda {
      justify-self: flex-end;
      margin-right: 1em;
      color: black;
    }
  }

  @keyframes rotating {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }
</style>

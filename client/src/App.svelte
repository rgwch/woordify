<script lang="ts">
  import { openModal } from "svelte-modals";

  import Modal from "./lib/dialogs/Modal.svelte";
  import Buttons from "./lib/components/Buttons.svelte";
  import Topmenu from "./lib/components/Topmenu.svelte";
  import { fetchWords } from "./lib/services/calculations";
  import Score from "./lib/components/Score.svelte";
  import Foundwords from "./lib/components/Foundwords.svelte";
  import Input from "./lib/components/Input.svelte";
  import Actions from "./lib/components/Actions.svelte";
  import Clipboard from "./lib/components/Clipboard.svelte";
  import {
    gameDef,
    type IGameDef,
    shuffle,
    getScore,
    found,
    points,
    currentLevel,
    allFound,
  } from "./lib/services/stores";
  import sint from "./assets/sint.txt";
  import Allfound from "./lib/dialogs/Allfound.svelte";

  let ready = false;
  let error = "";
  let allFoundDisplayed = false;

  async function loadGame() {
    try {
      const def: IGameDef = await fetchWords();
      const stored = getScore();
      if (stored.id != def.centralLetter + def.chars.join("")) {
        // server changed game definitions, so clear stored data
        found.set([]);
        points.set(0);
        currentLevel.set(0);
      }
      gameDef.maxPoints = def.maxPoints;
      gameDef.centralLetter = def.centralLetter;
      gameDef.chars = def.chars;
      gameDef.possibilities = def.possibilities;
      shuffle();
      ready = true;
    } catch (err) {
      error = err;
    }
  }

  async function sinterklaas() {
    const text = await fetch(sint);
    openModal(Modal, { title: "Sinterklaas 2022", message: await text.text() });
  }
  allFound.subscribe((tr) => {
    if (tr && !allFoundDisplayed) {
      openModal(Allfound);
      allFoundDisplayed = true;
    }
  });
  window.addEventListener("pageshow", (event) => {
    loadGame();
  });
  document.addEventListener("visibilitychange",(event)=>{
    if(document.visibilityState=='visible'){
      loadGame()
    }
  })
</script>

<main>
  {#if ready}
    <div class="parent">
      <div class="item"><Topmenu /></div>
      <div class="item"><Score /></div>
      <div class="item"><Foundwords /></div>
      <div class="item"><Input /></div>
      <div class="item"><Buttons /></div>
      <div class="item"><Actions /></div>
      <div class="item"><Clipboard /></div>
      <!-- div class="item">
        <img
          src="astrid.jpg"
          alt="deko"
          width="75px"
          on:click={sinterklaas}
          on:keypress={sinterklaas}
        />
      </div -->
    </div>
  {:else}
    <p>...even wachten a.u.b....</p>
  {/if}
  {#if error}
    <h1>Sorry, er is iets mis gegaan</h1>
    <p>{error}</p>
  {/if}
</main>

<style>
  .parent {
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  .item {
    margin: 3px;
  }
</style>

<script lang="ts">
  import { Modals, openModal } from "svelte-modals";
  import Champion from "../dialogs/Champion.svelte";
  import Found from "../dialogs/Modal.svelte";
  import {
    currentLevel,
    points,
    levelNames,
    gameDef,
  } from "../services/stores";
  const MAXLEVEL = 9;
  let championDisplayed = false;
  let level = gameDef.maxPoints / 10 / MAXLEVEL;
  const mp = gameDef.maxPoints;
  let multiplier = 6.5;
  if (mp < 200) {
    multiplier = 8;
  } else if (mp > 800) {
    multiplier = 5.5;
  } else if (mp > 1000) {
    multiplier = 4;
  }
  level = Math.round(multiplier * level);
  let needed = [
    0,
    level,
    2 * level,
    3 * level,
    4 * level,
    5 * level,
    6 * level,
    7 * level,
    8 * level,
  ];
  let diff = needed[1];

  points.subscribe((pts) => {
    let l = needed.findIndex((i) => pts < i) - 1;
    if (l < 0) {
      // none found
      l = MAXLEVEL - 1;
      diff = 0;
    } else {
      diff = Math.round(needed[l + 1] - pts);
    }
    currentLevel.set(l);
    if (l == MAXLEVEL - 1) {
      if (!championDisplayed) {
        championDisplayed = true;
        openModal(Champion);
      }
    }
  });

  function createScoreList() {
    let ret = '<table width="100%">';
    for (let i = 0; i < MAXLEVEL; i++) {
      ret += `<tr><td style="text-align:left">${levelNames[i]}:</td><td style="text-align:right">${needed[i]} pt</td></tr>`;
    }
    ret += "</table>";
    return ret;
  }
  function openLevels() {
    openModal(Found, { title: "Scores", message: createScoreList() });
  }
</script>

<template>
  <div>
    <Modals />
    <div class="left compact">
      <button class="compact" on:click={openLevels}>
        Level: {$currentLevel + 1} ({levelNames[$currentLevel]}) -
        <b style="font-size:large">{$points}</b>
        {#if diff > 0}
          - {diff}
          {diff == 1 ? "punt" : "punten"} tot {levelNames[$currentLevel + 1]}
        {:else}**** Hoogste level! ****{/if}
      </button>
    </div>
  </div>
</template>

<style>
  .left {
    width: 100%;
  }
  .compact {
    padding: 0;
    padding-bottom: 0;
    margin: 0;
    margin-bottom: 0;
    font-size: 9pt;
    font-family: Arial, Helvetica, sans-serif;
    text-align: left;
  }
</style>

<script lang="ts">
  export let isOpen: boolean;
  import { cookiesAllowed } from '../services/stores';
  import { closeModal } from 'svelte-modals';
  import cookies from '../../assets/cookies_nl.txt';
  let disclaimer = '';
  fetch(cookies).then(async (txt) => {
    disclaimer = await txt.text();
  });
  function toggle() {
    $cookiesAllowed = !$cookiesAllowed;
  }
</script>

<template>
  {#if isOpen}
    <div role="dialog" class="modal">
      <div class="contents">
        <div>
          {@html disclaimer}
        </div>
        <div>
          <label for="allow">Opslaan toestaan</label>
          <input
            type="checkbox"
            name="allow"
            on:click={toggle}
            bind:checked={$cookiesAllowed}
          />
          <button on:click={closeModal}>OK</button>
        </div>
      </div>
    </div>
  {/if}
</template>

<style>
  .modal {
    position: fixed;
    top: 10px;
    bottom: 10px;
    left: 10px;
    right: 10px;
    padding: 10px;
    overflow-y: auto;
  }
  .contents {
    min-width: 240px;
    border-radius: 6px;
    border-color: blue;
    border-style: solid;
    padding: 13px;
    background-color: cornsilk;
    color:black;
    overflow: auto;
    margin: 0 auto;
    max-width: 600px;
  }
</style>

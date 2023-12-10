<script>
  import { closeModal } from "svelte-modals";
  export let isOpen;
</script>

<template>
  {#if isOpen}
    <div role="dialog" class="modal">
      <div
        on:click={closeModal}
        on:keypress={closeModal}
        style="overflow-y:scroll"
      >
        <h1>Ongeloovelijk!</h1>
        <h3>Je hebt <b style="color:red">ALLE</b> woorden gevonden!</h3>
        <img src="/krone.png" alt="Krone" />
      </div>
      <button on:click={closeModal}>OK</button>
     
    </div>
  {/if}
</template>

<style>
  .modal {
    position: fixed;
    top: 20px;
    bottom: 20px;
    left: 20px;
    right: 20px;
    padding: 20px;
    background-color: cornsilk;
    color: black;
    border-radius: 6px;
    border-color: blue;
    border-style: solid;
  }
</style>

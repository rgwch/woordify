<script>
    import { closeModal } from 'svelte-modals';
    export let isOpen;
</script>

<template>
    {#if isOpen}
        <div role="dialog" class="modal">
            <div>
                <img src="lorbeerkranz.png" alt="Champion" width="200px" />
            </div>

            <div
                on:click={closeModal}
                on:keypress={closeModal}>
                <img src="champion.jpg" alt="champion" width="150px" />
                <h1 style="color:red">Je hebt het hoogste niveau bereikt!</h1>
                <button on:click={closeModal}>OK</button>
            </div>
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
        overflow-y: auto;
        color:black;
        border-radius: 6px;
        border-color: blue;
        border-style: solid;
    }
</style>

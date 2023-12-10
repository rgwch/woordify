<script>
    import { closeModal } from "svelte-modals";
    export let isOpen;
    export let title;
    export let message;
</script>

<template>
    {#if isOpen}
        <div role="dialog" class="modal">
            <div class="contents">
                <h2>{title}</h2>
                <div on:click={closeModal} on:keypress={closeModal} style="overflow-y:auto">{@html message}</div>
                <div class="actions">
                    <button on:click={closeModal}>OK</button>
                </div>
            </div>
        </div>
    {/if}
</template>

<style>
   
    .modal {
        position: fixed;
        top: 20px;
        bottom: 20px;
        right: 20px;
        left: 10px;
        overflow-y:auto;
    }

    .contents {
        min-width: 240px;
        border-radius: 6px;
        border-color: blue;
        border-style: solid;
        padding: 16px;
        background-color: cornsilk;
        color: black;
        opacity: 1.0;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        pointer-events: auto;
        overflow: auto;
        margin: 0 auto;
        max-width: 600px;
    
    }

    h2 {
        text-align: center;
        font-size: 24px;
    }

    .actions {
        margin-top: 32px;
        display: flex;
        justify-content: flex-end;
    }
</style>

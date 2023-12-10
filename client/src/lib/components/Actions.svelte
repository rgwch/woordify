<script lang="ts">
    import { checkWord, inputLine } from '../services/inputline';
    import { shuffle } from '../services/stores';
</script>

<template>
    <div>
        <button class="action" on:click|preventDefault={checkWord}>Invoer</button>
        <button on:click|preventDefault={shuffle}
            ><img src="/shuffle.jpg" alt="shuffle" height="16px" /></button
        >
        <button
            class="action"
            on:click|preventDefault={() => {
                inputLine.update((prev) => prev.substring(0, prev.length - 1));
            }}>Wissen</button
        >
    </div>
</template>

<style>
    .action {
        border-radius: 8px;
        margin-top: 10px;
    }
</style>

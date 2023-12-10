<script lang="ts">
    import { inputLine, checkWord } from "../services/inputline";
    import { gameDef } from "../services/stores";
    function handleKeyDown(event:any) {
        if (event.code == "Enter") {
            checkWord();
        } else if (event.code == "Escape") {
            inputLine.set("");
        } else if (
            event.code == "Backspace" ||
            event.code == "ArrowLeft" ||
            event.code == "ArrowRight"
        ) {
        } else {
            if (!gameDef.chars.includes(event.key.toUpperCase())) {
                event.preventDefault();
            }
        }
    }
</script>

<!-- svelte:window on:keydown={handleKeyDown} / -->

<template>
    <div style="width:100%">
        <input
            class="enter"
            type="text"
            bind:value={$inputLine}
            on:keydown={handleKeyDown}
        />
        <button
            on:click={() => {
                inputLine.set("");
            }}>X</button
        >
    </div>
</template>

<style>
    .enter {
        border: none;
        text-align: center;
        border-bottom: 2px solid black;
        margin-bottom: 8px;
        width: 80%;
        font-size: 20px;
    }
</style>

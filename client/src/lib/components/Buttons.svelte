<script lang="ts">
    import { SvelteToast } from "@zerodevx/svelte-toast";
    import { add } from "../services/inputline";
    import { gameDef, circle } from "../services/stores";
</script>

<template>
    <div>
        <SvelteToast />

        <div>
            <button class="outer" on:click|preventDefault={() => add($circle[0])}
                >{$circle[0]}</button
            >
            <button class="outer" on:click|preventDefault={() => add($circle[1])}
                >{$circle[1]}</button
            >
        </div>
        <div>
            <button class="outer" on:click|preventDefault={() => add($circle[2])}
                >{$circle[2]}</button
            >
            <button class="inner" on:click|preventDefault={() => add(gameDef.centralLetter)}
                >{gameDef.centralLetter}</button
            >
            <button class="outer" on:click|preventDefault={() => add($circle[3])}
                >{$circle[3]}</button
            >
        </div>
        <div>
            <button class="outer" on:click|preventDefault={() => add($circle[4])}
                >{$circle[4]}</button
            >
            <button class="outer" on:click|preventDefault={() => add($circle[5])}
                >{$circle[5]}</button
            >
        </div>
    </div>
</template>

<style>
    .outer {
        background-color: #ff9900;
        border: none;
        color: black;
        padding: 1px;
        text-align: center;
        display: inline-block;
        font-size: 45px;
        cursor: pointer;
        border-radius: 50%;
        height: 80px;
        width: 80px;
    }
    .inner {
        background-color: #ffcc80;
        border: none;
        color: black;
        padding: 1px;
        text-align: center;
        display: inline-block;
        font-size: 45px;
        cursor: pointer;
        border-radius: 50%;
        height: 80px;
        width: 80px;
    }
    :root {
        --toastBackground: red;
    }
</style>

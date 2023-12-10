<script lang="ts">
    import {currentLevel,levelNames,found,currentDate,points,toastDuration} from '../services/stores'
    import {isPangramm} from '../services/calculations'
    import { toast } from "@zerodevx/svelte-toast";

    function copyWords() {
        const res = $found
            .map((s) => s.charAt(0) + s.substring(1).toLowerCase()).sort()
            .join(", ")
        navigator.clipboard.writeText(res);
        toast.push("gekopieert", {
            duration: toastDuration / 2,
            theme: {
                "--toastBackground": "#c9de9e",
                "--toastColor": "blue",
            },
        });
    }
    function copyScore() {
        let pangrams = 0;
        let words = 0;
        for (const f of $found) {
            if (isPangramm(f)) {
                pangrams++;
            }
            words++;
        }
        const pg = pangrams == 1 ? "pangramma" : "pangramma's";
        let ret = `Woordify ${currentDate}: Level ${$currentLevel+1} (${levelNames[$currentLevel]}), ${words} woorden en ${pangrams} ${pg} gevonden. ${$points} punten.`;
        navigator.clipboard.writeText(ret);
        toast.push("gekopieerd", {
            duration: toastDuration / 2,
            theme: {
                "--toastBackground": "#c9de9e",
                "--toastColor": "blue",
            },
        });
    }
</script>
<template>
    <div>
        <button class="action" on:click|preventDefault={copyWords}>Woorden kopiëren</button>
        <button class="action" on:click|preventDefault={copyScore}>Score kopiëren</button>
    </div>
</template>
<style>
    .action {
        border-radius: 8px;
        margin-top: 10px;
    }
</style>

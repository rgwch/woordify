<script lang="ts">
    import { found } from '../services/stores';
    import { isPangramm } from '../services/calculations';
    import { openModal } from 'svelte-modals';
    import Found from '../dialogs/Modal.svelte';

    $: lastWords = () => {
        let ret = '';
        let i = $found.length - 1;
        let line = 0;
        while (line < 40 && i >= 0) {
            const s = $found[i--];
            const cs = s.charAt(0) + s.slice(1).toLowerCase();
            if (isPangramm(s)) {
                ret += '&nbsp;<span style="color:orange;">' + cs + '</span>';
            } else {
                ret += ' ' + cs;
            }
            line += cs.length;
        }
        return ret;
    };
    function showAll() {
        const fcopy=[...$found]
        const w = fcopy.length == 1 ? 'woord' : 'woorden';
        openModal(Found, {
            title: `${fcopy.length} ${w} gevonden`,
            message: fcopy
                .sort()
                .map((e) => {
                    let ret = e.charAt(0) + e.slice(1).toLowerCase();
                    if (isPangramm(e)) {
                        ret = '<span style="color:orange;">' + ret + '</span>';
                    }
                    return ret;
                })
                .join(', '),
        });
    }
</script>

<template>
    <div class="wordlist" on:click={showAll} on:keypress={showAll}>
        {@html lastWords()}
    </div>
</template>

<style>
    .wordlist {
        border: 1px solid orange;
        border-radius: 8px;
        width: 100%;
        font-size: 9pt;
        margin: 0;
        padding: 0;
        padding-bottom: 0;
        margin-bottom: 0;
        max-height: fit-content;
    }
</style>

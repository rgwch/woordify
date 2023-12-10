<script lang="ts">
    import { Modals, openModal } from 'svelte-modals';
    import { solutions } from '../services/calculations';
    import Modal from '../dialogs/Modal.svelte';
    import prosa from '../../assets/prosa_nl.txt';
    import Cookies from '../dialogs/Cookies.svelte';
    import { cookiesAllowed, statistics } from '../services/stores';
    import pck from '../../../package.json';

    let menuOpen = false;
    function toggleMenu() {
        menuOpen = !menuOpen;
    }

    async function about() {
        menuOpen = false;
        const result = await fetch(prosa);
        let text = await result.text();
        text+="<p style=\"font-size:small;text-align:right\">Woordify v. "+pck.version+" </p>";
        if (result.ok) {
            openModal(Modal, {
                title: 'Woordify',
                message: text,
            });
        }
    }
    function stats() {
        menuOpen = false;
        let ret = '<table width="100%">';
        ret += `<tr><td style="text-align:left">Dagen gespeeld:</td><td style="text-align:right">${statistics.count}</td></tr>`;
        ret += `<tr><td style="text-align:left">Gemiddelde level:</td><td style="text-align:right">${statistics.averageLevel}</td></tr>`;
        ret += `<tr><td style="text-align:left">Gemiddelde punten:</td><td style="text-align:right">${statistics.averagePoints}</td></tr>`;
        ret += '</table>';
        openModal(Modal, { title: 'Statistieken', message: ret });
    }

    async function showSolutions() {
        menuOpen = false;
        const sols = await solutions();
        openModal(Modal, { title: 'Oplossing vorige keer', message: sols });
    }
    async function cookies() {
        menuOpen = false;
        openModal(Cookies);
    }
    if (!cookiesAllowed.get()) {
        cookies();
    }
</script>

<template>
    <div style="position:relative">
        <button on:click={toggleMenu}>
            <img
                src="/hamburger_icon.png"
                alt="menu"
                width="32px"
                style="border-radius:50%"
            />
        </button>
        {#if menuOpen}
            <ul class="menu">
                <li
                    class="menuitem"
                    on:click={showSolutions}
                    on:keypress={(event) => {
                        if (event.code == 'O') {
                            showSolutions;
                        }
                    }}
                >
                    Oplossing vorige keer
                </li>
                <li
                    class="menuitem"
                    on:click={stats}
                    on:keypress={(event) => {
                        if (event.code == 's') {
                            stats;
                        }
                    }}
                >
                    Statistieken
                </li>
                <li
                    class="menuitem"
                    on:click={about}
                    on:keypress={(event) => {
                        if (event.code == 'u') {
                            about;
                        }
                    }}
                >
                    <span>Regels</span>
                </li>
                <li
                    class="menuitem"
                    on:click={cookies}
                    on:keypress={(event) => {
                        if (event.code == 'd') {
                            cookies;
                        }
                    }}
                >
                    Privacy
                </li>
            </ul>
        {/if}
    </div>
    <Modals />
</template>

<style>
    .menu {
        display: block;
        position: absolute;
        z-index: 100;
        left: 40px;
        width: 180px;
        top: 30px;
        background-color: azure;
        color: black;
        border: 1px solid orange;
        border-radius: 4px;
    }
    .menuitem {
        position: relative;
        padding-top: 10px;
        list-style-type: none;
        font-size: larger;
        cursor: pointer;
        vertical-align: middle;
        text-align: left;
        height: 50px;
    }
    .menuitem:hover {
        background-color: blue;
        color: white;
    }
</style>

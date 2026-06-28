import { DEV_CONFIG } from "../config.js";

const STORAGE_KEY = "transitRadarDeveloperMode";

export function initializeDeveloperMode() {
    DEV_CONFIG.useMockData =
        localStorage.getItem(STORAGE_KEY) === "true";

    document.addEventListener("keydown", event => {
        if (event.repeat) {
            return;
        }

        const target = event.target;

        if (
            target instanceof HTMLInputElement ||
            target instanceof HTMLTextAreaElement ||
            target instanceof HTMLSelectElement ||
            target.isContentEditable
        ) {
            return;
        }

        const isShortcut =
            event.ctrlKey &&
            event.shiftKey &&
            event.key.toLowerCase() === "d";

        if (!isShortcut) {
            return;
        }

        event.preventDefault();

        DEV_CONFIG.useMockData = !DEV_CONFIG.useMockData;

        localStorage.setItem(
            STORAGE_KEY,
            String(DEV_CONFIG.useMockData)
        );

        console.log(
            `Developer Mode ${DEV_CONFIG.useMockData ? "enabled" : "disabled"}`
        );

        location.reload();
    });
}
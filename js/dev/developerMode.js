import { DEV_CONFIG } from "../config.js";

const STORAGE_KEY = "transitRadarDeveloperMode";

export function initializeDeveloperMode() {
    DEV_CONFIG.useMockData = localStorage.getItem(STORAGE_KEY) === "true";

    document.addEventListener("keydown", event => {
        if (event.repeat || event.key.toLowerCase() !== "d") {
            return;
        }

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
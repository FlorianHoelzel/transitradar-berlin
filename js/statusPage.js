import { API_STATUS_CONFIG } from "./config.js";

const statusText = document.getElementById("overallStatusText");
const statusDot = document.getElementById("overallStatusDot");
const refreshButton = document.getElementById("refreshStatus");

const vbbCard = document.querySelector('[data-provider-card="vbb"]');
const vbbStatus = document.querySelector('[data-provider-status="vbb"]');
const vbbLatency = document.querySelector('[data-provider-latency="vbb"]');
const vbbMessage = document.querySelector('[data-provider-message="vbb"]');
const previewMode = new URLSearchParams(window.location.search).get("preview");

function setClassState(element, state) {
    if (!element) {
        return;
    }

    element.classList.remove("checking", "online", "offline");
    element.classList.add(state);
}

function formatTime(date) {
    return date.toLocaleTimeString("en-GB", {
        hour: "2-digit",
        minute: "2-digit"
    });
}

async function fetchWithTimeout(url, timeout = API_STATUS_CONFIG.timeout) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);
    const startedAt = performance.now();

    try {
        const response = await fetch(url, {
            signal: controller.signal,
            cache: "no-store"
        });

        return {
            ok: response.ok,
            latency: Math.round(performance.now() - startedAt)
        };
    } catch {
        return {
            ok: false,
            latency: null
        };
    } finally {
        clearTimeout(timeoutId);
    }
}

function renderChecking() {
    setClassState(statusDot, "checking");
    setClassState(vbbCard, "checking");
    setClassState(vbbStatus, "checking");

    statusText.textContent = "Checking services";
    vbbStatus.textContent = "Checking";
    vbbLatency.textContent = "--";
    vbbMessage.textContent = "Running a fresh availability check against the VBB transport API.";
    refreshButton.disabled = true;
}

function renderVbbStatus(isOnline, averageLatency) {
    const state = isOnline ? "online" : "offline";
    const checkedAt = formatTime(new Date());

    setClassState(statusDot, state);
    setClassState(vbbCard, state);
    setClassState(vbbStatus, state);

    statusText.textContent = isOnline
        ? "All active services operational"
        : "VBB service disruption";

    vbbStatus.textContent = isOnline ? "Operational" : "Unavailable";
    vbbLatency.textContent = averageLatency ? `${averageLatency} ms` : "No response";
    vbbMessage.textContent = isOnline
        ? `VBB probes are responding normally. Last checked at ${checkedAt}.`
        : `VBB probes did not complete successfully. Last checked at ${checkedAt}.`;

    refreshButton.disabled = false;
}

async function checkVbbStatus() {
    if (previewMode === "online") {
        renderVbbStatus(true, 184);
        vbbMessage.textContent = "Preview mode: VBB probes are responding normally.";
        refreshButton.disabled = false;
        return;
    }

    renderChecking();

    const results = await Promise.all(
        API_STATUS_CONFIG.primaryTestUrls.map(url => fetchWithTimeout(url))
    );

    const isOnline = results.every(result => result.ok);
    const successfulLatencies = results
        .map(result => result.latency)
        .filter(latency => Number.isFinite(latency));

    const averageLatency = successfulLatencies.length
        ? Math.round(
            successfulLatencies.reduce((total, latency) => total + latency, 0)
            / successfulLatencies.length
        )
        : null;

    renderVbbStatus(isOnline, averageLatency);
}

refreshButton.addEventListener("click", () => {
    checkVbbStatus();
});

checkVbbStatus();

setInterval(() => {
    checkVbbStatus();
}, API_STATUS_CONFIG.refreshInterval);

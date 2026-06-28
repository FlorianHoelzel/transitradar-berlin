const API_TEST_URLS = [
    "https://v6.bvg.transport.rest/stops?results=1",
    "https://v6.vbb.transport.rest/radar?north=52.55&south=52.50&east=13.45&west=13.35&results=1&frames=1"
];

let apiStatus = "checking";
let lastCheckedAt = null;

function getStatusText() {
    if (apiStatus === "online") return "API Online";
    if (apiStatus === "offline") return "API unavailable";
    return "Checking API...";
}

function getStatusClass() {
    return `api-status ${apiStatus}`;
}

function updateApiStatusUI() {
    const statusElement = document.getElementById("apiStatus");

    if (!statusElement) {
        return;
    }

    statusElement.className = getStatusClass();

    statusElement.innerHTML = `
        <span class="api-status-dot"></span>
        <div>
            <div class="api-status-label">${getStatusText()}</div>
            <div class="api-status-time">
                ${lastCheckedAt ? `Last checked ${lastCheckedAt}` : "Waiting for response"}
            </div>
        </div>
    `;
}

async function fetchWithTimeout(url, timeout = 6000) {
    const controller = new AbortController();

    const timeoutId = setTimeout(() => {
        controller.abort();
    }, timeout);

    try {
        const response = await fetch(url, {
            signal: controller.signal
        });

        return response.ok;
    } catch {
        return false;
    } finally {
        clearTimeout(timeoutId);
    }
}

export function createApiStatusElement() {
    const element = document.createElement("div");
    element.id = "apiStatus";
    element.className = getStatusClass();

    element.innerHTML = `
        <span class="api-status-dot"></span>
        <div>
            <div class="api-status-label">${getStatusText()}</div>
            <div class="api-status-time">Waiting for response</div>
        </div>
    `;

    return element;
}

export async function checkApiStatus() {
    apiStatus = "checking";
    updateApiStatusUI();

    const results = await Promise.all(
        API_TEST_URLS.map(url => fetchWithTimeout(url))
    );

    const hasWorkingApi = results.some(result => result === true);

    apiStatus = hasWorkingApi ? "online" : "offline";

    lastCheckedAt = new Date().toLocaleTimeString("de-DE", {
        hour: "2-digit",
        minute: "2-digit"
    });

    updateApiStatusUI();
}

export function startApiStatusWatcher() {
    checkApiStatus();

    setInterval(() => {
        checkApiStatus();
    }, 60000);
}
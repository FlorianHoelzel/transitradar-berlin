const API_TEST_URLS = [
    "https://v6.bvg.transport.rest/stops?results=1",
    "https://v6.vbb.transport.rest/radar?north=52.55&south=52.50&east=13.45&west=13.35&results=1&frames=1"
];

let apiStatus = "checking";
let lastCheckedAt = null;

export function getApiStatus() {
    return apiStatus;
}

export function getLastCheckedAt() {
    return lastCheckedAt;
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

export async function checkApiStatus(onStatusChange) {
    apiStatus = "checking";

    if (onStatusChange) {
        onStatusChange(apiStatus);
    }

    const results = await Promise.all(
        API_TEST_URLS.map(url => fetchWithTimeout(url))
    );

    const hasWorkingApi = results.some(result => result === true);

    apiStatus = hasWorkingApi ? "online" : "offline";

    lastCheckedAt = new Date().toLocaleTimeString("de-DE", {
        hour: "2-digit",
        minute: "2-digit"
    });

    if (onStatusChange) {
        onStatusChange(apiStatus);
    }
}

export function startApiStatusWatcher(onStatusChange) {
    checkApiStatus(onStatusChange);

    setInterval(() => {
        checkApiStatus(onStatusChange);
    }, 60000);
}
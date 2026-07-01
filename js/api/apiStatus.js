import { API_STATUS_CONFIG, DEV_CONFIG } from "../config.js";

let apiStatus = "checking";
let lastCheckedAt = null;

export function getApiStatus() {
    return apiStatus;
}

export function getLastCheckedAt() {
    return lastCheckedAt;
}

export function setApiStatus(status) {
    apiStatus = status;
    lastCheckedAt = new Date().toLocaleTimeString("en-GB", {
        hour: "2-digit",
        minute: "2-digit"
    });
}

async function fetchWithTimeout(url, timeout = API_STATUS_CONFIG.timeout) {
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
    if (DEV_CONFIG.useMockData) {
        apiStatus = "mock";
        lastCheckedAt = new Date().toLocaleTimeString("en-GB", {
            hour: "2-digit",
            minute: "2-digit"
        });

        if (onStatusChange) {
            onStatusChange(apiStatus);
        }

        return;
    }

    apiStatus = "checking";

    if (onStatusChange) {
        onStatusChange(apiStatus);
    }

    const primaryResults = await Promise.all(
        API_STATUS_CONFIG.primaryTestUrls.map(url => fetchWithTimeout(url))
    );

    const hasWorkingApi = primaryResults.every(result => result === true);

    if (hasWorkingApi) {
        apiStatus = "online";
    } else {
        const fallbackResults = await Promise.all(
            API_STATUS_CONFIG.fallbackTestUrls.map(url => fetchWithTimeout(url))
        );

        apiStatus = fallbackResults.some(result => result === true)
            ? "fallback"
            : "offline";
    }

    lastCheckedAt = new Date().toLocaleTimeString("en-GB", {
        hour: "2-digit",
        minute: "2-digit"
    });

    if (onStatusChange) {
        onStatusChange(apiStatus);
    }
}

export function startApiStatusWatcher(onStatusChange) {
    checkApiStatus(onStatusChange);

    if (DEV_CONFIG.useMockData) {
        return;
    }

    setInterval(() => {
        checkApiStatus(onStatusChange);
    }, API_STATUS_CONFIG.refreshInterval);
}

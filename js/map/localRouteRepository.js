export async function loadTripsFromLocalData() {
    const response = await fetch("./data/trips.json");

    if (!response.ok) {
        throw new Error("Failed to load local trips data.");
    }

    return await response.json();
}
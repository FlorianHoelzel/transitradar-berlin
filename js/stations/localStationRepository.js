export async function loadStationsFromLocalData() {
    const response = await fetch("./data/stations.json");

    if (!response.ok) {
        throw new Error("Failed to load local stations.");
    }

    return await response.json();
}
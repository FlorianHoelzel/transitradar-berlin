export async function loadDeparturesFromLocalData() {
    const response = await fetch("./data/departures.json");

    if (!response.ok) {
        throw new Error("Failed to load local departures data.");
    }

    return await response.json();
}
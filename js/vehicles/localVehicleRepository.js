export async function loadVehiclesFromLocalData() {
    const response = await fetch("./data/vehicles.json");

    if (!response.ok) {
        throw new Error("Failed to load local vehicles.");
    }

    return await response.json();
}
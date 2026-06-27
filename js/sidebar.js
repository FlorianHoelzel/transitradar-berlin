export function setupSidebar() {
    const sidebarToggle = document.createElement("button");
    sidebarToggle.id = "sidebarToggle";
    sidebarToggle.className = "sidebar-toggle";
    sidebarToggle.type = "button";
    sidebarToggle.setAttribute("aria-label", "Open sidebar");
    sidebarToggle.setAttribute("aria-expanded", "false");
    sidebarToggle.innerHTML = "☰";

    const sidebarOverlay = document.createElement("div");
    sidebarOverlay.id = "sidebarOverlay";
    sidebarOverlay.className = "sidebar-overlay";

    const sidebar = document.createElement("aside");
    sidebar.id = "sidebar";
    sidebar.className = "sidebar";
    sidebar.setAttribute("aria-hidden", "true");

    sidebar.innerHTML = `
        <div class="sidebar-header">
            <div>
                <div class="sidebar-kicker">TransitRadar</div>
                <h2>Menu</h2>
            </div>

            <button id="sidebarClose" class="sidebar-close" type="button" aria-label="Close sidebar">
                ×
            </button>
        </div>

        <nav class="sidebar-nav" aria-label="Sidebar navigation">
            <button class="sidebar-item" type="button">
                <span class="sidebar-item-emoji">⭐</span>
                <span>Favorites</span>
            </button>

            <button class="sidebar-item" type="button">
                <span class="sidebar-item-emoji">⚙️</span>
                <span>Settings</span>
            </button>
        </nav>

        <div class="sidebar-footer">
            <button class="sidebar-item sidebar-about" type="button">
                <span class="sidebar-item-emoji">ℹ️</span>
                <span>About</span>
            </button>
        </div>
    `;

    document.body.append(sidebarToggle, sidebarOverlay, sidebar);

    const sidebarClose = document.getElementById("sidebarClose");

    function openSidebar() {
        sidebar.classList.add("open");
        sidebarOverlay.classList.add("open");
        sidebarToggle.classList.add("hidden");
        sidebarToggle.setAttribute("aria-expanded", "true");
        sidebar.setAttribute("aria-hidden", "false");
    }

    function closeSidebar() {
        sidebar.classList.remove("open");
        sidebarOverlay.classList.remove("open");
        sidebarToggle.classList.remove("hidden");
        sidebarToggle.setAttribute("aria-expanded", "false");
        sidebar.setAttribute("aria-hidden", "true");
    }

    sidebarToggle.addEventListener("click", openSidebar);
    sidebarClose.addEventListener("click", closeSidebar);
    sidebarOverlay.addEventListener("click", closeSidebar);

    document.addEventListener("keydown", event => {
        if (event.key === "Escape") {
            closeSidebar();
        }
    });
}
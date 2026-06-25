import { getBadgeStyle } from "./lineColors.js";

export function createLineBadge(lineName) {
    if (!lineName) {
        return `<span class="line-badge unknown-badge">?</span>`;
    }

    const name = lineName.toString().trim();

    const style = getBadgeStyle(name);

    return `
        <span
            class="line-badge"
            style="
                background: ${style.background};
                color: ${style.color};
                border: ${style.border};
            "
        >
            ${name}
        </span>
    `;
}
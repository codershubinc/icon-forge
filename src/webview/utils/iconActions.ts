import { vscode } from "../vscode";

export type IconAction = "copy" | "insert";

export type IconAsset = {
    name: string;
    isBrand: boolean;
    downloadUrl: string;
};

async function fetchIconSvg(item: IconAsset, overrideColor: string): Promise<string> {
    const res = await fetch(item.downloadUrl);
    let svgText = await res.text();

    if (!item.isBrand) {
        svgText = svgText.replace(/fill="[^"]*"/g, `fill="${overrideColor}"`);
    }

    return svgText;
}

export async function handleIconCopy(
    item: IconAsset,
    overrideColor: string = "currentColor",
    action: IconAction = "insert",
    onComplete?: () => void
) {
    try {
        const svgText = await fetchIconSvg(item, overrideColor);

        vscode.postMessage({
            command: action === "insert" ? "insertCode" : "copyCode",
            text: svgText,
        });

        onComplete?.();
    } catch (e) {
        console.error(`Failed to fetch SVG for ${action}`, e);
    }
}

export function handleIconCopyUri(item: IconAsset, onComplete?: () => void) {
    try {
        vscode.postMessage({
            command: "copyCode",
            text: item.downloadUrl,
        });

        onComplete?.();
    } catch (e) {
        console.error("Failed to copy URI", e);
    }
}

export async function handleIconDownload(
    item: IconAsset,
    overrideColor: string = "currentColor",
    onComplete?: () => void
) {
    try {
        const svgText = await fetchIconSvg(item, overrideColor);

        vscode.postMessage({
            command: "downloadCode",
            text: svgText,
            fileName: `${item.name}.svg`,
        });

        onComplete?.();
    } catch (e) {
        console.error("Failed to download SVG", e);
    }
}

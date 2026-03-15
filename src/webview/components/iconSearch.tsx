import React, { useState, useEffect } from "react";
import { vscode } from "../vscode";
import IconGrid from "./IconGrid";

export default function IconSearch() {
    const [query, setQuery] = useState("user");
    const [icons, setIcons] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [totalFound, setTotalFound] = useState(0);

    // Debounce the search input
    useEffect(() => {
        const timer = setTimeout(() => {
            if (query.trim().length > 0) {
                searchIcons(query);
            } else {
                setIcons([]);
                setTotalFound(0);
            }
        }, 400);
        return () => clearTimeout(timer);
    }, [query]);

    const searchIcons = async (searchQuery: string) => {
        setLoading(true);
        try {
            // Limit to 64 icons for a clean, fast grid
            const res = await fetch(
                `https://api.iconify.design/search?query=${searchQuery}&limit=64`
            );
            const data = await res.json();

            setTotalFound(data.total || 0);

            const formattedIcons = (data.icons || []).map((iconStr: string) => {
                const [prefix, name] = iconStr.split(":");


                const isBrand = ["logos", "devicon", "skill-icons", "vscode-icons", "emojione", "flat-color-icons"].includes(prefix);
                const cleanUrl = `https://api.iconify.design/${prefix}/${name}.svg`;

                return {
                    name,
                    collection: prefix.toUpperCase(),
                    isBrand,
                    // If it's a generic UI icon, fetch it in off-white so it's visible in dark mode previews
                    displayUrl: isBrand ? cleanUrl : `${cleanUrl}?color=%23f8fafc`,
                    downloadUrl: cleanUrl,
                };
            });

            setIcons(formattedIcons);
        } catch (e) {
            console.error("Search failed", e);
        }
        setLoading(false);
    };

    const handleCopy = async (item: any) => {
        try {
            const res = await fetch(item.downloadUrl);
            let svgText = await res.text();

            // For standard UI icons, make the SVG adapt to the text color of whatever project you paste it into
            if (!item.isBrand) {
                svgText = svgText.replace(/fill="[^"]*"/g, 'fill="currentColor"');
            }

            // Send the SVG string back to extension.ts to insert it
            vscode.postMessage({
                command: "insertCode",
                text: svgText,
            });
        } catch (e) {
            console.error("Failed to fetch SVG");
        }
    };

    return (
        <div className="flex flex-col min-h-screen p-6 text-(--vscode-editor-foreground) font-sans">

            {/* Header & Search */}
            <div className="w-full max-w-3xl mx-auto mb-6 text-center">
                <h1 className="text-3xl font-bold mb-6 text-(--vscode-textLink-foreground) tracking-wide">
                    Iconify Explorer
                </h1>

                <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search icons (e.g. user, home, react)..."
                    className="w-full px-5 py-4 text-base rounded-lg outline-none transition-all duration-200 shadow-sm
                     bg-(--vscode-input-background) 
                     text-(--vscode-input-foreground) 
                     border border-(--vscode-input-border) 
                     focus:border-(--vscode-focusBorder) focus:ring-1 focus:ring-(--vscode-focusBorder)"
                />

                {/* Status Text */}
                <div className="mt-4 text-sm text-(--vscode-descriptionForeground) h-5">
                    {loading ? (
                        <span className="animate-pulse">Searching...</span>
                    ) : icons.length > 0 ? (
                        <span>Found {totalFound} icons. Showing first {icons.length}.</span>
                    ) : query ? (
                        <span>No icons found.</span>
                    ) : (
                        <span>Ready to search.</span>
                    )}
                </div>
            </div>

            {/* Grid Container */}
            <IconGrid icons={icons} onCopy={handleCopy} />

        </div>
    );
}
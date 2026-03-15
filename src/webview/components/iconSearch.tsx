import React, { useState, useEffect } from "react";
import { vscode } from "../vscode";
import IconGrid from "./IconGrid";
import IconDetailsModal from "./IconDetailsModal";

export default function IconSearch() {
    const [query, setQuery] = useState("");
    const [icons, setIcons] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [totalFound, setTotalFound] = useState(0);
    const [selectedIcon, setSelectedIcon] = useState<any>(null);

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

    const handleCopy = async (item: any, overrideColor: string = "currentColor", action: "copy" | "insert" = "insert") => {
        try {
            const res = await fetch(item.downloadUrl);
            let svgText = await res.text();

            // For standard UI icons, make the SVG adapt to the text color of whatever project you paste it into
            if (!item.isBrand) {
                // If the user picked a color, inject it; otherwise use currentColor
                svgText = svgText.replace(/fill="[^"]*"/g, `fill="${overrideColor}"`);
            }

            // Send the SVG string back to extension.ts to insert or copy it
            vscode.postMessage({
                command: action === "insert" ? "insertCode" : "copyCode",
                text: svgText,
            });

            // Close modal after action
            setSelectedIcon(null);
        } catch (e) {
            console.error(`Failed to fetch SVG for ${action}`);
        }
    };

    const handleCopyUri = (item: any) => {
        try {
            vscode.postMessage({
                command: "copyCode",
                text: item.downloadUrl,
            });
            setSelectedIcon(null);
        } catch (e) {
            console.error("Failed to copy URI");
        }
    };

    return (
        <div className="flex flex-col min-h-screen p-4 sm:p-6 text-[var(--vscode-editor-foreground)] font-sans">
            {/* Header & Search */}
            <div className="w-full max-w-3xl mx-auto mb-4 text-center sticky top-0 bg-[var(--vscode-sideBar-background)] z-10 pt-2 pb-2">
                <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search icons (e.g. user, home, react)..."
                    className="w-full px-4 py-3 text-sm rounded-lg outline-none transition-all duration-200 shadow-sm
                     bg-[var(--vscode-input-background)] 
                     text-[var(--vscode-input-foreground)] 
                     border border-[var(--vscode-input-border)] 
                     focus:border-[var(--vscode-focusBorder)] focus:ring-[1px] focus:ring-[var(--vscode-focusBorder)]"
                />
            </div>

            {query.trim().length === 0 ? (
                /* Welcome Screen */
                <div className="flex-1 flex flex-col items-center justify-center text-center px-4 mt-12 animate-in fade-in duration-500">
                    <div className="w-20 h-20 mb-6 text-[var(--vscode-textLink-foreground)] opacity-80 drop-shadow-md">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                            <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                            <circle cx="8.5" cy="8.5" r="1.5"></circle>
                            <polyline points="21 15 16 10 5 21"></polyline>
                        </svg>
                    </div>
                    <h1 className="text-2xl font-bold mb-3 tracking-wide text-[var(--vscode-editor-foreground)]">
                        Welcome to IconForge
                    </h1>
                    <p className="text-sm text-[var(--vscode-descriptionForeground)] max-w-md leading-relaxed">
                        Discover and insert thousands of premium open-source icons right in your editor.
                        Type a keyword in the search bar above to begin.
                    </p>
                </div>
            ) : (
                <div className="w-full max-w-3xl mx-auto flex-1">
                    {/* Status Text */}
                    <div className="mb-4 text-xs font-medium text-[var(--vscode-descriptionForeground)] h-5 flex justify-center items-center">
                        {loading ? (
                            <span className="flex items-center gap-2 animate-pulse">
                                <svg className="animate-spin h-3 w-3 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                                </svg>
                                Searching icons...
                            </span>
                        ) : icons.length > 0 ? (
                            <span>Found {totalFound} icons. Showing first {icons.length}.</span>
                        ) : (
                            <span>No icons found for "{query}".</span>
                        )}
                    </div>

                    {/* Grid Container */}
                    <IconGrid icons={icons} onCopy={(item) => setSelectedIcon(item)} />
                </div>
            )}

            {selectedIcon && (
                <IconDetailsModal
                    icon={selectedIcon}
                    onClose={() => setSelectedIcon(null)}
                    onInsert={(icon, color) => handleCopy(icon, color, "insert")}
                    onCopyCode={(icon, color) => handleCopy(icon, color, "copy")}                    onCopyUri={handleCopyUri}                />
            )}
        </div>
    );
}
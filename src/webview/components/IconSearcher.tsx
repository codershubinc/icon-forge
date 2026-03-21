import { useEffect, useState } from "react";
import IconGrid from "./IconGrid";
import IconDetailsModal from "./IconDetailsModal";
import { handleIconCopy, handleIconCopyUri, handleIconDownload } from "../utils/iconActions";

function IconSearcher() {
    const [query, setQuery] = useState("");
    const [icons, setIcons] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [totalFound, setTotalFound] = useState(0);
    const [selectedIcon, setSelectedIcon] = useState<any>(null);

    useEffect(() => {
        const timer = setTimeout(() => {
            if (query.trim().length > 0) {
                searchIcons(query);
            } else {
                setIcons([]);
                setTotalFound(0);
            }
        }, 600);
        return () => clearTimeout(timer);
    }, [query]);

    const searchIcons = async (searchQuery: string) => {
        setLoading(true);
        try {
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

    return (
        <div className="flex flex-col min-h-screen p-3 sm:p-4 text-[(--vscode-editor-foreground)] font-sans rounded-xl">
            <div className="w-full mb-4 sticky top-0 z-10 bg-[(--vscode-editor-background)] pt-1 pb-2">
                <div className="relative flex items-center w-full bg-[(--vscode-input-background)] border border-[(--vscode-input-border)] focus-within:border-[(--vscode-focusBorder)] focus-within:outline-1 focus-within:outline-[(--vscode-focusBorder)] transition-none rounded-full px-1.5 py-1">
                    <input
                        type="text"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="Search Icons in Marketplace"
                        className="w-full bg-transparent border-none text-[13px] text-[(--vscode-input-foreground)] placeholder-[(--vscode-inputPlaceholder-foreground)] px-2 py-1.5 outline-none *:ring-0 rounded-xl"
                    />

                    <div className="flex items-center pr-1 gap-0.5 text-[(--vscode-icon-foreground)]">
                        {query && (
                            <button
                                type="button"
                                onClick={() => setQuery("")}
                                className="p-1.5 hover:bg-[(--vscode-toolbar-hoverBackground)] hover:text-[(--vscode-icon-foreground)] rounded-full cursor-pointer flex items-center justify-center transition-colors"
                                title="Clear Search Results"
                            >
                                <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor">
                                    <path fillRule="evenodd" clipRule="evenodd" d="M8 8.707l3.646 3.647.708-.707L8.707 8l3.647-3.646-.707-.708L8 7.293 4.354 3.646l-.707.708L7.293 8l-3.646 3.646.707.708L8 8.707z" />
                                </svg>
                            </button>
                        )}
                    </div>
                </div>
            </div>

            {query.trim().length === 0 ? (
                <div className="flex-1 flex flex-col items-center justify-center text-center rounded-2xl px-4 mt-8">
                    <h1 className="text-xl font-normal mb-2 text-(--vscode-editor-foreground)]">
                        IconForge
                    </h1>
                    <p className="text-[13px] text-[(--vscode-descriptionForeground)] max-w-sm">
                        Search for icons to insert directly into your editor.
                    </p>
                </div>
            ) : (
                <div className="w-full flex-1">
                    <div className="mb-3 text-[12px] text-(--vscode-descriptionForeground) h-4 flex justify-start items-center">
                        {loading ? (
                            <span>Searching...</span>
                        ) : icons.length > 0 ? (
                            <span>Found {totalFound} icons. Showing first {icons.length}.</span>
                        ) : (
                            <span>No extensions found.</span>
                        )}
                    </div>

                    <IconGrid icons={icons} onCopy={(item) => setSelectedIcon(item)} />
                </div>
            )}

            {selectedIcon && (
                <IconDetailsModal
                    icon={selectedIcon}
                    onClose={() => setSelectedIcon(null)}
                    onInsert={(icon, color) => handleIconCopy(icon, color, "insert", () => setSelectedIcon(null))}
                    onCopyCode={(icon, color) => handleIconCopy(icon, color, "copy", () => setSelectedIcon(null))}
                    onCopyUri={(icon) => handleIconCopyUri(icon, () => setSelectedIcon(null))}
                    onDownload={(icon, color) => handleIconDownload(icon, color, () => setSelectedIcon(null))}
                />
            )}
        </div>
    );
}

export default IconSearcher;
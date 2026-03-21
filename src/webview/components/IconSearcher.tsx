import { useEffect, useRef, useState } from "react";
import IconGrid from "./IconGrid";
import IconDetailsModal from "./IconDetailsModal";
import { handleIconCopy, handleIconCopyUri, handleIconDownload } from "../utils/iconActions";
import SearchBar from "./SearchBar";

function IconSearcher() {
    const inputRef = useRef<HTMLInputElement>(null);
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

    useEffect(() => {
        const onMessage = (event: MessageEvent) => {
            const message = event.data;
            if (message?.command !== "titleAction") {
                return;
            }

            if (message.action === "clearSearch") {
                setQuery("");
                setIcons([]);
                setTotalFound(0);
                setSelectedIcon(null);
                return;
            }

            if (message.action === "focusSearch") {
                inputRef.current?.focus();
                return;
            }

            if (message.action === "refresh" && query.trim().length > 0) {
                searchIcons(query);
            }
        };

        window.addEventListener("message", onMessage);
        return () => window.removeEventListener("message", onMessage);
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
            <SearchBar
                ref={inputRef}
                value={query}
                onChange={setQuery}
                onClear={() => setQuery("")}
                placeholder="Search Icons in Marketplace"
            />

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
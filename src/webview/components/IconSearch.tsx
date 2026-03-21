import { useState } from "react";
import BadgeSearcher from "./CapsulesGrid";
import IconSearcher from "./IconSearcher";

enum SearcherType {
    Icons = "icons",
    Badges = "badges",
}

export default function IconSearch() {
    const [searcherType, setSearcherType] = useState<SearcherType>(SearcherType.Icons);
    const buttonBaseClass =
        "min-w-24 px-4 py-2 text-xs sm:text-sm font-medium rounded-lg cursor-pointer transition-all duration-200 border focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-0";

    return (
        <div className="w-full">
            <div className="px-3 sm:px-4 pt-3 sm:pt-4">
                <div
                    className="inline-flex items-center gap-1.5 p-1.5 rounded-xl border shadow-sm"
                    style={{
                        backgroundColor: "var(--vscode-editorWidget-background)",
                        borderColor: "var(--vscode-widget-border)",
                    }}
                >
                    <button
                        type="button"
                        onClick={() => setSearcherType(SearcherType.Icons)}
                        aria-pressed={searcherType === SearcherType.Icons}
                        aria-current={searcherType === SearcherType.Icons ? "true" : undefined}
                        className={`${buttonBaseClass} ${
                            searcherType === SearcherType.Icons
                                ? "shadow-sm"
                                : "hover:-translate-y-px"
                        }`}
                        style={
                            searcherType === SearcherType.Icons
                                ? {
                                    backgroundColor: "var(--vscode-button-background)",
                                    color: "var(--vscode-button-foreground)",
                                    borderColor: "var(--vscode-button-border, transparent)",
                                    boxShadow: "inset 0 1px 0 rgba(255,255,255,0.08)",
                                }
                                : {
                                    backgroundColor: "transparent",
                                    color: "var(--vscode-descriptionForeground)",
                                    borderColor: "transparent",
                                }
                        }
                    >
                        <span
                            aria-hidden="true"
                            className="inline-block h-1.5 w-1.5 rounded-full mr-2 align-middle transition-opacity duration-200"
                            style={{
                                opacity: searcherType === SearcherType.Icons ? 1 : 0,
                                backgroundColor: "currentColor",
                            }}
                        />
                        Icons
                    </button>
                    <button
                        type="button"
                        onClick={() => setSearcherType(SearcherType.Badges)}
                        aria-pressed={searcherType === SearcherType.Badges}
                        aria-current={searcherType === SearcherType.Badges ? "true" : undefined}
                        className={`${buttonBaseClass} ${
                            searcherType === SearcherType.Badges
                                ? "shadow-sm"
                                : "hover:-translate-y-px"
                        }`}
                        style={
                            searcherType === SearcherType.Badges
                                ? {
                                    backgroundColor: "var(--vscode-button-background)",
                                    color: "var(--vscode-button-foreground)",
                                    borderColor: "var(--vscode-button-border, transparent)",
                                    boxShadow: "inset 0 1px 0 rgba(255,255,255,0.08)",
                                }
                                : {
                                    backgroundColor: "transparent",
                                    color: "var(--vscode-descriptionForeground)",
                                    borderColor: "transparent",
                                }
                        }
                    >
                        <span
                            aria-hidden="true"
                            className="inline-block h-1.5 w-1.5 rounded-full mr-2 align-middle transition-opacity duration-200"
                            style={{
                                opacity: searcherType === SearcherType.Badges ? 1 : 0,
                                backgroundColor: "currentColor",
                            }}
                        />
                        Badges
                    </button>
                </div>
            </div>

            {searcherType === SearcherType.Icons ? <IconSearcher /> : <BadgeSearcher />}
        </div>
    );
}
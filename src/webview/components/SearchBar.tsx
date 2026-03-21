import { forwardRef } from "react";

type SearchBarProps = {
    value: string;
    placeholder?: string;
    onChange: (value: string) => void;
    onClear: () => void;
};

const SearchBar = forwardRef<HTMLInputElement, SearchBarProps>(
    ({ value, placeholder = "Search", onChange, onClear }, ref) => {
        return (
            <div className="w-full mb-4 sticky top-0 z-10 bg-[(--vscode-editor-background)] pt-1 pb-2">
                <div className="relative flex items-center w-full bg-[(--vscode-input-background)] border border-[(--vscode-input-border)] focus-within:border-[(--vscode-focusBorder)] focus-within:outline-1 focus-within:outline-[(--vscode-focusBorder)] transition-none rounded-full px-1.5 py-1">
                    <input
                        ref={ref}
                        type="text"
                        value={value}
                        onChange={(e) => onChange(e.target.value)}
                        placeholder={placeholder}
                        className="w-full bg-transparent border-none text-[13px] text-[(--vscode-input-foreground)] placeholder-[(--vscode-inputPlaceholder-foreground)] px-2 py-1.5 outline-none"
                    />

                    <div className="flex items-center pr-1 gap-0.5 text-[(--vscode-icon-foreground)]">
                        {value && (
                            <button
                                type="button"
                                onClick={onClear}
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
        );
    }
);

SearchBar.displayName = "SearchBar";

export default SearchBar;

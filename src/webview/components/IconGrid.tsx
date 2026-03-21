import React from "react";

interface IconGridProps {
    icons: any[];
    onCopy: (item: any) => void;
}

export default function IconGrid({ icons, onCopy }: IconGridProps) {
    if (!icons || icons.length === 0) return null;

    return (
        <div className="w-full pb-10 px-2">
            {/* Clean, uniform grid layout without text */}
            <div
                className="grid gap-2"
                style={{ gridTemplateColumns: "repeat(auto-fill, minmax(56px, 1fr))" }}
            >
                {icons.map((item, index) => (
                    <div
                        key={index}
                        onClick={() => onCopy(item)}
                        // Hover tooltip so you still know the icon name
                        title={`${item.name} • ${item.collection}`}
                        className="group aspect-square cursor-pointer rounded-lg p-0.5 transition-colors hover:border hover:border-[var(--vscode-focusBorder)] hover:bg-[var(--vscode-list-hoverBackground)]"
                    >
                        {/* Larger Icon Image */}
                        <div className="w-10 h-10 flex items-center justify-center transition-transform duration-200 group-hover:scale-110 hover:drop-shadow-md ">
                            <img
                                src={item.displayUrl}
                                alt={item.name}
                                className="w-full h-full object-contain"
                                loading="lazy"
                            />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
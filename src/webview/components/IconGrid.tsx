import React from "react";

interface IconGridProps {
    icons: any[];
    onCopy: (item: any) => void;
}

export default function IconGrid({ icons, onCopy }: IconGridProps) {
    if (!icons || icons.length === 0) return null;

    return (
        <div className="w-full max-w-6xl mx-auto pb-10">
            <div className="grid grid-cols-[repeat(auto-fill,minmax(180px,1fr))] gap-6">
                {icons.map((item, index) => (
                    <div
                        key={index}
                        onClick={() => onCopy(item)}
                        className="group flex flex-col items-center justify-between p-6 cursor-pointer rounded-2xl transition-all duration-300
                         bg-[var(--vscode-editorWidget-background)] 
                         border border-[var(--vscode-widget-border)] 
                         hover:border-[var(--vscode-focusBorder)] hover:-translate-y-2 hover:shadow-xl"
                    >
                        {/* Icon Image */}
                        <div className="w-24 h-24 mb-6 flex items-center justify-center transition-transform duration-300 group-hover:scale-125">
                            <img
                                src={item.displayUrl}
                                alt={item.name}
                                className="w-full h-full object-contain"
                                loading="lazy"
                            />
                        </div>

                        {/* Icon Details */}
                        <div className="flex flex-col items-center w-full">
                            {/* Icon Name */}
                            <div
                                className="text-base font-semibold text-center w-full truncate text-[var(--vscode-editor-foreground)] mb-1.5"
                                title={item.name}
                            >
                                {item.name}
                            </div>

                            {/* Collection Label */}
                            <div className="text-xs font-bold text-[var(--vscode-descriptionForeground)] tracking-widest uppercase opacity-75">
                                {item.collection}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
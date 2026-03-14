import React, { useState } from "react";

export default function IconDetailsModal({ icon, onClose, onInsert, onCopyCode }: { icon: any, onClose: () => void, onInsert: (icon: any, color: string) => void, onCopyCode: (icon: any, color: string) => void }) {
    const [color, setColor] = useState("#currentColor");

    if (!icon) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-[var(--vscode-editor-background)] border border-[var(--vscode-widget-border)] shadow-xl rounded-xl w-full max-w-sm overflow-hidden flex flex-col">
                
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-[var(--vscode-widget-border)] bg-[var(--vscode-editorWidget-background)]">
                    <div>
                        <h3 className="text-base font-bold text-[var(--vscode-editor-foreground)] m-0">{icon.name}</h3>
                        <p className="text-xs text-[var(--vscode-descriptionForeground)] m-0 mt-1">{icon.collection}</p>
                    </div>
                    <button 
                        onClick={onClose}
                        className="p-1.5 rounded-md hover:bg-[var(--vscode-toolbar-hoverBackground)] text-[var(--vscode-icon-foreground)] transition-colors"
                    >
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                            <path fillRule="evenodd" clipRule="evenodd" d="M8 8.707l3.646 3.647.708-.707L8.707 8l3.647-3.646-.707-.708L8 7.293 4.354 3.646l-.708.707L7.293 8l-3.647 3.646.708.707L8 8.707z" />
                        </svg>
                    </button>
                </div>

                {/* Preview Area */}
                <div className="flex-1 flex flex-col items-center justify-center p-8 bg-[var(--vscode-editor-inactiveSelectionBackground)]">
                    <div 
                        className="w-24 h-24 sm:w-32 sm:h-32 flex items-center justify-center"
                        style={{ color: color === "#currentColor" ? "inherit" : color }}
                    >
                        <img 
                            src={icon.isBrand ? icon.displayUrl : `${icon.downloadUrl}?color=${encodeURIComponent(color === '#currentColor' ? '#ffffff' : color)}`}
                            alt={icon.name} 
                            className="w-full h-full object-contain drop-shadow-sm" 
                        />
                    </div>
                </div>

                {/* Controls Area */}
                <div className="p-4 flex flex-col gap-4 bg-[var(--vscode-editorWidget-background)]">
                    
                    {!icon.isBrand && (
                        <div className="flex flex-col gap-2">
                            <label className="text-xs font-semibold text-[var(--vscode-editor-foreground)]">Color</label>
                            <div className="flex items-center gap-3">
                                <input 
                                    type="color" 
                                    value={color === "#currentColor" ? "#ffffff" : color} 
                                    onChange={(e) => setColor(e.target.value)}
                                    className="w-8 h-8 rounded cursor-pointer border-0 p-0 bg-transparent"
                                />
                                <div className="flex gap-2">
                                    {['#currentColor', '#ffffff', '#000000', '#3b82f6', '#ef4444', '#10b981'].map((c) => (
                                        <button 
                                            key={c}
                                            onClick={() => setColor(c)}
                                            className={`w-6 h-6 rounded-full border border-[var(--vscode-widget-border)] ${color === c ? 'ring-2 ring-[var(--vscode-focusBorder)] ring-offset-1 ring-offset-[var(--vscode-editorWidget-background)]' : ''}`}
                                            style={{ backgroundColor: c === '#currentColor' ? 'transparent' : c, backgroundImage: c === '#currentColor' ? 'linear-gradient(45deg, #ccc 25%, transparent 25%, transparent 75%, #ccc 75%, #ccc), linear-gradient(45deg, #ccc 25%, transparent 25%, transparent 75%, #ccc 75%, #ccc)' : 'none', backgroundPosition: '0 0, 4px 4px', backgroundSize: '8px 8px' }}
                                            title={c === '#currentColor' ? 'Current Color' : c}
                                        />
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                    <div className="grid grid-cols-2 gap-3 mt-2">
                        <button 
                            onClick={() => onInsert(icon, color)}
                            className="flex items-center justify-center gap-2 px-3 py-2.5 bg-[var(--vscode-button-background)] hover:bg-[var(--vscode-button-hoverBackground)] text-[var(--vscode-button-foreground)] rounded font-medium text-sm transition-colors"
                        >
                            <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor">
                                <path fillRule="evenodd" clipRule="evenodd" d="M10 14l-.35.15-5-2.5L4 11V5l.65-.65 5-2.5L10 2v3h5v2h-5v3h5v2h-5v2zm-1-1.3l-4-2V5.3l4 2v5.4zM11 6V4.4l3 1.5V6h-3zm0 5V9h3v2h-3z" />
                            </svg>
                            Insert
                        </button>
                        <button 
                            onClick={() => onCopyCode(icon, color)}
                            className="flex items-center justify-center gap-2 px-3 py-2.5 bg-[var(--vscode-button-secondaryBackground)] hover:bg-[var(--vscode-button-secondaryHoverBackground)] text-[var(--vscode-button-secondaryForeground)] rounded font-medium text-sm transition-colors"
                        >
                            <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor">
                                <path fillRule="evenodd" clipRule="evenodd" d="M4 4l1-1h5.414L14 6.586V14l-1 1H5l-1-1V4zm9 3l-3-3H5v10h8V7z" />
                                <path fillRule="evenodd" clipRule="evenodd" d="M3 1L2 2v10h1V2h6.414l-1-1H3z" />
                            </svg>
                            Copy SVG
                        </button>
                    </div>

                </div>

            </div>
        </div>
    );
}
import { useEffect, useRef, useState } from "react";
import SearchBar from "./SearchBar";
import { vscode } from "../vscode";

export default function BadgeSearcher() {
    const [query, setQuery] = useState("");
    const [debouncedQuery, setDebouncedQuery] = useState("");
    const [activeCategory, setActiveCategory] = useState<string | null>(null);
    const searchRef = useRef<HTMLInputElement>(null);

    // Added simple SVG icons to the categories to make the Bento layout pop
    const badgeCategories = [
        {
            title: "Frontend",
            icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20.94c1.5 0 2.75 1.06 4 1.06 3 0 6-8 6-12.22A4.91 4.91 0 0 0 17 5c-2.22 0-4 1.44-5 2-1-.56-2.78-2-5-2a4.9 4.9 0 0 0-5 4.78C2 14 5 22 8 22c1.25 0 2.5-1.06 4-1.06Z" /><path d="M10 2c1 .5 2 2 2 5" /></svg>,
            terms: ["react", "next.js", "vue.js", "angular", "svelte", "tailwindcss", "typescript", "javascript"],
        },
        {
            title: "Backend",
            icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><ellipse cx="12" cy="5" rx="9" ry="3" /><path d="M3 5V19A9 3 0 0 0 21 19V5" /><path d="M3 12A9 3 0 0 0 21 12" /></svg>,
            terms: ["node.js", "express", "nestjs", "django", "flask", "laravel", "spring", "graphql"],
        },
        {
            title: "Languages",
            icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="16 18 22 12 16 6" /><polyline points="8 6 2 12 8 18" /></svg>,
            terms: ["python", "go", "rust", "java", "csharp", "php", "ruby", "kotlin", "swift"],
        },
        {
            title: "Database",
            icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M4 22h14a2 2 0 0 0 2-2V7l-5-5H6a2 2 0 0 0-2 2v4" /><path d="M14 2v4a2 2 0 0 0 2 2h4" /><path d="M3 15h6" /><path d="M3 18h6" /></svg>,
            terms: ["postgresql", "mysql", "mongodb", "redis", "sqlite", "firebase", "supabase"],
        },
        {
            title: "Cloud & DevOps",
            icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z" /></svg>,
            terms: ["aws", "azure", "google cloud", "docker", "kubernetes", "terraform", "ansible", "jenkins"],
        },
        {
            title: "Tools",
            icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" /></svg>,
            terms: ["github", "gitlab", "jira", "figma", "vercel", "netlify", "linux", "ubuntu"],
        },
    ];

    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedQuery(query.trim());
        }, 300);
        return () => clearTimeout(timer);
    }, [query]);

    const generateBadges = (searchTerm: string) => {
        if (!searchTerm) return [];
        const encodedTerm = encodeURIComponent(searchTerm);
        const lowerTerm = searchTerm.toLowerCase();

        return [
            { title: "For The Badge (Dark)", markdown: `![${searchTerm}](https://img.shields.io/badge/${encodedTerm}-black?style=for-the-badge&logo=${lowerTerm})`, url: `https://img.shields.io/badge/${encodedTerm}-black?style=for-the-badge&logo=${lowerTerm}` },
            { title: "Flat Style", markdown: `![${searchTerm}](https://img.shields.io/badge/${encodedTerm}-blue?style=flat&logo=${lowerTerm})`, url: `https://img.shields.io/badge/${encodedTerm}-blue?style=flat&logo=${lowerTerm}` },
            { title: "Flat Square", markdown: `![${searchTerm}](https://img.shields.io/badge/${encodedTerm}-gray?style=flat-square&logo=${lowerTerm})`, url: `https://img.shields.io/badge/${encodedTerm}-gray?style=flat-square&logo=${lowerTerm}` },
            { title: "Built With", markdown: `![Built With ${searchTerm}](https://img.shields.io/badge/Built%20With-${encodedTerm}-informational?style=for-the-badge&logo=${lowerTerm})`, url: `https://img.shields.io/badge/Built%20With-${encodedTerm}-informational?style=for-the-badge&logo=${lowerTerm}` },
            { title: "Made With", markdown: `![Made With ${searchTerm}](https://img.shields.io/badge/Made%20with-${encodedTerm}-success?style=flat-square&logo=${lowerTerm})`, url: `https://img.shields.io/badge/Made%20with-${encodedTerm}-success?style=flat-square&logo=${lowerTerm}` },
            { title: "NPM Package", markdown: `![NPM package](https://img.shields.io/badge/npm-${encodedTerm}-red?style=for-the-badge&logo=npm)`, url: `https://img.shields.io/badge/npm-${encodedTerm}-red?style=for-the-badge&logo=npm` },
            { title: "Mock Version", markdown: `![${searchTerm} Version](https://img.shields.io/badge/${encodedTerm}-v1.0.0-blue?style=flat&logo=${lowerTerm})`, url: `https://img.shields.io/badge/${encodedTerm}-v1.0.0-blue?style=flat&logo=${lowerTerm}` },
            { title: "Mock Build Status", markdown: `![${searchTerm} Build](https://img.shields.io/badge/${encodedTerm}-passing-success?style=flat-square&logo=${lowerTerm})`, url: `https://img.shields.io/badge/${encodedTerm}-passing-success?style=flat-square&logo=${lowerTerm}` },
            { title: "Social Style", markdown: `![${searchTerm}](https://img.shields.io/badge/${encodedTerm}-follow%20me-1d9bf0?style=social&logo=${lowerTerm})`, url: `https://img.shields.io/badge/${encodedTerm}-follow%20me-1d9bf0?style=social&logo=${lowerTerm}` },
            { title: "Plastic", markdown: `![${searchTerm}](https://img.shields.io/badge/${encodedTerm}-active-16a34a?style=plastic&logo=${lowerTerm}&logoColor=white)`, url: `https://img.shields.io/badge/${encodedTerm}-active-16a34a?style=plastic&logo=${lowerTerm}&logoColor=white` },
            { title: "Ready for Production", markdown: `![${searchTerm}](https://img.shields.io/badge/${encodedTerm}-production-0f766e?style=for-the-badge&logo=${lowerTerm}&logoColor=white)`, url: `https://img.shields.io/badge/${encodedTerm}-production-0f766e?style=for-the-badge&logo=${lowerTerm}&logoColor=white` },
            { title: "Maintained", markdown: `![Maintained](https://img.shields.io/badge/maintained-yes-22c55e?style=flat&logo=${lowerTerm})`, url: `https://img.shields.io/badge/maintained-yes-22c55e?style=flat&logo=${lowerTerm}` },
            { title: "Documentation", markdown: `![Docs](https://img.shields.io/badge/docs-${encodedTerm}-7c3aed?style=flat-square&logo=readthedocs&logoColor=white)`, url: `https://img.shields.io/badge/docs-${encodedTerm}-7c3aed?style=flat-square&logo=readthedocs&logoColor=white` },
            { title: "CI Pipeline", markdown: `![CI](https://img.shields.io/badge/CI-${encodedTerm}-0891b2?style=for-the-badge&logo=githubactions&logoColor=white)`, url: `https://img.shields.io/badge/CI-${encodedTerm}-0891b2?style=for-the-badge&logo=githubactions&logoColor=white` },
            { title: "Tests Passing", markdown: `![Tests](https://img.shields.io/badge/tests-passing-16a34a?style=flat&logo=${lowerTerm})`, url: `https://img.shields.io/badge/tests-passing-16a34a?style=flat&logo=${lowerTerm}` },
            { title: "Coverage", markdown: `![Coverage](https://img.shields.io/badge/coverage-98%25-0284c7?style=flat-square&logo=codecov&logoColor=white)`, url: `https://img.shields.io/badge/coverage-98%25-0284c7?style=flat-square&logo=codecov&logoColor=white` },
            { title: "License", markdown: `![License](https://img.shields.io/badge/license-MIT-334155?style=flat&logo=opensourceinitiative&logoColor=white)`, url: `https://img.shields.io/badge/license-MIT-334155?style=flat&logo=opensourceinitiative&logoColor=white` },
            { title: "PRs Welcome", markdown: `![PRs Welcome](https://img.shields.io/badge/PRs-welcome-ec4899?style=for-the-badge&logo=git&logoColor=white)`, url: `https://img.shields.io/badge/PRs-welcome-ec4899?style=for-the-badge&logo=git&logoColor=white` },
            { title: "Open Source", markdown: `![Open Source](https://img.shields.io/badge/Open%20Source-${encodedTerm}-f59e0b?style=flat-square&logo=${lowerTerm}&logoColor=black)`, url: `https://img.shields.io/badge/Open%20Source-${encodedTerm}-f59e0b?style=flat-square&logo=${lowerTerm}&logoColor=black` }
        ];
    };

    const badges = generateBadges(debouncedQuery);

    const focusAndSelectSearch = () => {
        searchRef.current?.focus();
        requestAnimationFrame(() => searchRef.current?.select());
    };

    const handleCapsuleSelect = (term: string) => {
        setQuery(term);
        focusAndSelectSearch();
    };

    const selectedCategory = badgeCategories.find((category) => category.title === activeCategory) ?? null;

    const handleInsert = (markdown: string) => {
        vscode.postMessage({ command: "insertCode", text: markdown });
    };

    return (
        <div className="flex flex-col min-h-screen p-3 sm:p-5 text-(--vscode-editor-foreground) font-sans">
            <SearchBar
                ref={searchRef}
                value={query}
                onChange={setQuery}
                onClear={() => setQuery("")}
                placeholder="Search tech stack (e.g. react, docker)..."
            />

            {!debouncedQuery ? (
                <div className="flex-1 w-full mt-2">
                    {!selectedCategory ? (
                        <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                            <div className="mb-5 px-1">
                                <h2 className="text-xl font-bold tracking-tight text-(--vscode-editor-foreground)">
                                    Explore Categories
                                </h2>
                                <p className="text-[13px] mt-1 text-(--vscode-descriptionForeground) opacity-80">
                                    Quickly find badges for your favorite stacks.
                                </p>
                            </div>

                            {/* Modern Bento Grid Layout */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pb-4">
                                {badgeCategories.map((category) => (
                                    <button
                                        key={category.title}
                                        type="button"
                                        onClick={() => setActiveCategory(category.title)}
                                        className="group relative flex flex-col items-start text-left p-4 h-32 rounded-2xl border border-[color-mix(in_srgb,var(--vscode-widget-border)_40%,transparent)] bg-[color-mix(in_srgb,var(--vscode-editorWidget-background)_60%,transparent)] hover:bg-[color-mix(in_srgb,var(--vscode-list-hoverBackground)_80%,transparent)] hover:border-[color-mix(in_srgb,var(--vscode-focusBorder)_50%,transparent)] hover:-translate-y-1 hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--vscode-focusBorder) transition-all duration-300 overflow-hidden"
                                    >
                                        <div className="p-2.5 rounded-xl bg-[color-mix(in_srgb,var(--vscode-textLink-foreground)_15%,transparent)] text-(--vscode-textLink-foreground) mb-auto transition-transform group-hover:scale-110">
                                            {category.icon}
                                        </div>

                                        <div className="mt-3">
                                            <div className="text-[14px] font-bold text-(--vscode-editor-foreground)">
                                                {category.title}
                                            </div>
                                            <div className="text-[11px] text-(--vscode-descriptionForeground) mt-0.5 font-medium opacity-70">
                                                {category.terms.length} badges
                                            </div>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </div>
                    ) : (
                        <div className="animate-in fade-in slide-in-from-right-4 duration-300">
                            <div className="mb-5 px-1 flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <button
                                        type="button"
                                        onClick={() => setActiveCategory(null)}
                                        className="p-2 rounded-full bg-[color-mix(in_srgb,var(--vscode-editorWidget-background)_80%,transparent)] hover:bg-(--vscode-list-hoverBackground) focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--vscode-focusBorder) transition-colors"
                                        title="Go back"
                                    >
                                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6" /></svg>
                                    </button>
                                    <div>
                                        <h2 className="text-lg font-bold text-(--vscode-editor-foreground)">
                                            {selectedCategory.title}
                                        </h2>
                                        <p className="text-[12px] text-(--vscode-descriptionForeground) opacity-80">
                                            Tap to search and edit
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="grid gap-3" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))" }}>
                                {selectedCategory.terms.map((term) => {
                                    const encoded = encodeURIComponent(term);
                                    const badgeUrl = `https://img.shields.io/badge/${encoded}-0ea5e9?style=for-the-badge&logo=${encodeURIComponent(term.toLowerCase())}&logoColor=white`;

                                    return (
                                        <button
                                            key={`${selectedCategory.title}-${term}`}
                                            type="button"
                                            onClick={() => handleCapsuleSelect(term)}
                                            className="group flex flex-col items-center justify-center p-3 rounded-xl border border-[color-mix(in_srgb,var(--vscode-widget-border)_40%,transparent)] bg-[color-mix(in_srgb,var(--vscode-editorWidget-background)_60%,transparent)] hover:bg-[color-mix(in_srgb,var(--vscode-list-hoverBackground)_80%,transparent)] hover:border-[color-mix(in_srgb,var(--vscode-focusBorder)_50%,transparent)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--vscode-focusBorder) transition-all hover:shadow-md cursor-pointer text-left"
                                        >
                                            <div className="h-8 flex items-center justify-center mb-2 transition-transform duration-300 group-hover:scale-[1.05]">
                                                <img src={badgeUrl} alt={`${term} badge`} loading="lazy" className="max-h-full drop-shadow-sm" />
                                            </div>
                                            <div className="w-full text-[11px] font-semibold text-center text-(--vscode-descriptionForeground) group-hover:text-(--vscode-editor-foreground) capitalize truncate transition-colors">
                                                {term}
                                            </div>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    )}
                </div>
            ) : (
                <div className="w-full flex-1 animate-in fade-in duration-300">
                    <div className="mb-4 mt-2 text-[12px] font-medium text-(--vscode-descriptionForeground) flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-(--vscode-textLink-foreground) animate-pulse"></div>
                        Generated {badges.length} styled badges
                    </div>

                    <div className="grid gap-3" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(170px, 1fr))" }}>
                        {badges.map((badge, index) => (
                            <div
                                key={index}
                                onClick={() => handleInsert(badge.markdown)}
                                className="group relative flex flex-col items-center justify-center p-4 cursor-pointer rounded-xl transition-all duration-300 border border-[color-mix(in_srgb,var(--vscode-widget-border)_40%,transparent)] bg-[color-mix(in_srgb,var(--vscode-editorWidget-background)_40%,transparent)] hover:bg-[color-mix(in_srgb,var(--vscode-list-hoverBackground)_80%,transparent)] hover:border-[color-mix(in_srgb,var(--vscode-focusBorder)_50%,transparent)] hover:-translate-y-1 hover:shadow-lg"
                                title="Click to insert Markdown"
                            >
                                <div className="absolute inset-0 bg-linear-to-b from-transparent to-[color-mix(in_srgb,var(--vscode-editor-background)_20%,transparent)] rounded-xl opacity-0 group-hover:opacity-100 transition-opacity"></div>

                                <div className="h-8 flex items-center justify-center transition-transform duration-300 group-hover:scale-105 mb-3 relative z-10">
                                    <img src={badge.url} alt={badge.title} loading="lazy" className="max-h-full drop-shadow-md" />
                                </div>
                                <div className="text-[11.5px] font-semibold truncate text-(--vscode-descriptionForeground) group-hover:text-(--vscode-editor-foreground) transition-colors relative z-10">
                                    {badge.title}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
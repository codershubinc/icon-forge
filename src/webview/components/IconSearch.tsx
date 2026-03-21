import { useEffect, useState } from "react";
import BadgeSearcher from "./BadgeSearcher";
import IconSearcher from "./IconSearcher";

enum SearcherType {
    Icons = "icons",
    Badges = "badges",
}

export default function IconSearch() {
    const [searcherType, setSearcherType] = useState<SearcherType>(SearcherType.Icons);

    useEffect(() => {
        const onMessage = (event: MessageEvent) => {
            const message = event.data;
            if (message?.command !== "titleAction" || message?.action !== "switchMode") {
                return;
            }

            if (message.mode === SearcherType.Icons) {
                setSearcherType(SearcherType.Icons);
            }

            if (message.mode === SearcherType.Badges) {
                setSearcherType(SearcherType.Badges);
            }
        };

        window.addEventListener("message", onMessage);
        return () => window.removeEventListener("message", onMessage);
    }, []);

    return (
        <div className="w-full">
            {searcherType === SearcherType.Icons ? <IconSearcher /> : <BadgeSearcher />}
        </div>
    );
}
import { useState } from "react";
import IconSearch from "./components/IconSearch";

export function App() {

    const [activeTab, setActiveTab] = useState("search");
    return (
        <div className="">
            {activeTab === "search" && <IconSearch />}

        </div>
    );
}

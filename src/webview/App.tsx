import { useState } from "react";
import IconSearch from "./components/iconSearch";

export function App() {

    const [activeTab, setActiveTab] = useState("search");
    return (
        <div className="">
            {activeTab === "search" && <IconSearch />}

        </div>
    );
}

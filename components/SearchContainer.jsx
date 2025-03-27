'use client';

import { useState } from "react";
import SearchForm from "./SearchForm";
import WeaponCard from "./WeaponCard";
import Pagination from "./Pagination";

export default function SearchContainer() {
    const [perk1, setPerk1] = useState("");
    const [perk2, setPerk2] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [weapons, setWeapons] = useState([]);
    const [loading, setLoading] = useState(false);

    async function fetchWeapons() {
        if (!perk1 && !perk2) return;
        setLoading(true);
        setCurrentPage(1);

        try {
            const response = await fetch(`/api?perk1=${encodeURIComponent(perk1)}&perk2=${encodeURIComponent(perk2)}&page=1`);
            const data = await response.json();
            setWeapons(data.weapons);
        } catch (error) {
            console.error("Error en fetchWeapons:", error);
        }

        setLoading(false);
    }

    return (
        <div>
            <SearchForm
                perk1={perk1}
                setPerk1={setPerk1}
                perk2={perk2}
                setPerk2={setPerk2}
                onSearch={fetchWeapons}
                loading={loading}
            />

            {loading && <p>Cargando...</p>}

            {weapons.length > 0 ? (
                <>
                    <WeaponCard weapon={weapons[currentPage - 1]} />
                    <Pagination currentPage={currentPage} total={weapons.length} onPageChange={setCurrentPage} />
                </>
            ) : (
                !loading && null
            )}
        </div>
    );
}
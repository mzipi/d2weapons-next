'use client';

import { useState } from "react";

export default function WeaponsSearch() {
    const [perk1, setPerk1] = useState("");
    const [perk2, setPerk2] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [weapons, setWeapons] = useState([]);
    const [loading, setLoading] = useState(false);

    async function fetchWeapons() {
        if (!perk1 && !perk2) return;
        setLoading(true);

        try {
            const response = await fetch(`/api/?perk1=${encodeURIComponent(perk1)}&perk2=${encodeURIComponent(perk2)}&page=${currentPage}`);
            const data = await response.json();

            setWeapons(data.weapons);
            setCurrentPage(1);
        } catch (error) {
            console.error("Error en fetchWeapons:", error);
        }

        setLoading(false);
    }

    function renderWeapon() {
        if (weapons.length === 0) {
            return <p>No se encontraron armas.</p>;
        }

        const weapon = weapons[currentPage - 1];
        return (
            <div className="weapon">
                <div className="weapon-image-container">
                    <img src={weapon.icon} alt={weapon.name} className="weapon-icon" />
                    {weapon.iconWatermark && (
                        <img src={weapon.iconWatermark} alt="watermark" className="weapon-watermark" />
                    )}
                </div>
                <strong>{weapon.name}</strong>
                <br />
                <em>{weapon.flavorText || "No hay descripción"}</em>
                <br />
                <h4>Perks:</h4>
                <div className="sockets-container">
                    {weapon.sockets && weapon.sockets.length > 0 ? (
                        weapon.sockets.map((socket, index) => (
                            <div key={index} className="socket">
                                <strong>{socket.itemTypeDisplayName || "Desconocido"}</strong>
                                <ul>
                                    {socket.perks.length > 0 ? (
                                        socket.perks.map((perk, perkIndex) => (
                                            <li key={perkIndex} className={`perk ${perk.highlighted ? "highlighted-perk" : ""}`}>
                                                <div className="tooltip">
                                                    <h3>{perk.name}</h3>
                                                    <h4>{socket.itemTypeDisplayName || "Tipo Desconocido"}</h4>
                                                    <p>{perk.description}</p>
                                                </div>
                                                {perk.icon && (
                                                    <img src={`https://www.bungie.net${perk.icon}`} alt={perk.name} />
                                                )}
                                            </li>
                                        ))
                                    ) : (
                                        <li>No hay perks disponibles</li>
                                    )}
                                </ul>
                            </div>
                        ))
                    ) : (
                        <p>No tiene sockets con perks aleatorios</p>
                    )}
                </div>
            </div>
        );
    }

    return (
        <div>
            <div id="search-container">
                <input
                    type="text"
                    placeholder="Rasgo 1"
                    id="search"
                    value={perk1}
                    onChange={(e) => setPerk1(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === "Enter") {
                            e.preventDefault();
                            fetchWeapons();
                        }
                    }}
                />

                <input
                    type="text"
                    placeholder="Rasgo 2"
                    id="search"
                    value={perk2}
                    onChange={(e) => setPerk2(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === "Enter") {
                            e.preventDefault();
                            fetchWeapons();
                        }
                    }}
                />

                <button onClick={fetchWeapons} disabled={loading}>
                    {loading ? "Cargando..." : "Buscar"}
                </button>
            </div>

            {loading && <p>Cargando...</p>}

            <div id="weapons-container">{renderWeapon()}</div>

            <div id="buttons-container">
                <button
                    onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                >
                    Anterior
                </button>
                <button
                    onClick={() => setCurrentPage((prev) => (prev < weapons.length ? prev + 1 : prev))}
                    disabled={currentPage >= weapons.length}
                >
                    Siguiente
                </button>
            </div>
        </div>
    );
}
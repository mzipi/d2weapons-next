export default function WeaponSockets({ sockets }) {
    if (!sockets || sockets.length === 0) {
        return <p>No tiene sockets con perks aleatorios</p>;
    }

    return (
        <div className="sockets-container">
            {sockets.map((socket, index) => (
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
            ))}
        </div>
    );
}
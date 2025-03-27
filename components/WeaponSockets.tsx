import Image from "next/image";

interface Perk {
    name: string;
    description: string;
    highlighted: boolean;
    icon?: string;
}

interface Socket {
    itemTypeDisplayName?: string;
    perks: Perk[];
}

interface WeaponSocketsProps {
    sockets: Socket[];
}

export default function WeaponSockets({ sockets }: WeaponSocketsProps) {
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
                                        <Image src={`https://www.bungie.net${perk.icon}`} alt={perk.name} width={46} height={46} />
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
import Image from "next/image";
import WeaponSockets from "./WeaponSockets";

type Weapon = {
    icon: string;
    name: string;
    flavorText?: string;
    iconWatermark?: string;
    sockets: {
        itemTypeDisplayName: string;
        perks: {
            name: string;
            description: string;
            icon: string;
            highlighted: boolean;
        }[];
    }[];
};

interface WeaponCardProps {
    weapon: Weapon;
}

export default function WeaponCard({ weapon }: WeaponCardProps) {
    if (!weapon) {
        return null;
    }

    return (
        <div id="weapon-container">
            <div className="weapon-image-container">
                <Image src={weapon.icon} alt={weapon.name} className="weapon-icon" width={46} height={46} />
                {weapon.iconWatermark && (
                    <Image src={weapon.iconWatermark} alt="watermark" className="weapon-watermark" width={46} height={46} />
                )}
            </div>
            <strong>{weapon.name}</strong>
            <br />
            <em>{weapon.flavorText || "No hay descripción"}</em>
            <br />
            <h4>Perks:</h4>
            <WeaponSockets sockets={weapon.sockets} />
        </div>
    );
}

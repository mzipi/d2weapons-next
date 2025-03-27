import Image from "next/image";
import WeaponSockets from "./WeaponSockets";

export default function WeaponCard({ weapon }) {
    if (!weapon) {
        return null;
    }

    return (
        <div id="weapon-container">
            <div className="weapon-image-container">
                <Image src={weapon.icon} alt={weapon.name} className="weapon-icon" />
                {weapon.iconWatermark && (
                    <Image src={weapon.iconWatermark} alt="watermark" className="weapon-watermark" />
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
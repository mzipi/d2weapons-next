import WeaponSockets from "./WeaponSockets";

export default function WeaponCard({ weapon }) {
    if (!weapon) {
        return null;
    }

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
            <WeaponSockets sockets={weapon.sockets} />
        </div>
    );
}
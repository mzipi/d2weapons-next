import { NextResponse } from "next/server";
import { loadManifest } from "../utils/manifest";
import { searchPerk, findWeaponsWithPerks, formatWeapons } from "../utils/search";

interface PerkItem {
    hash: number;
}

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const perkName1 = searchParams.get("perk1");
        const perkName2 = searchParams.get("perk2");

        if (!perkName1 || !perkName2) {
            return NextResponse.json({ error: "Falta un perk" }, { status: 400 });
        }

        const { items, plugSets } = await loadManifest();

        const perkItem1 = searchPerk(perkName1, items) as PerkItem;
        const perkItem2 = searchPerk(perkName2, items) as PerkItem;

        if (!perkItem1 || !perkItem2) {
            return NextResponse.json({ error: "Perk no encontrado o no es de tier 'Común'" }, { status: 404 });
        }

        const perkHash1 = perkItem1.hash;
        const perkHash2 = perkItem2.hash;

        const weaponsWithBothPerks = findWeaponsWithPerks(perkHash1, perkHash2, items, plugSets);
        const filteredWeapons = formatWeapons(weaponsWithBothPerks, items, plugSets, perkHash1, perkHash2);

        return NextResponse.json({ weapons: filteredWeapons });
    } catch (error) {
        console.error("Error detallado:", error);
        return NextResponse.json({ error: "Error al procesar la solicitud" }, { status: 500 });
    }
}
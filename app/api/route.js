import { NextResponse } from 'next/server';
import getManifestUrls from "../utils/utils.js";

let manifestCache = null;

// const ammoTypeMap = {
//     0: "None",
//     1: "Principal",
//     2: "Especial",
//     3: "Pesada",
//     4: "Desconocida"
// };

// const findAmmoTypeNameFromNodeDefinition = (ammoTypeId, data) => {
//     const ammoTypeNameFromMap = ammoTypeMap[ammoTypeId] || "Desconocido";
//     const ammoTypeNode = Object.values(data.DestinyPresentationNodeDefinition).find(item => {
//         return item.displayProperties?.name === ammoTypeNameFromMap;
//     });

//     if (ammoTypeNode) {
//         const icon = ammoTypeNode.displayProperties.icon;
//         return icon ? `https://www.bungie.net${icon}` : null;
//     }

//     return null;
// };

// async function loadManifest() {
//     try {
//         if (manifestCache) return manifestCache;

//         const urls = await getManifestUrls();

//         if (!urls) throw new Error("No se pudieron obtener las URLs del manifiesto.");

//         const [items, perks, collectibles, sources, seasons, plugSets] = await Promise.all([
//             fetch(urls.DestinyInventoryItemDefinition).then(res => res.json()).catch(() => { throw new Error("Error al cargar DestinyInventoryItemDefinition") }),
//             fetch(urls.DestinySandboxPerkDefinition).then(res => res.json()).catch(() => { throw new Error("Error al cargar DestinySandboxPerkDefinition") }),
//             fetch(urls.DestinyCollectibleDefinition).then(res => res.json()).catch(() => { throw new Error("Error al cargar DestinyCollectibleDefinition") }),
//             fetch(urls.DestinyRewardSourceDefinition).then(res => res.json()).catch(() => { throw new Error("Error al cargar DestinyRewardSourceDefinition") }),
//             fetch(urls.DestinySeasonDefinition).then(res => res.json()).catch(() => { throw new Error("Error al cargar DestinySeasonDefinition") }),
//             fetch(urls.DestinyPlugSetDefinition).then(res => res.json()).catch(() => { throw new Error("Error al cargar DestinyPlugSetDefinition") }),
//         ]);

//         manifestCache = { items, plugSets };
//         manifestCache = { items, perks, collectibles, sources, seasons, plugSets };
//         return manifestCache;
//     } catch (error) {
//         console.error("Error en la carga del manifiesto:", error);
//         return new Response(JSON.stringify({ error: "Error al cargar los manifiestos." }), { status: 500 });
//     }
// }

async function loadManifest() {
    if (manifestCache) return manifestCache;

    try {
        const urls = await getManifestUrls();
        if (!urls) throw new Error("No se pudieron obtener las URLs del manifiesto.");

        const [items, plugSets] = await Promise.all([
            fetch(urls.DestinyInventoryItemDefinition).then(res => res.json()),
            fetch(urls.DestinyPlugSetDefinition).then(res => res.json()),
        ]);

        manifestCache = { items, plugSets };
        return manifestCache;
    } catch (error) {
        console.error("Error en la carga del manifiesto:", error);
        throw new Error("Error al cargar los manifiestos.");
    }
}

function normalizeText(text) {
    return text
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase();
}

function searchPerk(perkName, items) {
    const normalizedPerkName = normalizeText(perkName);

    return Object.values(items).find(item =>
        item.displayProperties?.name?.toLowerCase() === perkName.toLowerCase() &&
        item.inventory?.tierTypeName === "Común"
    );
}

export async function GET(req) {
    try {
        const { searchParams } = new URL(req.url);
        const perkName1 = searchParams.get("perk1");
        const perkName2 = searchParams.get("perk2");

        if (!perkName1 || !perkName2) {
            return NextResponse.json({ error: "Falta un perk" }, { status: 400 });
        }

        const { items, plugSets } = await loadManifest();

        const perkItem1 = searchPerk(perkName1, items);
        const perkItem2 = searchPerk(perkName2, items);

        if (!perkItem1 || !perkItem2) {
            return NextResponse.json({ error: "Perk no encontrado o no es de tier 'Común'" }, { status: 404 });
        }

        const perkHash1 = perkItem1.hash;
        const perkHash2 = perkItem2.hash;

        const weaponsWithBothPerks = Object.values(items).filter(item => {
            const perkOrder1 = (
                item.itemType === 3 &&
                item.sockets?.socketEntries?.[3]?.randomizedPlugSetHash &&
                item.sockets?.socketEntries?.[4]?.randomizedPlugSetHash &&
                plugSets[item.sockets.socketEntries[3].randomizedPlugSetHash]?.reusablePlugItems.some(plug => plug.plugItemHash === perkHash1) &&
                plugSets[item.sockets.socketEntries[4].randomizedPlugSetHash]?.reusablePlugItems.some(plug => plug.plugItemHash === perkHash2)
            );
        
            const perkOrder2 = (
                item.itemType === 3 &&
                item.sockets?.socketEntries?.[3]?.randomizedPlugSetHash &&
                item.sockets?.socketEntries?.[4]?.randomizedPlugSetHash &&
                plugSets[item.sockets.socketEntries[4].randomizedPlugSetHash]?.reusablePlugItems.some(plug => plug.plugItemHash === perkHash1) &&
                plugSets[item.sockets.socketEntries[3].randomizedPlugSetHash]?.reusablePlugItems.some(plug => plug.plugItemHash === perkHash2)
            );

            return perkOrder1 || perkOrder2;
        });

        const filteredWeapons = weaponsWithBothPerks.map(weapon => {
            const sockets = [];

            if (weapon.sockets?.socketEntries) {
                const filteredSockets = [0, 1, 2, 3, 4, 8]
                    .map(index => weapon.sockets.socketEntries[index])
                    .filter(socket => socket !== undefined);

                filteredSockets.forEach((socket, index) => {
                    if (socket) {
                        const socketHash = [0, 5, 6, 7, 8].includes(index)
                            ? socket.reusablePlugSetHash
                            : socket.randomizedPlugSetHash;

                        if (socketHash) {
                            const plugSet = plugSets[socketHash];

                            if (plugSet?.reusablePlugItems) {
                                const perks = plugSet.reusablePlugItems.map(plug => {
                                    const plugItem = items[plug.plugItemHash];

                                    if (plugItem) {
                                        if ((index === 3 || index === 4) && plugItem.inventory?.tierTypeName !== "Común") {
                                            return null;
                                        }

                                        return {
                                            name: plugItem.displayProperties.name,
                                            icon: plugItem.displayProperties.icon,
                                            itemTypeDisplayName: plugItem.itemTypeDisplayName,
                                            description: plugItem.displayProperties.description,
                                            highlighted: plugItem.plugItemHash === perkHash1 || plugItem.plugItemHash === perkHash2
                                        };
                                    }
                                    return null;
                                }).filter(perk => perk !== null);

                                sockets.push({
                                    itemTypeDisplayName: perks.length > 0 ? perks[0].itemTypeDisplayName : "Desconocido",
                                    perks
                                });
                            }
                        }
                    }
                });
            }

            return {
                name: weapon.displayProperties.name,
                icon: `https://www.bungie.net${weapon.displayProperties.icon}`,
                flavorText: weapon.flavorText || "No hay descripción",
                iconWatermark: weapon.iconWatermark ? `https://www.bungie.net${weapon.iconWatermark}` : null,
                sockets
            };
        });


        return NextResponse.json({ weapons: filteredWeapons });
    } catch (error) {
        console.error("Error detallado:", error);
        return NextResponse.json({ error: "Error al procesar la solicitud" }, { status: 500 });
    }
}

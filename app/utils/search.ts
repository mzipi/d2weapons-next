interface Item {
    displayProperties?: {
        name?: string;
        icon?: string;
    };
    inventory?: {
        tierTypeName?: string;
    };
    sockets?: {
        socketEntries?: Array<{
            reusablePlugSetHash?: string;
            randomizedPlugSetHash?: string;
        }>;
    };
    itemType?: number;
    flavorText?: string;
    iconWatermark?: string;
    [key: string]: unknown;
}

interface PlugSet {
    reusablePlugItems: Array<{
        plugItemHash: string;
    }>;
}

export function normalizeText(text: string): string {
    return text
        .normalize("NFD")
        .replace(/[̀-ͯ]/g, "")
        .toLowerCase();
}

export function searchPerk(perkName: string, items: Record<string, Item>): Item | undefined {
    normalizeText(perkName);

    return Object.values(items).find(item =>
        item.displayProperties?.name?.toLowerCase() === perkName.toLowerCase() &&
        item.inventory?.tierTypeName === "Común"
    );
}

export function findWeaponsWithPerks(
    perkHash1: string,
    perkHash2: string,
    items: Record<string, Item>,
    plugSets: Record<string, PlugSet>
): Item[] {
    return Object.values(items).filter(item => {
        const hasPerks = (slot1: number, slot2: number) =>
            item.sockets?.socketEntries?.[slot1]?.randomizedPlugSetHash &&
            item.sockets?.socketEntries?.[slot2]?.randomizedPlugSetHash &&
            plugSets[item.sockets.socketEntries[slot1].randomizedPlugSetHash]?.reusablePlugItems.some(plug => plug.plugItemHash === perkHash1) &&
            plugSets[item.sockets.socketEntries[slot2].randomizedPlugSetHash]?.reusablePlugItems.some(plug => plug.plugItemHash === perkHash2);

        return item.itemType === 3 && (hasPerks(3, 4) || hasPerks(4, 3));
    });
}

export function formatWeapons(
    weapons: Item[],
    items: Record<string, Item>,
    plugSets: Record<string, PlugSet>,
    perkHash1: string,
    perkHash2: string
) {
    return weapons.map(weapon => {
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
                                        highlighted: plugItem.hash === perkHash1 || plugItem.hash === perkHash2
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
}
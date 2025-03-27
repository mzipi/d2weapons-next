interface DisplayProperties {
    name?: string;
    icon?: string;
}

interface DestinyPresentationNode {
    displayProperties?: DisplayProperties;
}

interface Data {
    DestinyPresentationNodeDefinition: Record<string, DestinyPresentationNode>;
}

export const ammoTypeMap: Record<number, string> = {
    0: "None",
    1: "Principal",
    2: "Especial",
    3: "Pesada",
    4: "Desconocida"
};

export const findAmmoTypeNameFromNodeDefinition = (ammoTypeId: number, data: Data): string | null => {
    const ammoTypeNameFromMap = ammoTypeMap[ammoTypeId] || "Desconocido";
    const ammoTypeNode = Object.values(data.DestinyPresentationNodeDefinition).find(item => {
        return item.displayProperties?.name === ammoTypeNameFromMap;
    });

    if (ammoTypeNode) {
        const icon = ammoTypeNode.displayProperties?.icon;
        return icon ? `https://www.bungie.net${icon}` : null;
    }

    return null;
};
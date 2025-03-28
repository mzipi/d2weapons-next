export interface DisplayProperties {
    name: string;
}

export interface CollectibleDisplayProperties extends DisplayProperties {
    icon: string;
}

export interface PerkDisplayProperties extends CollectibleDisplayProperties {
    description: string;
}

export interface StatDisplayProperties extends DisplayProperties {
    description: string;
}

export interface Inventory {
    tierTypeName: string;
}

export interface Sockets {
    socketEntries: SocketEntry[];
}

export interface SocketEntry {
    randomizedPlugSetHash?: number;
    reusablePlugSetHash?: number;
}

export interface WeaponStats {
    statGroupHash: number;
    stats: {
        [key: number]: {
            statHash: number;
            value: number;
        };
    };
}

export interface Stat {
    displayProperties: StatDisplayProperties;
    statCategory: number;
    hash: number;
}

export interface StatGroup {
    scaledStats: [
        {
            statHash: number;
        }
    ]
    hash: number;
}

export interface EquipmentSlot {
    displayProperties: StatDisplayProperties;
    hash: number;
}

export interface Collectible {
    displayProperties: CollectibleDisplayProperties;
    sourceString: string;
    parentNodeHashes: number[];
    hash: number;
}

export interface PresentationNode {
    hash: number;
    parentNodeHashes: number[];
}

export interface WeaponSubType extends PresentationNode {
    children: {
        collectibles: { collectibleHash: number }[];
    }
}

export interface WeaponTypePresentation extends PresentationNode {
    children: {
        presentationNodes: { presentationNodeHash: number }[];
    }
}

export interface AmmoType extends WeaponTypePresentation {
    displayProperties: PerkDisplayProperties;
    children: {
        presentationNodes: { presentationNodeHash: number }[];
    };
}

export interface WeaponTypeCategory {
    displayProperties: DisplayProperties;
    hash: number;
}

export interface EquippingBlock {
    equipmentSlotTypeHash: number;
    ammoType: number;
}

export interface ReusablePlugItem {
    plugItemHash: number;
}

export interface PlugSet {
    reusablePlugItems: ReusablePlugItem[];
}

export interface BaseItemCategory {
    hash: number;
}

export interface ItemCategory1 extends BaseItemCategory {
    displayProperties: DisplayProperties;
    groupedCategoryHashes: number[];
}

export interface ItemCategory2 extends BaseItemCategory {
    displayProperties: StatDisplayProperties;
}

export interface InventoryItem {
    itemType: number;
    inventory: Inventory;
    displayProperties: DisplayProperties;
    hash: number;
    itemTypeDisplayName: string;
}

export interface Trait extends InventoryItem {
    displayProperties: PerkDisplayProperties;
}

export interface Weapon extends InventoryItem {
    sockets: Sockets;
    collectibleHash: number;
    screenshot: string;
    flavorText: string;
    stats: WeaponStats;
    equippingBlock: EquippingBlock;
    itemCategoryHashes: number[];
    damageTypeHashes: number[];
}
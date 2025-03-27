async function getManifestUrls() {
    try {
        const response = await fetch("https://www.bungie.net/Platform/Destiny2/Manifest/");
        
        if (!response.ok) {
            throw new Error(`Error al obtener el manifiesto: ${response.statusText}`);
        }
        
        const data = await response.json();
        const contentPaths = data.Response.jsonWorldComponentContentPaths['es-mx'];
        
        if (!contentPaths) {
            throw new Error('No se encontraron rutas de contenido en el manifiesto.');
        }
        
        const definitions = [
            // 'DestinyDamageTypeDefinition',
            // 'DestinyEquipmentSlotDefinition',
            // 'DestinyBreakerTypeDefinition',
            'DestinyInventoryItemDefinition',
            // 'DestinyPresentationNodeDefinition',
            // 'DestinyStatDefinition',
            'DestinyPlugSetDefinition',
            // 'DestinySandboxPerkDefinition',
            // 'DestinyCollectibleDefinition',
            // 'DestinyRewardSourceDefinition',
            // 'DestinySeasonDefinition'
        ];
        
        const urls = definitions.reduce((acc, definition) => {
            if (contentPaths[definition]) {
                acc[definition] = `https://www.bungie.net${contentPaths[definition]}`;
            } else {
                console.warn(`No se encontró la definición: ${definition}`);
            }
            return acc;
        }, {});

        return urls;
    } catch (error) {
        console.error('Error en getManifestUrls:', error);
        return null;
    }
}

export async function loadManifest() {
    try {
        const urls = await getManifestUrls();
        if (!urls) throw new Error("No se pudieron obtener las URLs del manifiesto.");

        const [items, plugSets] = await Promise.all([
            fetch(urls.DestinyInventoryItemDefinition).then(res => res.json()),
            fetch(urls.DestinyPlugSetDefinition).then(res => res.json()),
        ]);

        return { items, plugSets };
    } catch (error) {
        console.error("Error al cargar el manifiesto:", error);
        throw new Error("Error al cargar los manifiestos.");
    }
}

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
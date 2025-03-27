export default function SearchForm({ perk1, setPerk1, perk2, setPerk2, onSearch, loading }) {
    return (
        <div id="search-container">
            <input
                type="text"
                placeholder="Rasgo 1"
                id="search"
                value={perk1}
                onChange={(e) => setPerk1(e.target.value)}
                onKeyDown={(e) => {
                    if (e.key === "Enter") {
                        e.preventDefault();
                        onSearch();
                    }
                }}
            />

            <input
                type="text"
                placeholder="Rasgo 2"
                id="search"
                value={perk2}
                onChange={(e) => setPerk2(e.target.value)}
                onKeyDown={(e) => {
                    if (e.key === "Enter") {
                        e.preventDefault();
                        onSearch();
                    }
                }}
            />

            <button onClick={onSearch} disabled={loading}>
                {loading ? "Cargando..." : "Buscar"}
            </button>
        </div>
    );
}
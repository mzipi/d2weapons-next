import { ChangeEvent } from "react";

interface SearchFormProps {
    perk1: string;
    setPerk1: (value: string) => void;
    perk2: string;
    setPerk2: (value: string) => void;
    onSearch: () => void;
    loading: boolean;
}

export default function SearchForm({
    perk1,
    setPerk1,
    perk2,
    setPerk2,
    onSearch,
    loading,
}: SearchFormProps) {
    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
            e.preventDefault();
            onSearch();
        }
    };

    const handleChange = (setPerk: (value: string) => void) => (
        e: ChangeEvent<HTMLInputElement>
    ) => {
        setPerk(e.target.value);
    };

    return (
        <div id="search-container">
            <input
                type="text"
                placeholder="Rasgo 1"
                id="search"
                value={perk1}
                onChange={handleChange(setPerk1)}
                onKeyDown={handleKeyDown}
            />

            <input
                type="text"
                placeholder="Rasgo 2"
                id="search"
                value={perk2}
                onChange={handleChange(setPerk2)}
                onKeyDown={handleKeyDown}
            />

            <button onClick={onSearch} disabled={loading}>
                {loading ? "Cargando..." : "Buscar"}
            </button>
        </div>
    );
}

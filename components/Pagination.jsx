export default function Pagination({ currentPage, total, onPageChange }) {
    return (
        <div id="buttons-container">
            <button
                onClick={() => onPageChange((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
            >
                Anterior
            </button>
            <button
                onClick={() => onPageChange((prev) => (prev < total ? prev + 1 : prev))}
                disabled={currentPage >= total}
            >
                Siguiente
            </button>
        </div>
    );
}
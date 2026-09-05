import { FiTrash2, FiRss, FiGlobe } from "react-icons/fi";
import type { CriteriaListProps } from "../../../types";

export default function CriteriaList({
  criteria,
  toggleActive,
  removeCriteria,
}: CriteriaListProps) {
  if (criteria.length === 0) {
    return (
      <p className="text-center py-8 text-gray-700 dark:text-gray-400">
        Aucun critère de recherche pour le moment. Créez-en un ci-dessus.
      </p>
    );
  }

  return (
    <ul className="flex flex-col gap-2">
      {criteria.map((c) => (
        <li
          key={c.id}
          className="flex flex-wrap items-center justify-between gap-3 p-3 bg-white/60 dark:bg-gray-800 shadow-md rounded-xl"
        >
          <div className="flex items-center gap-3">
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={c.active}
                onChange={() => toggleActive(c.id, !c.active)}
                className="sr-only peer"
              />
              <div className="w-9 h-5 bg-gray-300 rounded-full peer peer-checked:bg-red-600 transition-colors" />
              <div className="absolute left-0.5 top-0.5 w-4 h-4 bg-white rounded-full transition-transform peer-checked:translate-x-4" />
            </label>

            <div>
              <p
                className={`font-semibold ${
                  c.active
                    ? "text-red-600 dark:text-red-400"
                    : "text-gray-400 line-through"
                }`}
              >
                {c.name}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {c.city} · {c.propertyType} · jusqu'à {c.maxPrice}€
                {c.minRooms ? ` · ${c.minRooms}+ pièces` : ""}
                {c.minSurface ? ` · ${c.minSurface}+ m²` : ""}
                {c.feedUrl && (
                  <span className="inline-flex items-center gap-1 ml-2 text-green-600">
                    <FiRss size={12} /> flux RSS
                  </span>
                )}
                {c.sources?.map((source) => (
                  <span
                    key={source}
                    className="inline-flex items-center gap-1 ml-2 text-green-600"
                  >
                    <FiGlobe size={12} /> {source}
                  </span>
                ))}
                {!c.feedUrl && !c.sources?.length && (
                  <span className="ml-2 italic">
                    (aucune source configurée)
                  </span>
                )}
              </p>
            </div>
          </div>

          <FiTrash2
            onClick={() => removeCriteria(c.id)}
            className="text-gray-600 dark:text-gray-300 hover:text-red-500 cursor-pointer"
            size={18}
          />
        </li>
      ))}
    </ul>
  );
}

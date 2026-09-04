import { useState } from "react";
import { FiPlus } from "react-icons/fi";
import type { CriteriaFormProps, PropertyType } from "../../../types";

export default function CriteriaForm({ addCriteria }: CriteriaFormProps) {
  const [name, setName] = useState("");
  const [city, setCity] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [minRooms, setMinRooms] = useState("");
  const [minSurface, setMinSurface] = useState("");
  const [propertyType, setPropertyType] = useState<PropertyType>("appartement");
  const [feedUrl, setFeedUrl] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!city.trim() || !maxPrice) return;

    await addCriteria({
      name: name.trim() || `${city.trim()} - ${maxPrice}€`,
      city: city.trim(),
      minPrice: minPrice ? Number(minPrice) : undefined,
      maxPrice: Number(maxPrice),
      minRooms: minRooms ? Number(minRooms) : undefined,
      minSurface: minSurface ? Number(minSurface) : undefined,
      propertyType,
      feedUrl: feedUrl.trim() || undefined,
    });

    setName("");
    setCity("");
    setMinPrice("");
    setMaxPrice("");
    setMinRooms("");
    setMinSurface("");
    setPropertyType("appartement");
    setFeedUrl("");
  }

  const inputClass =
    "w-full px-4 py-2 rounded border focus:ring-2 focus:ring-red-500 text-sm sm:text-base dark:bg-gray-800 dark:text-white";

  return (
    <form
      onSubmit={handleSubmit}
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full"
    >
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Nom de la recherche (optionnel)"
        className={`${inputClass} lg:col-span-2`}
      />

      <input
        type="text"
        value={city}
        onChange={(e) => setCity(e.target.value)}
        placeholder="Ville *"
        required
        className={inputClass}
      />

      <select
        value={propertyType}
        onChange={(e) => setPropertyType(e.target.value as PropertyType)}
        className={inputClass}
      >
        <option value="appartement">Appartement</option>
        <option value="maison">Maison</option>
        <option value="tous">Tous types</option>
      </select>

      <input
        type="number"
        min={0}
        value={minPrice}
        onChange={(e) => setMinPrice(e.target.value)}
        placeholder="Prix min (€)"
        className={inputClass}
      />

      <input
        type="number"
        min={0}
        value={maxPrice}
        onChange={(e) => setMaxPrice(e.target.value)}
        placeholder="Prix max (€) *"
        required
        className={inputClass}
      />

      <input
        type="number"
        min={0}
        value={minRooms}
        onChange={(e) => setMinRooms(e.target.value)}
        placeholder="Pièces min"
        className={inputClass}
      />

      <input
        type="number"
        min={0}
        value={minSurface}
        onChange={(e) => setMinSurface(e.target.value)}
        placeholder="Surface min (m²)"
        className={inputClass}
      />

      <input
        type="url"
        value={feedUrl}
        onChange={(e) => setFeedUrl(e.target.value)}
        placeholder="Flux RSS de la recherche (optionnel)"
        className={`${inputClass} lg:col-span-3`}
        title="URL d'un flux RSS/Atom d'alertes (ex: recherche sauvegardée sur un portail immobilier) que l'agent doit surveiller pour ce critère"
      />

      <button
        type="submit"
        className="flex items-center justify-center gap-2 p-3 bg-red-600 text-white rounded-full shadow hover:bg-red-700 transition"
      >
        <FiPlus size={20} />
        <span className="sm:hidden lg:inline">Créer l'alerte</span>
      </button>
    </form>
  );
}

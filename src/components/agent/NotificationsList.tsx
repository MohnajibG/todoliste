import { FiExternalLink, FiTrash2 } from "react-icons/fi";
import type { NotificationsListProps } from "../../../types";

export default function NotificationsList({
  notifications,
  markAsRead,
  removeNotification,
}: NotificationsListProps) {
  if (notifications.length === 0) {
    return (
      <p className="text-center py-8 text-gray-700 dark:text-gray-400">
        Aucune annonce trouvée pour l'instant. L'agent vous préviendra ici dès
        qu'une annonce correspond à l'un de vos critères.
      </p>
    );
  }

  return (
    <ul className="flex flex-col gap-2">
      {notifications.map((n) => (
        <li
          key={n.id}
          onClick={() => !n.read && markAsRead(n.id)}
          className={`flex flex-wrap items-center justify-between gap-3 p-3 shadow-md rounded-xl cursor-pointer ${
            n.read
              ? "bg-white/40 dark:bg-gray-800/60"
              : "bg-white dark:bg-gray-800 ring-2 ring-red-500"
          }`}
        >
          <div>
            <p className="font-semibold text-red-600 dark:text-red-400">
              {n.listing.title}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {n.listing.city} · {n.listing.price}€
              {n.listing.rooms ? ` · ${n.listing.rooms} pièces` : ""}
              {n.listing.surface ? ` · ${n.listing.surface} m²` : ""} ·
              critère « {n.criteriaName} »
            </p>
          </div>

          <div className="flex items-center gap-3">
            <a
              href={n.listing.url}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="text-gray-600 dark:text-gray-300 hover:text-red-500"
              title="Voir l'annonce"
            >
              <FiExternalLink size={18} />
            </a>
            <FiTrash2
              onClick={(e) => {
                e.stopPropagation();
                removeNotification(n.id);
              }}
              className="text-gray-600 dark:text-gray-300 hover:text-red-500 cursor-pointer"
              size={18}
            />
          </div>
        </li>
      ))}
    </ul>
  );
}

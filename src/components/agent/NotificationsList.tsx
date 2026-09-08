import { FiExternalLink, FiTrash2, FiHome } from "react-icons/fi";
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
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
      {notifications.map((n) => (
        <div
          key={n.id}
          onClick={() => !n.read && markAsRead(n.id)}
          className={`flex flex-col overflow-hidden bg-white/60 dark:bg-gray-800 shadow-md rounded-xl cursor-pointer ${
            n.read ? "" : "ring-2 ring-red-500"
          }`}
        >
          <div className="h-36 bg-gray-200 dark:bg-gray-700 flex items-center justify-center overflow-hidden">
            {n.listing.imageUrl ? (
              <img
                src={n.listing.imageUrl}
                alt={n.listing.title}
                className="w-full h-full object-cover"
              />
            ) : (
              <FiHome size={32} className="text-gray-400 dark:text-gray-500" />
            )}
          </div>

          <div className="flex flex-col flex-1 p-3 gap-1">
            <p className="font-semibold text-red-600 dark:text-red-400 line-clamp-2">
              {n.listing.title}
            </p>
            <p className="text-lg font-bold text-gray-900 dark:text-white">
              {n.listing.price}€
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {n.listing.city}
              {n.listing.rooms ? ` · ${n.listing.rooms} pièces` : ""}
              {n.listing.surface ? ` · ${n.listing.surface} m²` : ""}
            </p>
            <p className="text-xs text-gray-400 dark:text-gray-500 italic">
              critère « {n.criteriaName} » · {n.listing.source}
            </p>

            <div className="flex items-center justify-between mt-auto pt-2">
              <a
                href={n.listing.url}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="flex items-center gap-1 text-sm text-gray-700 dark:text-gray-300 hover:text-red-500"
              >
                <FiExternalLink size={16} /> Voir l'annonce
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
          </div>
        </div>
      ))}
    </div>
  );
}

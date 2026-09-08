import { useEffect, useState } from "react";
import { FiBell, FiBellOff } from "react-icons/fi";
import { enablePushNotifications, disablePushNotifications } from "../../utils/messaging";

interface PushNotificationToggleProps {
  userId: string;
}

type Status = "unknown" | "enabling" | "granted" | "denied" | "unsupported";

export default function PushNotificationToggle({
  userId,
}: PushNotificationToggleProps) {
  const [status, setStatus] = useState<Status>("unknown");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!("Notification" in window)) {
      setStatus("unsupported");
      return;
    }
    if (Notification.permission === "granted") setStatus("granted");
    else if (Notification.permission === "denied") setStatus("denied");
    else setStatus("unknown");
  }, []);

  async function handleEnable() {
    setStatus("enabling");
    setError(null);

    const result = await enablePushNotifications(userId);
    if (result.status === "unsupported") setError(result.reason);
    setStatus(result.status === "granted" ? "granted" : result.status);
  }

  async function handleDisable() {
    await disablePushNotifications(userId);
    setStatus("unknown");
  }

  if (status === "unsupported") {
    return (
      <p className="text-xs text-gray-500 dark:text-gray-400 italic">
        Notifications push indisponibles : {error ?? "navigateur non supporté"}
      </p>
    );
  }

  if (status === "granted") {
    return (
      <button
        type="button"
        onClick={handleDisable}
        className="flex items-center gap-2 text-sm text-green-600 dark:text-green-400 hover:text-red-600 transition"
        title="Désactiver les notifications push"
      >
        <FiBell size={16} />
        Notifications push activées
      </button>
    );
  }

  if (status === "denied") {
    return (
      <p className="text-xs text-gray-500 dark:text-gray-400 italic">
        Notifications bloquées par le navigateur. Autorisez-les dans les
        paramètres du site pour les recevoir même app fermée.
      </p>
    );
  }

  return (
    <button
      type="button"
      onClick={handleEnable}
      disabled={status === "enabling"}
      className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300 hover:text-red-600 disabled:opacity-50 transition"
    >
      <FiBellOff size={16} />
      {status === "enabling"
        ? "Activation..."
        : "Recevoir une notification à chaque nouvelle annonce"}
    </button>
  );
}

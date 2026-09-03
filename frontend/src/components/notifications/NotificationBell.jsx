import { Bell, Check, Trash2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import API from "../../services/api";

function NotificationBell() {
  const [notifications, setNotifications] = useState([]);
  const [open, setOpen] = useState(false);
  const containerRef = useRef(null);

  const fetchNotifications = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await API.get("/api/notifications", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setNotifications(
        Array.isArray(res.data) ? res.data : []
      );
    } catch (err) {
      console.log("Notification Error:", err);
    }
  };

  useEffect(() => {
    fetchNotifications();

    // Light polling so the bell stays roughly up to date without
    // needing a manual refresh — 60s is plenty for this use case.
    const interval = setInterval(fetchNotifications, 60000);

    return () => clearInterval(interval);
  }, []);

  // Close the dropdown when clicking outside it.
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target)
      ) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () =>
      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );
  }, []);

  const unreadCount = notifications.filter(
    (item) => Number(item.is_read) === 0
  ).length;

  const markAsRead = async (id) => {
    try {
      const token = localStorage.getItem("token");

      await API.put(
        `/api/notifications/${id}/read`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setNotifications((prev) =>
        prev.map((item) =>
          item.id === id
            ? { ...item, is_read: 1 }
            : item
        )
      );
    } catch (err) {
      console.log("Mark as read error:", err);
    }
  };

  const deleteOne = async (id) => {
    try {
      const token = localStorage.getItem("token");

      await API.delete(`/api/notifications/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setNotifications((prev) =>
        prev.filter((item) => item.id !== id)
      );
    } catch (err) {
      console.log("Delete notification error:", err);
    }
  };

  const clearAll = async () => {
    try {
      const token = localStorage.getItem("token");

      await API.delete("/api/notifications", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setNotifications([]);
    } catch (err) {
      console.log("Clear notifications error:", err);
    }
  };

  return (
    <div
      className="relative"
      ref={containerRef}
    >
      <button
        onClick={() => setOpen((prev) => !prev)}
        className="relative rounded-xl bg-muted p-3 hover:opacity-80"
      >
        <Bell
          size={20}
          className="text-foreground"
        />

        {unreadCount > 0 && (
          <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs text-white">
            {unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 z-50 mt-3 w-80 rounded-xl border border-border bg-card shadow-xl">

          <div className="flex items-center justify-between border-b border-border p-4 font-bold text-card-foreground">
            <span>Notifications</span>

            {notifications.length > 0 && (
              <button
                onClick={clearAll}
                className="text-xs font-normal text-muted-foreground hover:text-red-500"
              >
                Clear all
              </button>
            )}
          </div>

          <div className="max-h-96 overflow-y-auto">

            {notifications.length === 0 ? (
              <div className="p-6 text-center text-muted-foreground">
                No Notifications
              </div>
            ) : (
              notifications.map((item) => (
                <div
                  key={item.id}
                  className={`group flex items-start justify-between gap-2 border-b border-border p-4 hover:bg-muted ${Number(item.is_read) === 0
                    ? "bg-primary/5"
                    : ""
                    }`}
                >
                  <div className="min-w-0 flex-1">
                    <h3 className="font-semibold text-card-foreground">
                      {item.title}
                    </h3>

                    <p className="mt-1 text-sm text-muted-foreground">
                      {item.message}
                    </p>

                    <p className="mt-1 text-xs text-muted-foreground">
                      {new Date(
                        item.created_at
                      ).toLocaleString("en-IN")}
                    </p>
                  </div>

                  <div className="flex shrink-0 gap-1 opacity-0 transition-opacity group-hover:opacity-100">

                    {Number(item.is_read) === 0 && (
                      <button
                        onClick={() =>
                          markAsRead(item.id)
                        }
                        title="Mark as read"
                        className="rounded-md p-1.5 hover:bg-green-100 hover:text-green-600"
                      >
                        <Check size={14} />
                      </button>
                    )}

                    <button
                      onClick={() =>
                        deleteOne(item.id)
                      }
                      title="Delete"
                      className="rounded-md p-1.5 hover:bg-red-100 hover:text-red-600"
                    >
                      <Trash2 size={14} />
                    </button>

                  </div>
                </div>
              ))
            )}

          </div>

        </div>
      )}
    </div>
  );
}

export default NotificationBell;
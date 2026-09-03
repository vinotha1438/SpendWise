let ioInstance = null;

// Called once, from server.js, right after the Socket.io server
// is created.
function initSocket(io) {
  ioInstance = io;
}

// Emits a "data-changed" event to every device currently connected
// for this specific user (their phone, laptop, another browser tab,
// etc.) — each of them is listening in DataContext and will quietly
// refetch when they receive it. Safe to call even before the socket
// server exists (e.g. in tests) since it just no-ops if unset.
function notifyUser(userId) {
  if (!ioInstance || !userId) return;

  ioInstance.to(`user_${userId}`).emit("data-changed");
}

module.exports = {
  initSocket,
  notifyUser,
};
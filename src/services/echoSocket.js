
const ECHO_URL = "wss://ts.idicorp.ir/ws/echo";

export function createEchoSocket({
  onStatus = () => {},
  onMessage = () => {},
  onError = () => {},
}) {
  const socket = new WebSocket(ECHO_URL);
  let ready = false;

  onStatus("connecting");

  socket.addEventListener("open", () => {
    onStatus("connected");
  });

  socket.addEventListener("message", (event) => {
    let data;

    try {
      data = JSON.parse(event.data);

      if (data.type === "ready") {
        ready = true;
        onStatus("connected");
        return;
      }
    } catch {
      // Echo responses may be plain text rather than JSON.
      data = event.data;
    }

    onMessage(data);
  });

  socket.addEventListener("error", () => {
    onError(new Error("Text Echo connection failed."));
  });

  socket.addEventListener("close", () => {
    ready = false;
    onStatus("disconnected");
  });

  function sendMessage(message) {
    if (!ready || socket.readyState !== WebSocket.OPEN) {
      onError(new Error("Text Echo is not ready yet."));
      return false;
    }

    socket.send(message);
    return true;
  }

  return {
    sendMessage,
    close: () => socket.close(),
  };
}

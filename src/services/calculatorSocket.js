
const CALCULATOR_URL = "wss://ts.idicorp.ir/ws/calculator";

export function createCalculatorSocket({
  token,
  onStatus = () => {},
  onMessage = () => {},
  onError = () => {},
}) {
  const socket = new WebSocket(CALCULATOR_URL);
  let authenticated = false;

  onStatus("connecting");

  socket.addEventListener("open", () => {
    socket.send(JSON.stringify({ token }));
  });

  socket.addEventListener("message", (event) => {
    let data;

    try {
      data = JSON.parse(event.data);
    } catch {
      onError(new Error("Invalid response from calculator service."));
      return;
    }

    if (data.type === "ready") {
      authenticated = true;
      onStatus("connected");
      return;
    }

    if (data.type === "unauthorized") {
      onStatus("unauthorized");
      return;
    }

    onMessage(data);
  });

  socket.addEventListener("error", () => {
    onError(new Error("Calculator WebSocket connection failed."));
  });

  socket.addEventListener("close", () => {
    authenticated = false;
    onStatus("disconnected");
  });

  function calculate(operation, numbers) {
    if (!authenticated || socket.readyState !== WebSocket.OPEN) {
      onError(new Error("Calculator is not connected."));
      return false;
    }

    socket.send(JSON.stringify({ operation, numbers }));
    return true;
  }

  return {
    calculate,
    close: () => socket.close(),
  };
}


// const ECHO_URL = "wss://ts.idicorp.ir/ws/echo";

// export function createEchoSocket({
//   onStatus = () => {},
//   onMessage = () => {},
//   onError = () => {},
// }) {
  // let socket;

//   onStatus("connecting");

//   try {
//     socket = new WebSocket(ECHO_URL);
//   } catch {
//     onStatus("disconnected");
//     onError(new Error("Could not create Echo WebSocket connection."));
//     return {
//       send: () => false,
//       close: () => {},
//     };
//   }

//   socket.addEventListener("open", () => {
//     // The server should send { "type": "ready" }.
//     // Wait for that message before marking the service as ready.
//   });

//   socket.addEventListener("message", (event) => {
//     let data = event.data;

//     // The ready notification is JSON. Echo messages may be plain text.
//     try {
//       const parsed = JSON.parse(event.data);

//       if (parsed?.type === "ready") {
//         onStatus("connected");
//         return;
//       }

//       data = parsed;
//     } catch {
//       // Ordinary text messages are valid echo payloads.
//     }

//     onMessage(data);
//   });

//   socket.addEventListener("error", (event) => {
//     console.error("Echo WebSocket error:", event);
//     onError(new Error("Echo WebSocket connection failed."));
//   });

//   socket.addEventListener("close", (event) => {
//     console.log("Echo WebSocket closed:", {
//       code: event.code,
//       reason: event.reason,
//       wasClean: event.wasClean,
//     });
  
//     onStatus("disconnected");
//   });

//   function send(message) {
//     if (socket.readyState !== WebSocket.OPEN) {
//       return false;
//     }

//     socket.send(message);
//     return true;
//   }

//   return {
//     send,
//     close: () => socket.close(),
//   };
// }





const ECHO_URL = "wss://ts.idicorp.ir/ws/echo";

export function createEchoSocket({
  token,
  onStatus = () => {},
  onMessage = () => {},
  onError = () => {},
}) {
  onStatus("connecting");

  const socket = new WebSocket(ECHO_URL);

  socket.addEventListener("open", () => {
    console.log("[Echo] Connection opened");

    // Only test token authentication if the server
    // documentation confirms this message format.
    if (token) {      
      
      socket.send(JSON.stringify({ token }));
    }
  });

  socket.addEventListener("message", (event) => {
    console.log("[Echo] Received:", event.data);

    try {
      const data = JSON.parse(event.data);

      if (data?.type === "ready") {
        onStatus("connected");
        return;
      }

      onMessage(data);
    } catch {
      onMessage(event.data);
    }
  });

  socket.addEventListener("error", (event) => {
    console.error("[Echo] WebSocket error:", event);
    onError(new Error("Echo WebSocket connection failed."));
  });

  socket.addEventListener("close", (event) => {
    console.log("[Echo] Closed:", {
      code: event.code,
      reason: event.reason,
      wasClean: event.wasClean,
    });

    onStatus("disconnected");
  });

  return {
    send(message) {
      if (socket.readyState !== WebSocket.OPEN) {
        return false;
      }

      socket.send(message);
      return true;
    },
    close() {
      socket.close();
    },
  };
}
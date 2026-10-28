
import { useEffect, useRef, useState } from "react";
import { Radio, Send, Wifi, WifiOff } from "lucide-react";
import SectionTitle from "../components/SectionTitle.jsx";
import { createEchoSocket } from "../services/echoSocket.js";

export default function EchoPage({ onNotice }) {
  const socketRef = useRef(null);
  const [status, setStatus] = useState("connecting");
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const client = createEchoSocket({
      onStatus: setStatus,
      onMessage: (data) => {
        const text =
          typeof data === "string" ? data : JSON.stringify(data);

        setMessages((current) => [
          ...current,
          {
            id: `${Date.now()}-${Math.random()}`,
            direction: "received",
            text,
            time: new Date().toLocaleTimeString(),
          },
        ]);
      },
      onError: (err) => setError(err.message),
    });

    socketRef.current = client;

    return () => {
      client.close();
      socketRef.current = null;
    };
  }, []);

  function handleSend(event) {
    event.preventDefault();

    if (!message.trim()) {
      setError("Enter a message first.");
      return;
    }

    setError("");

    const sent = socketRef.current?.sendMessage(message);

    if (!sent) {
      setError("Echo service is not ready yet.");
      return;
    }

    setMessages((current) => [
      ...current,
      {
        id: `${Date.now()}-${Math.random()}`,
        direction: "sent",
        text: message,
        time: new Date().toLocaleTimeString(),
      },
    ]);

    setMessage("");
  }

  return (
    <div className="page-section">
      <SectionTitle
        eyebrow="WEBSOCKET TOOL"
        title="Text Echo"
        description="Send messages and receive their responses over a persistent connection."
      />

      <section className="panel echo-panel">
        <div className="connection-status">
          {status === "connected" ? <Wifi size={18} /> : <WifiOff size={18} />}
          <span>
            {status === "connected"
              ? "Connected"
              : status === "connecting"
                ? "Connecting..."
                : "Disconnected"}
          </span>
          <span className={`status-dot ${status === "connected" ? "online" : ""}`} />
        </div>

        <div className="echo-messages" aria-live="polite">
          {messages.length === 0 ? (
            <div className="empty-state">
              <Radio size={26} />
              <h3>No messages yet</h3>
              <p>Send a message to test the echo service.</p>
            </div>
          ) : (
            messages.map((item) => (
              <div
                key={item.id}
                className={`echo-message ${item.direction}`}
              >
                <div className="echo-message-meta">
                  <strong>
                    {item.direction === "sent" ? "You" : "Server"}
                  </strong>
                  <time>{item.time}</time>
                </div>
                <p>{item.text}</p>
              </div>
            ))
          )}
        </div>

        <form className="echo-form" onSubmit={handleSend}>
          <input
            aria-label="Message to send"
            value={message}
            onChange={(event) => setMessage(event.target.value)}
            placeholder="Type a message..."
          />
          <button
            type="submit"
            className="button-primary"
            disabled={status !== "connected"}
          >
            <Send size={16} /> Send
          </button>
        </form>

        {error && (
          <p className="form-error" role="alert">
            {error}
          </p>
        )}
      </section>
    </div>
  );
}

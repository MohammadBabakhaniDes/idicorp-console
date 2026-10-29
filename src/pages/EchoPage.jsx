
import { useEffect, useRef, useState } from "react";
import { MessageSquare, Send, Wifi, WifiOff } from "lucide-react";
import SectionTitle from "../components/SectionTitle.jsx";
import { createEchoSocket } from "../services/echoSocket.js";

export default function EchoPage() {
  const socketRef = useRef(null);
  const [status, setStatus] = useState("disconnected");
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {

    const token = sessionStorage.getItem("access_token");

    
    const client = createEchoSocket({
      token,
      onStatus: setStatus,

      onMessage: (data) => {
        setMessages((current) => [
          ...current,
          {
            id: `${Date.now()}-${Math.random()}`,
            direction: "received",
            text:
              typeof data === "string"
                ? data
                : JSON.stringify(data),
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

    const text = message.trim();

    if (!text) {
      setError("Please enter a message.");
      return;
    }

    if (status !== "connected") {
      setError("Echo service is not connected yet.");
      return;
    }

    const sent = socketRef.current?.send(text);

    if (!sent) {
      setError("Message could not be sent. Check the connection.");
      return;
    }

    setMessages((current) => [
      ...current,
      {
        id: `${Date.now()}-${Math.random()}`,
        direction: "sent",
        text,
      },
    ]);

    setMessage("");
    setError("");
  }

  return (
    <div className="page-section">
      <SectionTitle
        eyebrow="REAL-TIME TOOL"
        title="Text Echo"
        description="Send text messages and receive them back through a persistent WebSocket connection."
      />

      <section className="panel echo-panel">
        <div className="connection-status" aria-live="polite">
          {status === "connected" ? (
            <Wifi size={18} />
          ) : (
            <WifiOff size={18} />
          )}

          <span>
            {status === "connected"
              ? "Connected"
              : status === "connecting"
                ? "Connecting..."
                : "Disconnected"}
          </span>

          <span
            className={`status-dot ${
              status === "connected" ? "online" : ""
            }`}
          />
        </div>

        <div
          className="echo-messages"
          aria-live="polite"
          aria-label="Message history"
        >
          {messages.length === 0 ? (
            <div className="echo-empty">
              <MessageSquare size={28} />
              <p>No messages yet. Send your first message.</p>
            </div>
          ) : (
            messages.map((item) => (
              <div
                key={item.id}
                className={`echo-message ${
                  item.direction === "sent"
                    ? "echo-message-sent"
                    : "echo-message-received"
                }`}
              >
                <span className="echo-message-label">
                  {item.direction === "sent" ? "You" : "Server"}
                </span>
                <p>{item.text}</p>
              </div>
            ))
          )}
        </div>

        <form className="echo-form" onSubmit={handleSend}>
          <label htmlFor="echo-message">Message</label>

          <div className="echo-input-row">
            <input
              id="echo-message"
              value={message}
              onChange={(event) => setMessage(event.target.value)}
              placeholder="Type a message..."
              autoComplete="off"
            />

            <button
              type="submit"
              className="button-primary"
              disabled={status !== "connected" || !message.trim()}
            >
              <Send size={17} />
              Send
            </button>
          </div>
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

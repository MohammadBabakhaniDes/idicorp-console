
import { useRef, useState } from "react";
import { ArrowDownToLine, Send, X } from "lucide-react";
import SectionTitle from "../components/SectionTitle.jsx";

export default function StreamEchoPage() {
  const [input, setInput] = useState(
    "Hello from IDICorp Service Console!"
  );
  const [contentType, setContentType] = useState("text/plain");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [status, setStatus] = useState("");
  const controllerRef = useRef(null);

  async function handleSubmit(event) {
    event.preventDefault();

    if (contentType === "application/json") {
      try {
        JSON.parse(input);
      } catch {
        setError("Please enter valid JSON.");
        return;
      }
    }

    const token = sessionStorage.getItem("access_token");

    if (!token) {
      setError("Your session has expired. Please sign in again.");
      return;
    }

    controllerRef.current?.abort();

    const controller = new AbortController();
    controllerRef.current = controller;

    setLoading(true);
    setError("");
    setResult("");
    setStatus("Connecting...");

    try {
      const response = await fetch(
        "https://ts.idicorp.ir/api/echo/stream",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": contentType,
          },
          body: input,
          signal: controller.signal,
        }
      );

      if (!response.ok) {
        const message = await response.text();
        throw new Error(
          message || `Request failed (${response.status})`
        );
      }

      if (!response.body) {
        throw new Error("Streaming response is not available.");
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();

      setStatus("Receiving response...");

      try {
        while (true) {
          const { done, value } = await reader.read();

          if (done) break;

          const chunk = decoder.decode(value, {
            stream: true,
          });

          if (chunk) {
            setResult((previous) => previous + chunk);
          }
        }

        const remaining = decoder.decode();

        if (remaining) {
          setResult((previous) => previous + remaining);
        }
      } finally {
        reader.releaseLock();
      }

      setStatus("Response completed.");
    } catch (err) {
      if (err.name === "AbortError") {
        setStatus("Request cancelled.");
      } else {
        setError(err.message || "Stream request failed.");
        setStatus("");
      }
    } finally {
      if (controllerRef.current === controller) {
        controllerRef.current = null;
        setLoading(false);
      }
    }
  }

  function handleCancel() {
    controllerRef.current?.abort();
  }

  return (
    <div className="page-section">
      <SectionTitle
        eyebrow="HTTP TOOL"
        title="Stream Echo"
        description="Send content and watch the response arrive as a stream."
      />

      <section className="panel stream-panel">
        <form className="stream-form" onSubmit={handleSubmit}>
          <label htmlFor="stream-content-type">
            Content type
          </label>

          <select
            id="stream-content-type"
            value={contentType}
            onChange={(event) =>
              setContentType(event.target.value)
            }
            disabled={loading}
          >
            <option value="text/plain">text/plain</option>
            <option value="application/json">
              application/json
            </option>
            <option value="application/octet-stream">
              application/octet-stream
            </option>
          </select>

          <label htmlFor="stream-input">
            Request body
          </label>

          <textarea
            id="stream-input"
            value={input}
            onChange={(event) => setInput(event.target.value)}
            rows={7}
            required
            disabled={loading}
            placeholder="Enter content to send..."
          />

          <div className="stream-actions">
            <button
              type="submit"
              className="button-primary"
              disabled={loading}
            >
              <Send size={16} />
              {loading ? "Receiving..." : "Send request"}
            </button>

            {loading && (
              <button
                type="button"
                className="button-secondary"
                onClick={handleCancel}
              >
                <X size={16} />
                Cancel
              </button>
            )}
          </div>
        </form>

        {status && (
          <p role="status" aria-live="polite">
            {status}
          </p>
        )}

        {error && (
          <p className="form-error" role="alert">
            {error}
          </p>
        )}

        {(result !== "" || loading) && (
          <section className="stream-result">
            <div className="panel-heading">
              <h3>
                <ArrowDownToLine size={17} />
                Response
              </h3>
              <span>{contentType}</span>
            </div>

            <pre aria-live="polite" aria-label="Streaming response">
              {result || (loading ? "Waiting for data..." : "")}
            </pre>
          </section>
        )}
      </section>
    </div>
  );
}

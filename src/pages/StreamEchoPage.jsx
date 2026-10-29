
import { useState } from "react";
import { ArrowDownToLine, Send } from "lucide-react";
import SectionTitle from "../components/SectionTitle.jsx";
import api from "../services/api.js";

export default function StreamEchoPage() {
  const [input, setInput] = useState("Hello from IDICorp Service Console!");
  const [contentType, setContentType] = useState("text/plain");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const token = sessionStorage.getItem("access_token");

  async function handleSubmit(event) {
    event.preventDefault();
    setLoading(true);
    setError("");
    setResult("");

    try {
      const response = await api.post("/api/echo/stream", input, {
        // headers: {
        //   "Content-Type": contentType,
        // },
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: "",
        responseType: "text",
        transformResponse: [(data) => data],
      });

      setResult(
        typeof response.data === "string"
          ? response.data
          : JSON.stringify(response.data, null, 2)
      );
    } catch (err) {
      setError(err.message || "Stream request failed.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="page-section">
      <SectionTitle
        eyebrow="HTTP TOOL"
        title="Stream Echo"
        description="Send a request body and inspect the response returned by the API."
      />

      <section className="panel stream-panel">
        <form className="stream-form" onSubmit={handleSubmit}>
          <label htmlFor="stream-content-type">Content type</label>
          <select
            id="stream-content-type"
            value={contentType}
            onChange={(event) => setContentType(event.target.value)}
          >
            <option value="text/plain">text/plain</option>
            <option value="application/json">application/json</option>
            <option value="application/octet-stream">
              application/octet-stream
            </option>
          </select>

          <label htmlFor="stream-input">Request body</label>
          <textarea
            id="stream-input"
            value={input}
            onChange={(event) => setInput(event.target.value)}
            rows={7}
            required
            placeholder="Enter content to send..."
          />

          <button
            type="submit"
            className="button-primary"
            disabled={loading}
          >
            <Send size={16} />
            {loading ? "Sending..." : "Send request"}
          </button>
        </form>

        {error && (
          <p className="form-error" role="alert">
            {error}
          </p>
        )}

        {result !== "" && (
          <section className="stream-result">
            <div className="panel-heading">
              <h3>
                <ArrowDownToLine size={17} /> Response
              </h3>
              <span>{contentType}</span>
            </div>
            <pre>{result}</pre>
          </section>
        )}
      </section>
    </div>
  );
}

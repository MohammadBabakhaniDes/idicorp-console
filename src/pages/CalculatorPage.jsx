
import { useEffect, useRef, useState } from "react";
import { Calculator, Wifi, WifiOff } from "lucide-react";
import SectionTitle from "../components/SectionTitle.jsx";
import { createCalculatorSocket } from "../services/calculatorSocket.js";

export default function CalculatorPage({ onNotice }) {
  const socketRef = useRef(null);
  const [status, setStatus] = useState("disconnected");
  const [operation, setOperation] = useState("add");
  const [numbers, setNumbers] = useState("10, 20");
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const token = sessionStorage.getItem("access_token");

    if (!token) {
      setError("Please sign in to use the calculator.");
      return;
    }

    const client = createCalculatorSocket({
      token,
      onStatus: setStatus,
      onMessage: (data) => {
        if (data?.error) {
          setError(data.error);
        } else if (typeof data?.result === "number") {
          setResult(data.result);
          setError("");
        }
      },
      onError: (err) => setError(err.message),
    });

    socketRef.current = client;

    return () => {
      client.close();
      socketRef.current = null;
    };
  }, []);

  function handleCalculate(event) {
    event.preventDefault();
    setError("");
    setResult(null);

    const values = numbers
      .split(",")
      .map((value) => value.trim())
      .filter(Boolean)
      .map(Number);

    if (
      values.length < 2 ||
      values.some((value) => !Number.isFinite(value))
    ) {
      setError("Enter at least two valid numbers separated by commas.");
      return;
    }

    if (operation === "divide" && values.slice(1).some((n) => n === 0)) {
      setError("Cannot divide by zero.");
      return;
    }

    const sent = socketRef.current?.calculate(operation, values);

    if (!sent) {
      setError("Calculator is not connected yet. Please wait and try again.");
    }
  }

  return (
    <div className="page-section">
      <SectionTitle
        eyebrow="REAL-TIME TOOL"
        title="Calculator"
        description="Perform calculations through the calculator WebSocket service."
      />

      <section className="panel calculator-panel">
        <div className="connection-status">
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
                : status === "unauthorized"
                  ? "Authentication failed"
                  : "Disconnected"}
          </span>
          <span className={`status-dot ${status === "connected" ? "online" : ""}`} />
        </div>

        <form className="calculator-form" onSubmit={handleCalculate}>
          <label htmlFor="calculator-operation">Operation</label>
          <select
            id="calculator-operation"
            value={operation}
            onChange={(event) => setOperation(event.target.value)}
          >
            <option value="add">Addition (+)</option>
            <option value="subtract">Subtraction (−)</option>
            <option value="multiply">Multiplication (×)</option>
            <option value="divide">Division (÷)</option>
          </select>

          <label htmlFor="calculator-numbers">Numbers</label>
          <input
            id="calculator-numbers"
            value={numbers}
            onChange={(event) => setNumbers(event.target.value)}
            placeholder="10, 20, 30"
          />

          <p className="field-hint">
            Enter two or more numbers separated by commas.
          </p>

          <button
            type="submit"
            className="button-primary"
            disabled={status !== "connected"}
          >
            <Calculator size={17} /> Calculate
          </button>
        </form>

        {result !== null && (
          <div className="calculator-result" aria-live="polite">
            <span>Result</span>
            <strong>{result}</strong>
          </div>
        )}

        {error && (
          <p className="form-error" role="alert">
            {error}
          </p>
        )}
      </section>
    </div>
  );
}

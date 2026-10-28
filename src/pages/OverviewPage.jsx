
import { useEffect, useState } from "react";
import { ArrowRight, CheckCircle2, Clock3, ListTodo } from "lucide-react";
import SectionTitle from "../components/SectionTitle.jsx";
import { getTasks } from "../services/taskService.js";

export default function OverviewPage({ onNavigate, onNotice }) {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    getTasks()
      .then((data) => {
        if (active) {
          setTasks(Array.isArray(data) ? data : data?.tasks || []);
        }
      })
      .catch((error) => {
        if (active) onNotice?.(error.message);
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [onNotice]);

  const completed = tasks.filter((task) => task.completed).length;
  const pending = tasks.length - completed;

  const stats = [
    {
      label: "Total tasks",
      value: tasks.length,
      icon: ListTodo,
      description: "All your tasks",
    },
    {
      label: "Completed",
      value: completed,
      icon: CheckCircle2,
      description: "Tasks finished",
    },
    {
      label: "Pending",
      value: pending,
      icon: Clock3,
      description: "Tasks in progress",
    },
  ];

  return (
    <div className="page-section">
      <SectionTitle
        eyebrow="YOUR WORKSPACE"
        title="Overview"
        description="A quick look at your tasks and service tools."
        action={
          <button
            type="button"
            className="button-primary"
            onClick={() => onNavigate("tasks")}
          >
            View tasks <ArrowRight size={16} />
          </button>
        }
      />

      <div className="stats-grid">
        {stats.map(({ label, value, icon: Icon, description }) => (
          <article className="stat-card" key={label}>
            <div className="stat-card-top">
              <span>{label}</span>
              <Icon size={20} />
            </div>
            <strong>{loading ? "—" : value}</strong>
            <p>{description}</p>
          </article>
        ))}
      </div>

      <section className="panel overview-tools">
        <div className="panel-heading">
          <div>
            <p className="eyebrow">AVAILABLE TOOLS</p>
            <h2>Service tools</h2>
          </div>
        </div>

        <div className="tool-grid">
          <button
            type="button"
            className="tool-card"
            onClick={() => onNavigate("calculator")}
          >
            <span className="tool-icon">＋</span>
            <strong>Calculator</strong>
            <span>Real-time calculations</span>
          </button>

          <button
            type="button"
            className="tool-card"
            onClick={() => onNavigate("echo")}
          >
            <span className="tool-icon">↔</span>
            <strong>Text Echo</strong>
            <span>WebSocket messaging</span>
          </button>

          <button
            type="button"
            className="tool-card"
            onClick={() => onNavigate("stream")}
          >
            <span className="tool-icon">⇄</span>
            <strong>Stream Echo</strong>
            <span>HTTP stream testing</span>
          </button>
        </div>
      </section>
    </div>
  );
}

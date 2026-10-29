import { useCallback, useState } from "react";
import { CheckCircle2, X } from "lucide-react";

import LoginPage from "./pages/LoginPage.jsx";
import OverviewPage from "./pages/OverviewPage.jsx";
import TasksPage from "./pages/TasksPage.jsx";
import CalculatorPage from "./pages/CalculatorPage.jsx";
import EchoPage from "./pages/EchoPage.jsx";
import StreamEchoPage from "./pages/StreamEchoPage.jsx";

import DashboardLayout from "./layouts/DashboardLayout.jsx";
import { logout } from "./services/authService.js";

export default function App() {
  const [authenticated, setAuthenticated] = useState(
    Boolean(sessionStorage.getItem("access_token"))
  );

  const [activePage, setActivePage] = useState("overview");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notice, setNotice] = useState("");
  const [noticeType, setNoticeType] = useState("success");

  const showNotice = useCallback((message, type = "error") => {
    setNotice(message);
    setNoticeType(type);
  }, []);

  function handleLogin() {
    setAuthenticated(true);
    setActivePage("overview");
    showNotice("Signed in successfully.", "success");
  }

  function handleLogout() {
    logout();
    setAuthenticated(false);
    setActivePage("overview");
    setSidebarOpen(false);
    setNotice("");
  }

  function handleNavigate(page) {
    setActivePage(page);
    setNotice("");
  }

  if (!authenticated) {
    return <LoginPage onLogin={handleLogin} />;
  }

  let pageContent;

  switch (activePage) {
    case "tasks":
      pageContent = <TasksPage onNotice={showNotice} />;
      break;

    case "calculator":
      pageContent = <CalculatorPage onNotice={showNotice} />;
      break;

    case "echo":
      pageContent = <EchoPage onNotice={showNotice} />;
      break;

    case "stream":
      pageContent = <StreamEchoPage />;
      break;

    case "overview":
    default:
      pageContent = (
        <OverviewPage
          onNavigate={handleNavigate}
          onNotice={showNotice}
        />
      );
      break;
  }

  return (
    <>
      <DashboardLayout
        activePage={activePage}
        tasksCount={0}
        sidebarOpen={sidebarOpen}
        onNavigate={handleNavigate}
        onOpenNavigation={() => setSidebarOpen(true)}
        onCloseNavigation={() => setSidebarOpen(false)}
        onLogout={handleLogout}
        onNotice={showNotice}
      >
        {pageContent}
      </DashboardLayout>

      {notice && (
        <div
          className={`app-notice ${noticeType === "error" ? "notice-error" : "notice-success"}`}
          role="status"
        >
          {noticeType === "success" && <CheckCircle2 size={18} />}
          <span>{notice}</span>
          <button
            type="button"
            className="icon-button"
            aria-label="Dismiss notification"
            onClick={() => setNotice("")}
          >
            <X size={16} />
          </button>
        </div>
      )}
    </>
  );
}

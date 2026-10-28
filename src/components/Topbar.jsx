
import { Bell, Menu, Search } from "lucide-react";

const pageTitles = {
  overview: "Overview",
  tasks: "Task Management",
  calculator: "Calculator",
  echo: "Text Echo",
  stream: "Stream Echo",
};

export default function Topbar({
  activePage,
  onOpenNavigation,
  onNotice,
}) {
  return (
    <header className="topbar">
      <div className="topbar-left">
        <button
          type="button"
          className="icon-button menu-button"
          aria-label="Open navigation"
          onClick={onOpenNavigation}
        >
          <Menu size={20} />
        </button>

        <div>
          <p className="topbar-breadcrumb">WORKSPACE / SERVICE CONSOLE</p>
          <h1>{pageTitles[activePage] || "Service Console"}</h1>
        </div>
      </div>

      <div className="topbar-actions">
        <span className="topbar-service-status">
          <span className="status-dot" />
          API Console
        </span>

        <button
          type="button"
          className="icon-button"
          aria-label="Search"
          title="Search tasks from the Tasks page"
          onClick={() => onNotice?.("Use the search field on the Tasks page.")}
        >
          <Search size={18} />
        </button>

        <button
          type="button"
          className="icon-button"
          aria-label="Notifications"
          onClick={() => onNotice?.("You are all caught up.")}
        >
          <Bell size={18} />
        </button>
      </div>
    </header>
  );
}

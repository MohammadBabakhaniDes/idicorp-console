
import {
    Activity,
    Calculator,
    FileText,
    LayoutDashboard,
    LogOut,
    MessageSquare,
    Radio,
    X,
  } from "lucide-react";
  
  const navigation = [
    { id: "overview", label: "Overview", icon: LayoutDashboard },
    { id: "tasks", label: "Tasks", icon: FileText },
    { id: "calculator", label: "Calculator", icon: Calculator },
    { id: "echo", label: "Text Echo", icon: MessageSquare },
    { id: "stream", label: "Stream Echo", icon: Radio },
  ];
  
  export default function Sidebar({
    activePage,
    tasksCount = 0,
    sidebarOpen = false,
    onNavigate,
    onClose,
    onLogout,
  }) {
    return (
      <>
        {sidebarOpen && (
          <button
            type="button"
            className="sidebar-backdrop"
            aria-label="Close navigation"
            onClick={onClose}
          />
        )}
  
        <aside className={`sidebar ${sidebarOpen ? "sidebar-open" : ""}`}>
          <div className="sidebar-brand">
            <div className="brand-mark">
              <Activity size={21} />
            </div>
  
            <div>
              <strong>IDICorp</strong>
              <span>Service Console</span>
            </div>
  
            <button
              type="button"
              className="icon-button sidebar-close"
              aria-label="Close navigation"
              onClick={onClose}
            >
              <X size={18} />
            </button>
          </div>
  
          <p className="sidebar-label">WORKSPACE</p>
  
          <nav className="sidebar-nav" aria-label="Main navigation">
            {navigation.map(({ id, label, icon: Icon }) => (
              <button
                type="button"
                key={id}
                className={`nav-item ${activePage === id ? "active" : ""}`}
                aria-current={activePage === id ? "page" : undefined}
                onClick={() => {
                  onNavigate(id);
                  onClose();
                }}
              >
                <Icon size={18} />
                <span>{label}</span>
  
                {id === "tasks" && (
                  <span className="nav-count">{tasksCount}</span>
                )}
              </button>
            ))}
          </nav>
  
          <div className="sidebar-footer">
            <div className="sidebar-status">
              <span className="status-dot" />
              <span>Service Console</span>
            </div>
  
            <button
              type="button"
              className="nav-item logout-button"
              onClick={onLogout}
            >
              <LogOut size={18} />
              <span>Sign out</span>
            </button>
          </div>
        </aside>
      </>
    );
  }
  
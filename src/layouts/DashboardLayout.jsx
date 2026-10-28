
import Sidebar from "../components/Sidebar.jsx";
import Topbar from "../components/Topbar.jsx";

export default function DashboardLayout({
  activePage,
  tasksCount,
  sidebarOpen,
  onNavigate,
  onOpenNavigation,
  onCloseNavigation,
  onLogout,
  onNotice,
  children,
}) {
  return (
    <div className="app-shell">
      <Sidebar
        activePage={activePage}
        tasksCount={tasksCount}
        sidebarOpen={sidebarOpen}
        onNavigate={onNavigate}
        onClose={onCloseNavigation}
        onLogout={onLogout}
      />

      <div className="main-shell">
        <Topbar
          activePage={activePage}
          onOpenNavigation={onOpenNavigation}
          onNotice={onNotice}
        />

        <main className="page-content">{children}</main>
      </div>
    </div>
  );
}

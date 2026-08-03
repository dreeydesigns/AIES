import React from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { logout } from '../lib/firebase';
import { BookOpen, LogOut } from 'lucide-react';
import clsx from 'clsx';

const ROLE_STYLES: Record<string, { badge: string; active: string }> = {
  teacher: { badge: 'bg-role-teacher-badge text-role-teacher-text', active: 'bg-role-teacher-bg text-role-teacher-text' },
  parent:  { badge: 'bg-role-parent-badge text-role-parent-text',  active: 'bg-role-parent-bg text-role-parent-text'  },
  admin:   { badge: 'bg-role-admin-badge text-role-admin-text', active: 'bg-role-admin-bg text-role-admin-text' },
  student: { badge: 'bg-role-student-badge text-role-student-text', active: 'bg-role-student-bg text-role-student-text' }
};

export default function SidebarLayout({ role, navLinks }: { role: string, navLinks: any[] }) {
  const { currentUser, setCurrentUser } = useAppContext();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    setCurrentUser(null);
    navigate('/');
  };

  const styles = ROLE_STYLES[role] || ROLE_STYLES.student;

  return (
    <div className="min-h-screen bg-neutral-50 flex flex-col md:flex-row font-sans text-neutral-900">
      <aside className="w-full md:w-64 bg-white border-r border-neutral-200 flex-shrink-0 flex flex-col">
        <div className="p-4 border-b border-neutral-200 flex items-center gap-3">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 text-white rounded-lg flex items-center justify-center">
            <BookOpen className="w-4 h-4" />
          </div>
          <h1 className="font-bold tracking-tight text-neutral-800">AIES</h1>
          <span className={clsx("px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ml-auto", styles.badge)}>
            {role}
          </span>
        </div>
        <nav className="flex-1 overflow-y-auto p-4 space-y-1">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = location.pathname === link.path || (link.path !== `/${role}` && location.pathname.startsWith(link.path));
            return (
              <Link
                key={link.name}
                to={link.path}
                className={clsx(
                  "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                  isActive 
                    ? styles.active
                    : "text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900"
                )}
              >
                <Icon className="w-5 h-5" />
                {link.name}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-neutral-200">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-neutral-200 rounded-full flex items-center justify-center font-bold text-neutral-600">
              {currentUser?.name?.charAt(0) || 'U'}
            </div>
            <div>
              <p className="text-sm font-bold text-neutral-800">{currentUser?.name}</p>
              <p className="text-xs text-neutral-500 capitalize">{currentUser?.role}</p>
            </div>
          </div>
          <button 
            onClick={handleLogout}
            className="flex items-center gap-2 w-full px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        </div>
      </aside>
      <main className="flex-1 overflow-y-auto p-4 md:p-8">
        <div className="max-w-5xl mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
}

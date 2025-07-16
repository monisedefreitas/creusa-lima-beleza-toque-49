
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import AdminLayout from '@/components/Admin/AdminLayout';
import Dashboard from '@/components/Admin/Dashboard';
import ContactsManager from '@/components/Admin/ContactsManager';
import AppointmentsManager from '@/components/Admin/AppointmentsManager';
import ServicesManager from '@/components/Admin/ServicesManager';
import FAQsManager from '@/components/Admin/FAQsManager';
import TimeSlotManager from '@/components/Admin/TimeSlotManager';

const AdminGuard: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, isAdmin, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-darkgreen-800"></div>
      </div>
    );
  }

  if (!user || !isAdmin) {
    return <Navigate to="/auth" replace />;
  }

  return <>{children}</>;
};

const AdminRoutes: React.FC = () => {
  return (
    <AdminGuard>
      <AdminLayout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/contacts" element={<ContactsManager />} />
          <Route path="/appointments" element={<AppointmentsManager />} />
          <Route path="/services" element={<ServicesManager />} />
          <Route path="/faqs" element={<FAQsManager />} />
          <Route path="/schedules" element={<TimeSlotManager />} />
          {/* Add more admin routes here */}
        </Routes>
      </AdminLayout>
    </AdminGuard>
  );
};

export default AdminRoutes;

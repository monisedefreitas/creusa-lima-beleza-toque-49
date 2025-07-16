
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import AdminLayout from '@/components/Admin/AdminLayout';
import Dashboard from '@/components/Admin/Dashboard';
import AppointmentsManager from '@/components/Admin/AppointmentsManager';
import ClientsManager from '@/components/Admin/ClientsManager';
import ServicesManager from '@/components/Admin/ServicesManager';
import TimeSlotManager from '@/components/Admin/TimeSlotManager';
import UsersManager from '@/components/Admin/UsersManager';
import MediaManager from '@/components/Admin/MediaManager';
import BannersManager from '@/components/Admin/BannersManager';
import FAQsManager from '@/components/Admin/FAQsManager';
import AddressesManager from '@/components/Admin/AddressesManager';
import ContactsManager from '@/components/Admin/ContactsManager';
import SocialMediaManager from '@/components/Admin/SocialMediaManager';
import SiteConfigManager from '@/components/Admin/SiteConfigManager';
import SettingsManager from '@/components/Admin/SettingsManager';

const AdminRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<AdminLayout />}>
        <Route index element={<Dashboard />} />
        <Route path="appointments" element={<AppointmentsManager />} />
        <Route path="clients" element={<ClientsManager />} />
        <Route path="services" element={<ServicesManager />} />
        <Route path="timeslots" element={<TimeSlotManager />} />
        <Route path="users" element={<UsersManager />} />
        <Route path="media" element={<MediaManager />} />
        <Route path="banners" element={<BannersManager />} />
        <Route path="faqs" element={<FAQsManager />} />
        <Route path="addresses" element={<AddressesManager />} />
        <Route path="contacts" element={<ContactsManager />} />
        <Route path="social" element={<SocialMediaManager />} />
        <Route path="site-config" element={<SiteConfigManager />} />
        <Route path="settings" element={<SettingsManager />} />
        <Route path="*" element={<Navigate to="/admin" replace />} />
      </Route>
    </Routes>
  );
};

export default AdminRoutes;

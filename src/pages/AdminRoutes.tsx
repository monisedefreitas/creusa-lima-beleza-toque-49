
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import AdminLayout from '@/components/Admin/AdminLayout';
import Dashboard from '@/components/Admin/Dashboard';
import EnhancedAppointmentsManager from '@/components/Admin/EnhancedAppointmentsManager';
import ServicesManager from '@/components/Admin/ServicesManager';
import UsersManager from '@/components/Admin/UsersManager';
import TimeSlotManager from '@/components/Admin/TimeSlotManager';
import BannersManager from '@/components/Admin/BannersManager';
import MediaManager from '@/components/Admin/MediaManager';
import AddressesManager from '@/components/Admin/AddressesManager';
import ContactsManager from '@/components/Admin/ContactsManager';
import SocialMediaManager from '@/components/Admin/SocialMediaManager';
import FAQsManager from '@/components/Admin/FAQsManager';
import SettingsManager from '@/components/Admin/SettingsManager';
import MessageTemplatesManager from '@/components/Admin/MessageTemplatesManager';

const AdminRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<AdminLayout />}>
        <Route index element={<Dashboard />} />
        <Route path="appointments" element={<EnhancedAppointmentsManager />} />
        <Route path="services" element={<ServicesManager />} />
        <Route path="users" element={<UsersManager />} />
        <Route path="time-slots" element={<TimeSlotManager />} />
        <Route path="banners" element={<BannersManager />} />
        <Route path="media" element={<MediaManager />} />
        <Route path="addresses" element={<AddressesManager />} />
        <Route path="contacts" element={<ContactsManager />} />
        <Route path="social" element={<SocialMediaManager />} />
        <Route path="faqs" element={<FAQsManager />} />
        <Route path="message-templates" element={<MessageTemplatesManager />} />
        <Route path="settings" element={<SettingsManager />} />
      </Route>
    </Routes>
  );
};

export default AdminRoutes;

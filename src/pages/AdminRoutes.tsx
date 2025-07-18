
import * as React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import MobileAdminLayout from '@/components/Admin/MobileAdminLayout';
import Dashboard from '@/components/Admin/Dashboard';
import AppointmentsManager from '@/components/Admin/AppointmentsManager';
import FixedAppointmentsManager from '@/components/Admin/FixedAppointmentsManager';
import ClientsManager from '@/components/Admin/ClientsManager';
import ServicesManager from '@/components/Admin/ServicesManager';
import TimeSlotManager from '@/components/Admin/TimeSlotManager';
import UsersManager from '@/components/Admin/UsersManager';
import FAQsManager from '@/components/Admin/FAQsManager';
import AddressesManager from '@/components/Admin/AddressesManager';
import ContactsManager from '@/components/Admin/ContactsManager';
import SocialMediaManager from '@/components/Admin/SocialMediaManager';
import SiteConfigManager from '@/components/Admin/SiteConfigManager';
import SettingsManager from '@/components/Admin/SettingsManager';
import WhatsAppManager from '@/components/Admin/WhatsAppManager';
import SiteContentManager from '@/components/Admin/SiteContentManager';
import TestimonialsManager from '@/components/Admin/TestimonialsManager';

const AdminRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<MobileAdminLayout />}>
        <Route index element={<Dashboard />} />
        <Route path="appointments" element={<AppointmentsManager />} />
        <Route path="create-appointment" element={<FixedAppointmentsManager />} />
        <Route path="clients" element={<ClientsManager />} />
        <Route path="services" element={<ServicesManager />} />
        <Route path="timeslots" element={<TimeSlotManager />} />
        <Route path="users" element={<UsersManager />} />
        <Route path="faqs" element={<FAQsManager />} />
        <Route path="addresses" element={<AddressesManager />} />
        <Route path="contacts" element={<ContactsManager />} />
        <Route path="social" element={<SocialMediaManager />} />
        <Route path="site-config" element={<SiteConfigManager />} />
        <Route path="content" element={<SiteContentManager />} />
        <Route path="testimonials" element={<TestimonialsManager />} />
        <Route path="settings" element={<SettingsManager />} />
        <Route path="whatsapp" element={<WhatsAppManager />} />
        <Route path="*" element={<Navigate to="/admin" replace />} />
      </Route>
    </Routes>
  );
};

export default AdminRoutes;

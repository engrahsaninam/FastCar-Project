'use client';

import { AuthProvider } from '@/components/admin/auth-components';
// import AdminDashboard from '@/components/admin/AdminDashboard';
import AdminDashboard from '@/components/admin/AdminDashboard';

const AdminPage = () => {
    return (
        <AuthProvider>
            <AdminDashboard />
        </AuthProvider>
    );
};

export default AdminPage; 
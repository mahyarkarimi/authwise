'use client';

import { AuthProvider } from "@/components/AuthContext";
import NavLink from "@/components/NavLink";
import Button from "@/components/Button";
import { useRouter } from "next/navigation";

export default function DashboardLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const router = useRouter();

    const handleLogout = () => {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        router.push('/login');
    };

    return (
        <AuthProvider>
            <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-slate-900 dark:to-indigo-900">
                <nav className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-md shadow-lg border-b border-slate-200 dark:border-slate-700">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex justify-between h-16">
                            <div className="flex items-center">
                                <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">AuthWise</h1>
                            </div>
                            <div className="flex items-center space-x-4">
                                <NavLink href="/dashboard">Home</NavLink>
                                <NavLink href="/dashboard/profile">Profile</NavLink>
                                <NavLink href="/dashboard/change-password">Change Password</NavLink>
                                <Button variant="danger" size="sm" onClick={handleLogout}>
                                    Logout
                                </Button>
                            </div>
                        </div>
                    </div>
                </nav>
                <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    {children}
                </main>
            </div>
        </AuthProvider>
    );
}

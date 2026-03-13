import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, usePage, Link } from '@inertiajs/react';
import { useState, useEffect } from 'react';

interface DashboardProps {
    stats?: {
        totalUsers?: number;
        totalProjects?: number;
        activeProjects?: number;
        completedTasks?: number;
    };
}

export default function JibasDashboard({ stats }: DashboardProps) {
    const user = usePage().props.auth.user as { name: string; email: string };
    const [greeting, setGreeting] = useState('');

    useEffect(() => {
        const hour = new Date().getHours();
        if (hour < 12) setGreeting('Selamat Pagi');
        else if (hour < 18) setGreeting('Selamat Siang');
        else setGreeting('Selamat Malam');
    }, []);

    const statCards = [
        {
            title: 'Total Users',
            value: stats?.totalUsers || 150,
            icon: (
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
            ),
            color: 'from-blue-500 to-blue-600',
            bgColor: 'bg-blue-50',
            textColor: 'text-blue-600',
        },
        {
            title: 'Total Projects',
            value: stats?.totalProjects || 48,
            icon: (
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
            ),
            color: 'from-purple-500 to-purple-600',
            bgColor: 'bg-purple-50',
            textColor: 'text-purple-600',
        },
        {
            title: 'Active Projects',
            value: stats?.activeProjects || 23,
            icon: (
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
            ),
            color: 'from-green-500 to-green-600',
            bgColor: 'bg-green-50',
            textColor: 'text-green-600',
        },
        {
            title: 'Completed Tasks',
            value: stats?.completedTasks || 892,
            icon: (
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            ),
            color: 'from-pink-500 to-pink-600',
            bgColor: 'bg-pink-50',
            textColor: 'text-pink-600',
        },
    ];

    const quickActions = [
        { name: 'Create Project', icon: '📁', color: 'from-blue-500 to-cyan-500' },
        { name: 'Add User', icon: '👥', color: 'from-purple-500 to-pink-500' },
        { name: 'View Reports', icon: '📊', color: 'from-green-500 to-teal-500' },
        { name: 'Settings', icon: '⚙️', color: 'from-orange-500 to-red-500' },
    ];

    const recentActivities = [
        { id: 1, action: 'New user registered', user: 'John Doe', time: '5 minutes ago', type: 'user' },
        { id: 2, action: 'Project "Website Redesign" updated', user: 'Jane Smith', time: '1 hour ago', type: 'project' },
        { id: 3, action: 'Task completed', user: 'Mike Johnson', time: '2 hours ago', type: 'task' },
        { id: 4, action: 'New comment on project', user: 'Sarah Williams', time: '3 hours ago', type: 'comment' },
        { id: 5, action: 'File uploaded', user: 'David Brown', time: '5 hours ago', type: 'file' },
    ];

    return (
        <AuthenticatedLayout
            header={
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-800">
                            {greeting}, {user.name}! 👋
                        </h2>
                        <p className="text-sm text-gray-600 mt-1">
                            Selamat datang di E-Ponpes.id Dashboard
                        </p>
                    </div>
                    <div className="hidden md:block">
                        <div className="text-right">
                            <p className="text-xs text-gray-500">Tanggal hari ini</p>
                            <p className="text-sm font-semibold text-gray-700">
                                {new Date().toLocaleDateString('id-ID', { 
                                    weekday: 'long', 
                                    year: 'numeric', 
                                    month: 'long', 
                                    day: 'numeric' 
                                })}
                            </p>
                        </div>
                    </div>
                </div>
            }
        >
            <Head title="E-Ponpes.id Dashboard" />

            <div className="py-8">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8 space-y-6">
                    
                    {/* Statistics Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {statCards.map((stat, index) => (
                            <div
                                key={index}
                                className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 overflow-hidden"
                            >
                                <div className={`h-2 bg-gradient-to-r ${stat.color}`} />
                                <div className="p-6">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-sm font-medium text-gray-600 mb-1">
                                                {stat.title}
                                            </p>
                                            <p className="text-3xl font-bold text-gray-900">
                                                {stat.value.toLocaleString()}
                                            </p>
                                        </div>
                                        <div className={`${stat.bgColor} ${stat.textColor} p-4 rounded-xl`}>
                                            {stat.icon}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Quick Actions */}
                    <div className="bg-white rounded-xl shadow-md p-6">
                        <h3 className="text-lg font-bold text-gray-900 mb-4">Quick Actions</h3>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {quickActions.map((action, index) => (
                                <button
                                    key={index}
                                    className={`p-6 rounded-xl bg-gradient-to-br ${action.color} text-white hover:shadow-lg transform hover:scale-105 transition-all duration-200`}
                                >
                                    <div className="text-4xl mb-2">{action.icon}</div>
                                    <div className="text-sm font-semibold">{action.name}</div>
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Recent Activities */}
                        <div className="bg-white rounded-xl shadow-md p-6">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-lg font-bold text-gray-900">Recent Activities</h3>
                                <button className="text-sm text-blue-600 hover:text-blue-800 font-semibold">
                                    View All
                                </button>
                            </div>
                            <div className="space-y-4">
                                {recentActivities.map((activity) => (
                                    <div key={activity.id} className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                                        <div className={`flex-shrink-0 w-10 h-10 rounded-full ${
                                            activity.type === 'user' ? 'bg-blue-100 text-blue-600' :
                                            activity.type === 'project' ? 'bg-purple-100 text-purple-600' :
                                            activity.type === 'task' ? 'bg-green-100 text-green-600' :
                                            activity.type === 'comment' ? 'bg-yellow-100 text-yellow-600' :
                                            'bg-pink-100 text-pink-600'
                                        } flex items-center justify-center font-semibold`}>
                                            {activity.user.split(' ').map(n => n[0]).join('')}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-medium text-gray-900">
                                                {activity.action}
                                            </p>
                                            <p className="text-xs text-gray-500">
                                                by {activity.user} • {activity.time}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Project Progress */}
                        <div className="bg-white rounded-xl shadow-md p-6">
                            <h3 className="text-lg font-bold text-gray-900 mb-4">Project Progress</h3>
                            <div className="space-y-6">
                                {[
                                    { name: 'Website Redesign', progress: 85, color: 'bg-blue-500' },
                                    { name: 'Mobile App Development', progress: 60, color: 'bg-purple-500' },
                                    { name: 'API Integration', progress: 45, color: 'bg-green-500' },
                                    { name: 'Database Migration', progress: 90, color: 'bg-pink-500' },
                                ].map((project, index) => (
                                    <div key={index}>
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="text-sm font-medium text-gray-700">
                                                {project.name}
                                            </span>
                                            <span className="text-sm font-bold text-gray-900">
                                                {project.progress}%
                                            </span>
                                        </div>
                                        <div className="w-full bg-gray-200 rounded-full h-2.5 overflow-hidden">
                                            <div
                                                className={`${project.color} h-2.5 rounded-full transition-all duration-500 ease-out`}
                                                style={{ width: `${project.progress}%` }}
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Welcome Message */}
                    <div className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-xl shadow-lg p-8 text-white">
                        <div className="flex flex-col md:flex-row items-center justify-between">
                            <div className="mb-4 md:mb-0">
                                <h2 className="text-2xl font-bold mb-2">
                                    Welcome to E-Ponpes.id! 🚀
                                </h2>
                                <p className="text-blue-100">
                                    Manage your projects efficiently and boost your productivity
                                </p>
                            </div>
                            <button className="bg-white text-purple-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors shadow-lg">
                                Get Started
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}

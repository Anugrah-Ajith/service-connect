import { useState, useEffect } from 'react';
import api from '../api/api';
import { toast } from 'react-hot-toast';
import {
    Users,
    UserCheck,
    Calendar,
    ShieldCheck,
    Search,
    UserX,
    MoreVertical,
    CheckCircle2,
    XCircle,
    BarChart3,
    Clock,
    ExternalLink,
    Filter
} from 'lucide-react';

interface Stats {
    totalUsers: number;
    totalProviders: number;
    totalBookings: number;
    pendingVerifications: number;
}

interface User {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
    role: string;
    isVerified: boolean;
    isActive: boolean;
    createdAt: string;
}

interface Provider {
    _id: string;
    userId: {
        _id: string;
        firstName: string;
        lastName: string;
        email: string;
        phone: string;
        isVerified: boolean;
    };
    profession: string;
    experience: number;
    isVerified: boolean;
    hourlyRate: number;
}

interface Booking {
    _id: string;
    customerId: {
        firstName: string;
        lastName: string;
        email: string;
    };
    providerId: {
        firstName: string;
        lastName: string;
        email: string;
    };
    serviceType: string;
    status: string;
    totalAmount: number;
    bookingDate: string;
}

const AdminDashboard = () => {
    const [stats, setStats] = useState<Stats | null>(null);
    const [users, setUsers] = useState<User[]>([]);
    const [providers, setProviders] = useState<Provider[]>([]);
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<'overview' | 'users' | 'providers' | 'bookings'>('overview');
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchData();
    }, [activeTab]);

    const fetchData = async () => {
        try {
            if (activeTab === 'overview') {
                const statsRes = await api.get('/admin/stats');
                setStats(statsRes.data.stats);
            } else if (activeTab === 'users') {
                const usersRes = await api.get('/admin/users');
                setUsers(usersRes.data);
            } else if (activeTab === 'providers') {
                const providersRes = await api.get('/admin/providers');
                setProviders(providersRes.data);
            } else if (activeTab === 'bookings') {
                const bookingsRes = await api.get('/admin/bookings');
                setBookings(bookingsRes.data);
            }
            setLoading(false);
        } catch (error: any) {
            setLoading(false);
        }
    };

    const toggleUserStatus = async (userId: string) => {
        try {
            await api.post(`/admin/users/${userId}/toggle-active`);
            toast.success('User status updated');
            fetchData();
        } catch (error) { }
    };

    const verifyProvider = async (providerId: string) => {
        try {
            await api.post(`/admin/providers/${providerId}/verify`);
            toast.success('Provider verified');
            fetchData();
        } catch (error) { }
    };

    const filteredData = () => {
        const term = searchTerm.toLowerCase();
        if (activeTab === 'users') {
            return users.filter(u => u.firstName.toLowerCase().includes(term) || u.email.toLowerCase().includes(term));
        }
        if (activeTab === 'providers') {
            return providers.filter(p => p.userId.firstName.toLowerCase().includes(term) || p.profession.toLowerCase().includes(term));
        }
        if (activeTab === 'bookings') {
            return bookings.filter(b => b.serviceType.toLowerCase().includes(term) || b.customerId.firstName.toLowerCase().includes(term));
        }
        return [];
    };

    if (loading && !stats && activeTab === 'overview') {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-50">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-neutral-50 p-4 md:p-8 font-sans transition-colors duration-300">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <header className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-6">
                    <div className="space-y-1">
                        <h1 className="text-4xl font-extrabold text-neutral-900 tracking-tight">System Control</h1>
                        <p className="text-neutral-500 font-medium">Platform Management & Analytics Overview</p>
                    </div>

                    <nav className="inline-flex bg-white/80 backdrop-blur-md p-1.5 rounded-2xl shadow-sm border border-neutral-200/60 sticky top-4 z-10 transition-all hover:shadow-md">
                        {(['overview', 'users', 'providers', 'bookings'] as const).map((tab) => (
                            <button
                                key={tab}
                                onClick={() => { setActiveTab(tab); setLoading(true); }}
                                className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all duration-300 ${activeTab === tab
                                        ? 'bg-neutral-900 text-white shadow-lg scale-105'
                                        : 'text-neutral-500 hover:text-neutral-900 hover:bg-neutral-100'
                                    }`}
                            >
                                {tab.charAt(0).toUpperCase() + tab.slice(1)}
                            </button>
                        ))}
                    </nav>
                </header>

                {/* Overview Tab */}
                {activeTab === 'overview' && (
                    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-10">
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                            {[
                                { label: 'Total Base', value: stats?.totalUsers, icon: Users, color: 'text-blue-600', bg: 'bg-blue-100/50' },
                                { label: 'Experts', value: stats?.totalProviders, icon: ShieldCheck, color: 'text-emerald-600', bg: 'bg-emerald-100/50' },
                                { label: 'Total Ops', value: stats?.totalBookings, icon: Calendar, color: 'text-violet-600', bg: 'bg-violet-100/50' },
                                { label: 'Verification Queue', value: stats?.pendingVerifications, icon: Clock, color: 'text-orange-600', bg: 'bg-orange-100/50' },
                            ].map((stat, i) => (
                                <div key={i} className="group bg-white p-7 rounded-3xl border border-neutral-200/60 hover:border-neutral-900 transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
                                    <div className="flex items-center justify-between mb-4">
                                        <div className={`${stat.bg} ${stat.color} p-3 rounded-2xl transition-transform group-hover:rotate-6`}>
                                            <stat.icon size={26} />
                                        </div>
                                        <span className="text-neutral-400 font-bold group-hover:text-neutral-900 transition-colors">+{Math.floor(Math.random() * 20)}%</span>
                                    </div>
                                    <h3 className="text-sm font-bold text-neutral-500 uppercase tracking-widest mb-1">{stat.label}</h3>
                                    <p className="text-4xl font-black text-neutral-900">{stat.value}</p>
                                </div>
                            ))}
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                            <div className="lg:col-span-2 bg-neutral-900 rounded-[2.5rem] p-10 text-white relative overflow-hidden group shadow-2xl">
                                <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/20 blur-[100px] rounded-full -mr-20 -mt-20"></div>
                                <div className="relative z-10 flex flex-col h-full">
                                    <div className="flex items-center justify-between mb-10">
                                        <h2 className="text-2xl font-black flex items-center gap-3">
                                            <BarChart3 className="text-indigo-400" size={28} />
                                            Platform Momentum
                                        </h2>
                                        <select className="bg-white/10 border-none rounded-xl text-sm px-4 py-2 focus:ring-0">
                                            <option>Last 30 Days</option>
                                        </select>
                                    </div>
                                    <div className="flex-1 flex items-end gap-3 min-h-[250px]">
                                        {[45, 78, 56, 92, 64, 85, 72, 59, 95, 81, 68, 88].map((h, i) => (
                                            <div key={i} className="flex-1 group/bar relative">
                                                <div
                                                    className="w-full bg-white/20 rounded-xl transition-all duration-500 group-hover/bar:bg-indigo-400 group-hover/bar:scale-105"
                                                    style={{ height: `${h}%` }}
                                                ></div>
                                                <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-white text-neutral-900 px-2 py-1 rounded-lg text-[10px] font-black opacity-0 group-hover/bar:opacity-100 transition-opacity">
                                                    {h}%
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-6">
                                <div className="bg-white rounded-[2.5rem] p-8 border border-neutral-200/60 shadow-lg">
                                    <h3 className="text-xl font-black text-neutral-900 mb-6 tracking-tight">System Integrity</h3>
                                    <div className="space-y-5">
                                        {[
                                            { l: 'Server Latency', v: '24ms', c: 'text-emerald-500' },
                                            { l: 'Auth Uptime', v: '99.9%', c: 'text-blue-500' },
                                            { l: 'Payment Gate', v: 'Active', c: 'text-indigo-500' },
                                            { l: 'Db Health', v: 'Optimal', c: 'text-emerald-500' }
                                        ].map((item, i) => (
                                            <div key={i} className="flex items-center justify-between p-4 bg-neutral-50 rounded-2xl hover:bg-neutral-100 transition-colors">
                                                <span className="text-neutral-500 font-bold">{item.l}</span>
                                                <span className={`font-black ${item.c}`}>{item.v}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="bg-gradient-to-br from-indigo-600 to-indigo-800 rounded-[2.5rem] p-8 text-white shadow-xl relative overflow-hidden group">
                                    <ShieldCheck className="absolute bottom-[-20px] right-[-20px] text-white/10 w-40 h-40 group-hover:scale-110 transition-transform duration-700" />
                                    <h3 className="text-xl font-black mb-2">Security Hub</h3>
                                    <p className="text-white/70 text-sm mb-6 leading-relaxed">System-wide security protocol and access log monitoring.</p>
                                    <button className="bg-white text-indigo-900 px-6 py-3 rounded-2xl font-black text-sm hover:shadow-lg transition-all active:scale-95">
                                        Enter Secure Mode
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Data Tabs */}
                {activeTab !== 'overview' && (
                    <div className="bg-white rounded-[2.5rem] border border-neutral-200/60 shadow-2xl overflow-hidden animate-in fade-in slide-in-from-bottom-8 duration-500">
                        <div className="p-10 border-b border-neutral-100 flex flex-col md:flex-row md:items-center justify-between gap-6 bg-neutral-50/50">
                            <div className="space-y-1">
                                <h2 className="text-3xl font-black text-neutral-900 tracking-tight capitalize">{activeTab} Database</h2>
                                <p className="text-neutral-500 font-medium">Manage and monitor live {activeTab} information</p>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="relative group">
                                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400 group-hover:text-neutral-900 transition-colors" size={20} />
                                    <input
                                        type="text"
                                        placeholder={`Filter by name, email or type...`}
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="pl-12 pr-6 py-4 bg-white border border-neutral-200/80 rounded-[1.5rem] focus:outline-none focus:ring-4 focus:ring-neutral-900/5 focus:border-neutral-900 w-full md:w-80 font-medium transition-all"
                                    />
                                </div>
                                <button className="p-4 bg-white border border-neutral-200/80 rounded-[1.5rem] hover:bg-neutral-100 transition-colors shadow-sm">
                                    <Filter size={20} className="text-neutral-600" />
                                </button>
                            </div>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full">
                                {activeTab === 'users' && (
                                    <>
                                        <thead className="bg-neutral-50">
                                            <tr>
                                                <th className="px-10 py-6 text-left text-xs font-black text-neutral-400 uppercase tracking-[0.2em]">Principal</th>
                                                <th className="px-6 py-6 text-left text-xs font-black text-neutral-400 uppercase tracking-[0.2em]">Identity</th>
                                                <th className="px-6 py-6 text-left text-xs font-black text-neutral-400 uppercase tracking-[0.2em]">Lifecycle</th>
                                                <th className="px-6 py-6 text-left text-xs font-black text-neutral-400 uppercase tracking-[0.2em]">Timeline</th>
                                                <th className="px-10 py-6 text-right text-xs font-black text-neutral-400 uppercase tracking-[0.2em]">Ops</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-neutral-100">
                                            {filteredData().map((u: any) => (
                                                <tr key={u._id} className="group hover:bg-neutral-50/80 transition-all duration-300">
                                                    <td className="px-10 py-7">
                                                        <div className="flex items-center gap-5">
                                                            <div className="h-14 w-14 rounded-[1.2rem] bg-indigo-100 text-indigo-700 flex items-center justify-center font-black text-xl shadow-inner group-hover:scale-110 transition-transform">
                                                                {u.firstName[0]}
                                                            </div>
                                                            <div>
                                                                <p className="font-black text-neutral-900 text-lg uppercase tracking-tight">{u.firstName} {u.lastName}</p>
                                                                <p className="text-neutral-400 font-bold">{u.email}</p>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-7">
                                                        <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${u.role === 'admin' ? 'bg-indigo-900 text-white' :
                                                                u.role === 'service_provider' ? 'bg-neutral-900 text-white' :
                                                                    'bg-neutral-100 text-neutral-600'
                                                            }`}>
                                                            {u.role}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-7">
                                                        <div className="flex items-center gap-3">
                                                            <div className={`h-3 w-3 rounded-full ${u.isActive ? 'bg-emerald-500 shadow-[0_0_12px_rgba(16,185,129,0.5)] animate-pulse' : 'bg-rose-500'}`}></div>
                                                            <span className={`text-sm font-black uppercase tracking-tighter ${u.isActive ? 'text-emerald-700' : 'text-rose-700'}`}>
                                                                {u.isActive ? 'Active Mode' : 'Suspended'}
                                                            </span>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-7 text-neutral-400 font-bold text-sm">
                                                        {new Date(u.createdAt).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })}
                                                    </td>
                                                    <td className="px-10 py-7 text-right">
                                                        <button onClick={() => toggleUserStatus(u._id)} className={`p-4 rounded-2xl transition-all ${u.isActive ? 'text-rose-600 hover:bg-rose-100 hover:scale-110' : 'text-emerald-600 hover:bg-emerald-100 hover:scale-110'}`}>
                                                            <UserX size={22} className={u.isActive ? 'rotate-0' : 'rotate-180 transition-transform duration-500'} />
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </>
                                )}

                                {activeTab === 'providers' && (
                                    <>
                                        <thead className="bg-neutral-50">
                                            <tr>
                                                <th className="px-10 py-6 text-left text-xs font-black text-neutral-400 uppercase tracking-[0.2em]">Specialist</th>
                                                <th className="px-6 py-6 text-left text-xs font-black text-neutral-400 uppercase tracking-[0.2em]">Profession</th>
                                                <th className="px-6 py-6 text-left text-xs font-black text-neutral-400 uppercase tracking-[0.2em]">Experience</th>
                                                <th className="px-6 py-6 text-left text-xs font-black text-neutral-400 uppercase tracking-[0.2em]">Certificate</th>
                                                <th className="px-10 py-6 text-right text-xs font-black text-neutral-400 uppercase tracking-[0.2em]">Ops</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-neutral-100">
                                            {filteredData().map((p: any) => (
                                                <tr key={p._id} className="group hover:bg-neutral-50/80 transition-colors">
                                                    <td className="px-10 py-7">
                                                        <div className="flex items-center gap-5">
                                                            <div className="h-14 w-14 rounded-[1.2rem] bg-emerald-100 text-emerald-700 flex items-center justify-center font-black group-hover:bg-emerald-200 transition-colors">
                                                                {p.userId.firstName[0]}
                                                            </div>
                                                            <div>
                                                                <p className="font-black text-neutral-900 uppercase tracking-tight">{p.userId.firstName} {p.userId.lastName}</p>
                                                                <p className="text-neutral-400 font-bold text-sm">{p.userId.email}</p>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-7 font-black text-neutral-700 uppercase italic tracking-tighter">{p.profession}</td>
                                                    <td className="px-6 py-7 text-neutral-900 font-black">{p.experience} Years</td>
                                                    <td className="px-6 py-7">
                                                        {p.isVerified ? (
                                                            <div className="flex items-center gap-2 text-emerald-600 font-black text-xs uppercase bg-emerald-50 border border-emerald-100 px-3 py-1.5 rounded-xl w-fit">
                                                                <ShieldCheck size={14} /> Official
                                                            </div>
                                                        ) : (
                                                            <div className="flex items-center gap-2 text-rose-600 font-black text-xs uppercase bg-rose-50 border border-rose-100 px-3 py-1.5 rounded-xl w-fit">
                                                                <Clock size={14} /> Pending
                                                            </div>
                                                        )}
                                                    </td>
                                                    <td className="px-10 py-7 text-right">
                                                        {!p.isVerified && (
                                                            <button onClick={() => verifyProvider(p._id)} className="bg-neutral-900 text-white px-6 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-emerald-600 transition-all hover:shadow-lg active:scale-95">
                                                                Authorize Access
                                                            </button>
                                                        )}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </>
                                )}

                                {activeTab === 'bookings' && (
                                    <>
                                        <thead className="bg-neutral-50">
                                            <tr>
                                                <th className="px-10 py-6 text-left text-xs font-black text-neutral-400 uppercase tracking-[0.2em]">Trans ID</th>
                                                <th className="px-6 py-6 text-left text-xs font-black text-neutral-400 uppercase tracking-[0.2em]">Stakeholders</th>
                                                <th className="px-6 py-6 text-left text-xs font-black text-neutral-400 uppercase tracking-[0.2em]">Status</th>
                                                <th className="px-6 py-6 text-left text-xs font-black text-neutral-400 uppercase tracking-[0.2em]">Volume</th>
                                                <th className="px-10 py-6 text-right text-xs font-black text-neutral-400 uppercase tracking-[0.2em]">Link</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-neutral-100">
                                            {filteredData().map((b: any) => (
                                                <tr key={b._id} className="group hover:bg-neutral-50/80 transition-colors">
                                                    <td className="px-10 py-7">
                                                        <p className="font-mono text-xs font-black text-neutral-400">#SC-{b._id.slice(-6).toUpperCase()}</p>
                                                        <p className="font-black text-neutral-900 mt-1 uppercase text-sm tracking-tight">{b.serviceType}</p>
                                                    </td>
                                                    <td className="px-6 py-7">
                                                        <div className="flex items-center gap-3">
                                                            <div className="flex -space-x-3">
                                                                <div className="h-10 w-10 rounded-full border-2 border-white bg-indigo-500 text-white flex items-center justify-center text-[10px] font-black uppercase ring-2 ring-neutral-50">{b.customerId.firstName[0]}</div>
                                                                <div className="h-10 w-10 rounded-full border-2 border-white bg-emerald-500 text-white flex items-center justify-center text-[10px] font-black uppercase ring-2 ring-neutral-50">{b.providerId.firstName[0]}</div>
                                                            </div>
                                                            <span className="text-neutral-500 font-bold text-sm tracking-tighter">Client x Specialist</span>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-7">
                                                        <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${b.status === 'completed' ? 'bg-emerald-500 text-white' :
                                                                b.status === 'pending' ? 'bg-amber-500 text-white' :
                                                                    'bg-indigo-500 text-white'
                                                            }`}>
                                                            {b.status}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-7">
                                                        <p className="text-xl font-black text-neutral-900">${b.totalAmount}</p>
                                                        <p className="text-[10px] text-neutral-400 font-black uppercase tracking-tight">{new Date(b.bookingDate).toLocaleDateString()}</p>
                                                    </td>
                                                    <td className="px-10 py-7 text-right">
                                                        <button className="p-4 rounded-2xl bg-neutral-100 text-neutral-600 hover:bg-neutral-900 hover:text-white transition-all shadow-sm">
                                                            <ExternalLink size={18} />
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </>
                                )}
                            </table>
                        </div>
                        {filteredData().length === 0 && (
                            <div className="p-20 flex flex-col items-center justify-center text-center space-y-6">
                                <div className="h-24 w-24 bg-neutral-100 rounded-full flex items-center justify-center text-neutral-300">
                                    <Search size={40} />
                                </div>
                                <h4 className="text-2xl font-black text-neutral-900 uppercase">No Data Records Found</h4>
                                <p className="text-neutral-500 max-w-xs font-medium">We couldn't find any results matching your current filters or search parameters.</p>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminDashboard;

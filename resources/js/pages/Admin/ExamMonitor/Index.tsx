import { Head, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { useEffect } from 'react';
import { Activity, User, CheckCircle2, Timer as TimerIcon } from 'lucide-react';

interface Attempt {
    id: number;
    user: string;
    exam: string;
    answered: number;
    total: number;
    remaining_seconds: number;
    status: string;
}

interface Props {
    attempts: Attempt[];
}

export default function ExamMonitor({ attempts }: Props) {
    useEffect(() => {
        const interval = setInterval(() => {
            router.reload({
                only: ['attempts'],
                preserveScroll: true,
            });
        }, 5000);

        return () => clearInterval(interval);
    }, []);

    return (
        <AppLayout>
            <Head title="Live Exam Monitor" />

            <div className="mx-auto flex min-h-screen w-full max-w-7xl flex-col bg-white p-6 md:p-12">
                {/* Dashboard Header */}
                <header className="mb-12 flex flex-col justify-between gap-6 md:flex-row md:items-center">
                    <div className="space-y-1">
                        <div className="mb-2 flex items-center gap-2">
                            <span className="flex h-2 w-2 animate-pulse rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.8)]"></span>
                            <span className="text-[10px] font-black tracking-[0.3em] text-emerald-600 uppercase">
                                Real-time Surveillance
                            </span>
                        </div>
                        <h1 className="text-4xl font-black tracking-tight text-slate-900">
                            Live{' '}
                            <span className="text-emerald-500">
                                Monitoring.
                            </span>
                        </h1>
                    </div>

                    <div className="flex items-center gap-4 rounded-3xl bg-slate-900 p-4 shadow-2xl shadow-slate-200">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 text-emerald-400">
                            <Activity size={20} />
                        </div>
                        <div className="pr-4">
                            <p className="mb-1 text-[9px] leading-none font-black tracking-widest text-slate-500 uppercase">
                                Active Connections
                            </p>
                            <p className="text-xl leading-none font-black text-white tabular-nums">
                                {
                                    attempts.filter(
                                        (a) => a.status === 'running',
                                    ).length
                                }
                            </p>
                        </div>
                    </div>
                </header>

                {/* Table Container */}
                <div className="overflow-hidden rounded-[2.5rem] bg-white shadow-[0_20px_50px_-20px_rgba(0,0,0,0.05)] ring-1 ring-slate-100">
                    <table className="w-full border-collapse">
                        <thead>
                            <tr className="bg-emerald-200 text-slate-900">
                                <th className="px-8 py-6 text-left text-[10px] font-black tracking-[0.2em] uppercase">
                                    Candidate
                                </th>
                                <th className="px-6 py-6 text-left text-[10px] font-black tracking-[0.2em] uppercase">
                                    Module Context
                                </th>
                                <th className="px-6 py-6 text-left text-[10px] font-black tracking-[0.2em] uppercase">
                                    Progress Map
                                </th>
                                <th className="px-6 py-6 text-left text-[10px] font-black tracking-[0.2em] uppercase">
                                    Clock Remaining
                                </th>
                                <th className="px-8 py-6 text-right text-[10px] font-black tracking-[0.2em] uppercase">
                                    Session Status
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {attempts.map((a) => {
                                const totalSeconds = Math.floor(
                                    a.remaining_seconds,
                                );
                                const minutes = Math.floor(totalSeconds / 60);
                                const seconds = totalSeconds % 60;
                                const progress = (a.answered / a.total) * 100;
                                const isRunning = a.status === 'running';

                                return (
                                    <tr
                                        key={a.id}
                                        className="group transition-all duration-300"
                                    >
                                        <td className="bg-slate-50/50 px-8 py-6 transition-colors group-hover:bg-slate-100">
                                            <div className="flex items-center gap-4">
                                                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-slate-400 transition-all group-hover:bg-slate-900 group-hover:text-white">
                                                    <User size={18} />
                                                </div>
                                                <span className="font-bold tracking-tight text-slate-900">
                                                    {a.user}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="bg-slate-50/50 px-6 py-6 transition-colors group-hover:bg-slate-100">
                                            <div className="flex flex-col">
                                                <span className="max-w-[180px] truncate text-sm font-bold text-slate-600">
                                                    {a.exam}
                                                </span>
                                                <span className="text-[9px] font-black tracking-tighter text-slate-300 uppercase">
                                                    Exam Module
                                                </span>
                                            </div>
                                        </td>
                                        <td className="min-w-[200px] bg-slate-50/50 px-6 py-6 transition-colors group-hover:bg-slate-100">
                                            <div className="space-y-2">
                                                <div className="flex items-center justify-between text-[10px] font-black tracking-widest text-slate-400 uppercase">
                                                    <span>
                                                        {a.answered} / {a.total}
                                                    </span>
                                                    <span>
                                                        {Math.round(progress)}%
                                                    </span>
                                                </div>
                                                <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
                                                    <div
                                                        className={`h-full transition-all duration-1000 ${isRunning ? 'bg-emerald-500' : 'bg-slate-300'}`}
                                                        style={{
                                                            width: `${progress}%`,
                                                        }}
                                                    ></div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-6">
                                            <div className="flex items-center gap-2 font-black tracking-tighter text-slate-900 tabular-nums">
                                                <TimerIcon
                                                    size={14}
                                                    className={
                                                        isRunning
                                                            ? 'text-emerald-500'
                                                            : 'text-slate-300'
                                                    }
                                                />
                                                {isRunning
                                                    ? `${minutes}:${String(seconds).padStart(2, '0')}`
                                                    : '--:--'}
                                            </div>
                                        </td>
                                        <td className="px-8 py-6 text-right">
                                            {isRunning ? (
                                                <div className="inline-flex items-center gap-2 rounded-full border border-emerald-100 bg-emerald-50 px-4 py-1.5 text-[9px] font-black tracking-widest text-emerald-600 uppercase">
                                                    <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-500"></span>
                                                    Live Session
                                                </div>
                                            ) : (
                                                <div className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-4 py-1.5 text-[9px] font-black tracking-widest text-slate-400 uppercase">
                                                    <CheckCircle2 size={10} />
                                                    Completed
                                                </div>
                                            )}
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>

                {/* Minimalist Footer */}
                <footer className="mt-24 flex items-center justify-between border-t border-slate-200 pt-8">
                    <p className="text-[10px] font-black tracking-[0.4em] text-slate-700 uppercase">
                        Diskominfo Kabupaten Muara Enim
                    </p>
                    <div className="flex h-2 items-center gap-2">
                        <span className="text-[9px] font-bold text-slate-700 uppercase">
                            AHDA Dev | V.1.0
                        </span>
                        <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400"></span>
                    </div>
                </footer>
            </div>
        </AppLayout>
    );
}

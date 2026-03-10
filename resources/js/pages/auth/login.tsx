import { Form, Head } from '@inertiajs/react';
import InputError from '@/components/input-error';
import PasswordInput from '@/components/password-input';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import { register as registerRoute } from '@/routes';
import { store } from '@/routes/login';
import { request } from '@/routes/password';
import { LogIn, ShieldCheck, LockKeyhole } from 'lucide-react';

type Props = {
    status?: string;
    canResetPassword: boolean;
    canRegister: boolean;
};

export default function Login({
    status,
    canResetPassword,
    canRegister,
}: Props) {
    return (
        <div className="min-h-screen bg-[#020617] text-slate-200 font-sans flex flex-col justify-center relative overflow-hidden">
            {/* Background Decor - Konsisten dengan Welcome & Register */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-emerald-600/5 blur-[120px] rounded-full"></div>
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-600/5 blur-[120px] rounded-full"></div>
            </div>

            <Head title="Log in - Seleksi Tenaga Ahli" />

            <div className="relative z-10 w-full max-w-md mx-auto p-6">
                {/* Logo & Header */}
                <div className="text-center mb-8">
                    <div className="inline-flex p-3 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl shadow-lg shadow-emerald-500/20 mb-4">
                        <LogIn className="text-white" size={28} />
                    </div>
                    <h2 className="text-3xl font-black text-white tracking-tight">Selamat Datang</h2>
                    <p className="text-slate-400 text-sm mt-2 font-medium">
                        Portal Ujian Tenaga Ahli
                        <br /><span className="text-emerald-400">Kabupaten Muara Enim</span>
                    </p>
                </div>

                {status && (
                    <div className="mb-6 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-center text-sm font-medium text-emerald-400 backdrop-blur-sm">
                        {status}
                    </div>
                )}

                {/* Glassmorphism Card */}
                <div className="bg-slate-900/40 border border-slate-800 backdrop-blur-xl p-8 rounded-[2.5rem] shadow-2xl">
                    <Form
                        {...store.form()}
                        resetOnSuccess={['password']}
                        className="flex flex-col gap-5"
                    >
                        {({ processing, errors }) => (
                            <>
                                <div className="grid gap-5">
                                    {/* Email Field */}
                                    <div className="grid gap-2">
                                        <Label htmlFor="email" className="text-slate-300 ml-1 font-semibold text-xs uppercase tracking-widest">Alamat Email</Label>
                                        <Input
                                            id="email"
                                            type="email"
                                            name="email"
                                            required
                                            autoFocus
                                            tabIndex={1}
                                            autoComplete="email"
                                            placeholder="email@example.com"
                                            className="bg-slate-800/50 border-slate-700 rounded-xl focus:ring-emerald-500/20 focus:border-emerald-500/50 py-6 transition-all"
                                        />
                                        <InputError message={errors.email} />
                                    </div>

                                    {/* Password Field */}
                                    <div className="grid gap-2">
                                        <div className="flex items-center justify-between ml-1">
                                            <Label htmlFor="password" className="text-slate-300 font-semibold text-xs uppercase tracking-widest">Password</Label>
                                            {canResetPassword && (
                                                <TextLink
                                                    href={request()}
                                                    className="text-xs text-emerald-400 hover:text-emerald-300 transition-colors font-medium"
                                                    tabIndex={5}
                                                >
                                                    Lupa password?
                                                </TextLink>
                                            )}
                                        </div>
                                        <PasswordInput
                                            id="password"
                                            name="password"
                                            required
                                            tabIndex={2}
                                            autoComplete="current-password"
                                            placeholder="••••••••"
                                            className="bg-slate-800/50 border-slate-700 rounded-xl focus:ring-emerald-500/20 focus:border-emerald-500/50 py-6 transition-all"
                                        />
                                        <InputError message={errors.password} />
                                    </div>

                                    {/* Remember Me */}
                                    <div className="flex items-center space-x-3 ml-1">
                                        <Checkbox
                                            id="remember"
                                            name="remember"
                                            tabIndex={3}
                                            className="border-slate-700 data-[state=checked]:bg-emerald-600 data-[state=checked]:border-emerald-600"
                                        />
                                        <Label htmlFor="remember" className="text-xs text-slate-400 font-medium cursor-pointer select-none">Ingat perangkat ini</Label>
                                    </div>

                                    {/* Login Button */}
                                    <Button
                                        type="submit"
                                        className="mt-4 w-full py-6 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold transition-all shadow-lg shadow-emerald-600/20 active:scale-95 flex items-center justify-center gap-2"
                                        tabIndex={4}
                                        disabled={processing}
                                        data-test="login-button"
                                    >
                                        {processing ? <Spinner size="sm" /> : <LockKeyhole size={18} />}
                                        Masuk
                                    </Button>
                                </div>

                                {/* Register Link */}
                                {canRegister && (
                                    <div className="text-center text-sm text-slate-500 mt-2">
                                        Belum punya akun?{' '}
                                        <TextLink
                                            href={registerRoute()}
                                            tabIndex={6}
                                            className="text-emerald-400 hover:text-emerald-300 font-semibold underline-offset-4"
                                        >
                                            Daftar
                                        </TextLink>
                                    </div>
                                )}
                            </>
                        )}
                    </Form>
                </div>

                {/* Secure Footer */}
                <div className="mt-8 flex flex-col items-center gap-2 opacity-40">
                    <div className="flex items-center gap-2">
                        <ShieldCheck size={14} className="text-emerald-500" />
                        <span className="text-[10px] text-slate-400 tracking-[0.2em] font-bold uppercase">Authorized Access Only</span>
                    </div>
                    <p className="text-[9px] text-slate-500 tracking-wider">
                        Diskominfo Kabupaten Muara Enim
                    </p>
                </div>
            </div>
        </div>
    );
}

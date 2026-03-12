import { Form, Head } from '@inertiajs/react';
import InputError from '@/components/input-error';
import PasswordInput from '@/components/password-input';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import { login } from '@/routes';
import { store } from '@/routes/register';
import { UserPlus, ShieldCheck } from 'lucide-react';

export default function Register() {
    return (
        <div className="min-h-screen bg-[#020617] text-slate-200 font-sans flex flex-col justify-center relative overflow-hidden">
            {/* Background Decor - Konsisten dengan Welcome Page */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-emerald-600/5 blur-[120px] rounded-full"></div>
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-600/5 blur-[120px] rounded-full"></div>
            </div>

            <Head title="Pendaftaran Tenaga Ahli" />

            <div className="relative z-10 w-full max-w-md mx-auto my-10 p-6">
                {/* Logo & Header */}
                <div className="text-center mb-8">
                    <div className="inline-flex p-3 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl shadow-lg shadow-emerald-500/20 mb-4">
                        <UserPlus className="text-white" size={28} />
                    </div>
                    <h2 className="text-3xl font-black text-white tracking-tight">Buat Akun</h2>
                    <p className="text-slate-400 text-sm mt-2 font-medium">
                        Portal Ujian Tenaga Ahli <br />
                        <span className="text-emerald-400">Kab. Muara Enim</span>
                    </p>
                </div>

                {/* Glassmorphism Card */}
                <div className="bg-slate-900/40 border border-slate-800 backdrop-blur-xl p-8 rounded-[2.5rem] shadow-2xl">
                    <Form
                        {...store.form()}
                        resetOnSuccess={['password', 'password_confirmation']}
                        disableWhileProcessing
                        className="flex flex-col gap-5"
                    >
                        {({ processing, errors }) => (
                            <>
                                <div className="grid gap-5">
                                    <div className="grid gap-2">
                                        <Label htmlFor="name" className="text-slate-300 ml-1 font-semibold text-xs uppercase tracking-widest">Nama Lengkap</Label>
                                        <Input
                                            id="name"
                                            type="text"
                                            required
                                            autoFocus
                                            tabIndex={1}
                                            autoComplete="name"
                                            name="name"
                                            placeholder="Masukkan nama lengkap"
                                            className="bg-slate-800/50 border-slate-700 rounded-xl focus:ring-emerald-500/20 focus:border-emerald-500/50 py-6 transition-all"
                                        />
                                        <InputError
                                            message={errors.name}
                                            className="mt-1"
                                        />
                                    </div>

                                    <div className="grid gap-2">
                                        <Label htmlFor="email" className="text-slate-300 ml-1 font-semibold text-xs uppercase tracking-widest">Alamat Email</Label>
                                        <Input
                                            id="email"
                                            type="email"
                                            required
                                            tabIndex={2}
                                            autoComplete="email"
                                            name="email"
                                            placeholder="email@muaraenimkab.go.id"
                                            className="bg-slate-800/50 border-slate-700 rounded-xl focus:ring-emerald-500/20 focus:border-emerald-500/50 py-6 transition-all"
                                        />
                                        <InputError message={errors.email} />
                                    </div>

                                    <div className="grid gap-2">
                                        <Label htmlFor="password" className="text-slate-300 ml-1 font-semibold text-xs uppercase tracking-widest">Password</Label>
                                        <PasswordInput
                                            id="password"
                                            required
                                            tabIndex={3}
                                            autoComplete="new-password"
                                            name="password"
                                            placeholder="••••••••"
                                            className="bg-slate-800/50 border-slate-700 rounded-xl focus:ring-emerald-500/20 focus:border-emerald-500/50 py-6 transition-all"
                                        />
                                        <InputError message={errors.password} />
                                    </div>

                                    <div className="grid gap-2">
                                        <Label htmlFor="password_confirmation" className="text-slate-300 ml-1 font-semibold text-xs uppercase tracking-widest">Konfirmasi Password</Label>
                                        <PasswordInput
                                            id="password_confirmation"
                                            required
                                            tabIndex={4}
                                            autoComplete="new-password"
                                            name="password_confirmation"
                                            placeholder="••••••••"
                                            className="bg-slate-800/50 border-slate-700 rounded-xl focus:ring-emerald-500/20 focus:border-emerald-500/50 py-6 transition-all"
                                        />
                                        <InputError
                                            message={errors.password_confirmation}
                                        />
                                    </div>

                                    <Button
                                        type="submit"
                                        className="mt-4 w-full py-6 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold transition-all shadow-lg shadow-emerald-600/20 active:scale-95 flex items-center justify-center gap-2"
                                        tabIndex={5}
                                        disabled={processing}
                                        data-test="register-user-button"
                                    >
                                        {processing ? <Spinner size="sm" /> : <ShieldCheck size={18} />}
                                        Daftar
                                    </Button>
                                </div>

                                <div className="text-center text-sm text-slate-500 mt-2">
                                    Sudah memiliki akun?{' '}
                                    <TextLink
                                        href={login()}
                                        tabIndex={6}
                                        className="text-emerald-400 hover:text-emerald-300 font-semibold underline-offset-4"
                                    >
                                        Log in
                                    </TextLink>
                                </div>
                            </>
                        )}
                    </Form>
                </div>

                {/* Secure Footer */}
                <div className="mt-8 flex flex-col items-center gap-2 opacity-40">
                    <div className="flex items-center gap-2">
                        <ShieldCheck size={14} className="text-emerald-500" />
                        <span className="text-[10px] text-slate-400 tracking-[0.2em] font-bold uppercase">Secure Registration System</span>
                    </div>
                    <p className="text-sm text-slate-500 tracking-wider">
                        DISKOMINFO Kabupaten Muara Enim
                    </p>
                </div>
            </div>
        </div>
    );
}

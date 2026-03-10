import { GraduationCap } from 'lucide-react';

export default function AppLogoIcon() {
    return (
        <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl shadow-lg shadow-emerald-500/20">
                <GraduationCap className="text-white" size={24} />
            </div>
        </div>
    );
}

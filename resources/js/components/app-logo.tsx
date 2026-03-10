import AppLogoIcon from '@/components/app-logo-icon';

export default function AppLogo() {
    return (
        <>
            <div className="flex aspect-square size-8 items-center justify-center rounded-md bg-sidebar-primary text-sidebar-primary-foreground">
                <AppLogoIcon className="size-5 fill-current text-white dark:text-black" />
            </div>
            <div className="ml-1 grid flex-1 text-left">
                <p className="mb-0.5 text-lg truncate leading-tight font-bold">
                    E-Learning
                </p>
                <span className="mb-0.5 text-xs truncate leading-tight font-normal">
                    Kabupaten Muara Enim
                </span>
            </div>
        </>
    );
}

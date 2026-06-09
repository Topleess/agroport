import { AuthTabs } from "@/components/auth-form";
import { PlatformHeader } from "@/components/platform-header";

export function AuthShell({
  active,
  children,
  footer,
  showTabs = true,
}: {
  active: "login" | "register";
  children: React.ReactNode;
  footer?: React.ReactNode;
  showTabs?: boolean;
}) {
  const sectionClassName =
    active === "login"
      ? "mx-auto grid min-h-[calc(100svh-88px)] max-w-[1760px] place-items-center px-5 py-8 md:min-h-[calc(100svh-104px)] md:px-8 md:py-12"
      : "mx-auto grid min-h-[calc(100svh-88px)] max-w-[1760px] place-items-start px-5 pb-10 pt-[max(2rem,calc((100svh-88px-414px)/2))] md:min-h-[calc(100svh-104px)] md:px-8 md:pb-12 md:pt-[max(3rem,calc((100svh-104px-460px)/2))]";

  return (
    <main className="min-h-screen bg-[linear-gradient(118deg,#27c27d_0%,#28b7cb_48%,#f7fbff_100%)] text-zinc-950">
      <PlatformHeader mode="auth" />

      <section className={sectionClassName}>
        <div className="mx-auto w-full max-w-[500px]">
          <div className="rounded-[28px] bg-white px-5 py-6 shadow-[0_24px_70px_rgba(22,79,91,0.13)] md:px-8 md:py-7">
            {showTabs ? <AuthTabs active={active} /> : null}
            {children}
            {footer ? <div className="mt-5 text-center">{footer}</div> : null}
          </div>
        </div>
      </section>
    </main>
  );
}

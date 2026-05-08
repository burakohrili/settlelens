import { Disclaimer } from "@/components/layout/Disclaimer";

export default function OnboardingLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-auto max-w-2xl px-4 py-8 sm:px-6">
      <Disclaimer className="mb-6" />
      {children}
    </div>
  );
}

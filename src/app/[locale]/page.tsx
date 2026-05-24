import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";

export default function Home() {
  const t = useTranslations("home");

  return (
    <div className="bg-surface flex min-h-screen flex-col items-center justify-center">
      <main className="flex flex-col items-center gap-8 p-8">
        <h1 className="text-on-surface text-4xl font-bold tracking-tight">
          {t("heading")}
        </h1>
        <p className="text-on-surface-variant max-w-md text-center">
          {t("subheading")}
        </p>
        <Button>{t("browseEvents")}</Button>
      </main>
    </div>
  );
}

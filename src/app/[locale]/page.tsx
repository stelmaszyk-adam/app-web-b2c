import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";

export default function Home() {
  const t = useTranslations("home");

  return (
    <div className="mx-auto flex max-w-[1440px] flex-col items-center justify-center px-6 py-16 md:py-24">
      <h1 className="text-on-surface text-4xl font-bold tracking-tight">
        {t("heading")}
      </h1>
      <p className="text-on-surface-variant mt-4 max-w-md text-center">
        {t("subheading")}
      </p>
      <Button className="mt-8">{t("browseEvents")}</Button>
    </div>
  );
}

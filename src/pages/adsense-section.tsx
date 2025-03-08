import { cn } from "@/lib/utils";

interface AdvertisementSectionProps {
  className?: string;
}

const AdvertisementSection: React.FC<AdvertisementSectionProps> = ({ className }) => {
  return (
    <section
      className={cn(
        "bg-blue-600 shadow-2xl backdrop-blur-lg p-8 rounded-2xl text-white",
        className
      )}
    >
      <p className="text-lg">
        マスターデュエルを始める、または最終ログインから30日経過してる方、よかったらフォローお願いします。(
        <a
          href="https://x.com/YuGiOh_MD_INFO/status/1887443153806106970"
          target="_blank"
          className="link"
        >
          相互フォローキャンペーン
        </a>
        のコード: 1d07ee73)
      </p>

      <img src="/md.png" className="mt-1" />
    </section>
  );
};

export { AdvertisementSection };

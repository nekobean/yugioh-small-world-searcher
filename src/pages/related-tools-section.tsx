import { cn } from "@/lib/utils";
import { Avatar, AvatarImage } from "@/components/ui/avatar";

interface RelatedToolsSectionProps {
  className?: string;
}

const RelatedToolsSection: React.FC<RelatedToolsSectionProps> = ({ className }) => {
  return (
    <section className={cn("bg-blue-600 shadow-2xl p-8 rounded-2xl text-white", className)}>
      <h2 className="font-bold text-3xl">関連ツール</h2>

      <div className="flex space-x-10 mt-6">
        <a
          href="https://pystyle.info/apps/yugioh-sec-calculator/"
          className="flex flex-col items-center"
          target="_blank"
        >
          <Avatar className="hover:shadow-md rounded-xl size-36 hover:scale-110 transition-transform duration-100">
            <AvatarImage src="yugioh-sec-calculator.png" />
          </Avatar>
          <div className="mt-2 text-lg">連慄砲固定式計算ツール</div>
        </a>

        <a
          href="https://pystyle.info/apps/yugioh-spirit-sculptor-searcher/"
          className="flex flex-col items-center"
          target="_blank"
        >
          <Avatar className="hover:shadow-md rounded-xl size-36 hover:scale-110 transition-transform duration-100">
            <AvatarImage src="yugioh-spirit-sculptor-searcher.png" />
          </Avatar>
          <div className="mt-2 text-lg">魂の造形家検索ツール</div>
        </a>
      </div>
    </section>
  );
};

export { RelatedToolsSection };

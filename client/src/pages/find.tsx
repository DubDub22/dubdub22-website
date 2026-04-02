import DealerMap from "@/components/DealerMap";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";

export default function FindPage() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <SiteHeader />
      <div className="pt-16 flex-1">
        <DealerMap />
      </div>
      <SiteFooter />
    </div>
  );
}

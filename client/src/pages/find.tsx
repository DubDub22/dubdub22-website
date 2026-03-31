import DealerMap from "@/components/DealerMap";
import SiteHeader from "@/components/SiteHeader";

export default function FindPage() {
  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <div className="pt-16">
        <DealerMap />
      </div>
    </div>
  );
}

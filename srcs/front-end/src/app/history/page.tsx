import HistorySmallScreenView from "@/components/HomePages/HistorySmallScreenView";
import HomePageNav from "../../components/HomePages/HomePageNav";
import HistoryLargeScreenView from "@/components/HomePages/HistoryLargeScreenView";

export default function Home() {
  return (
    <div className="bg-black w-full h-full">
      <HomePageNav />
      <main className="bg-[#EFECFF] w-full h-[88%]">
        <HistorySmallScreenView />
        <HistoryLargeScreenView />
      </main>
    </div>
  );
}

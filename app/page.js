import FoodCategories from "@/components/ui/Homecomponets/Categories";
import Header from "@/components/ui/Homecomponets/Header";
import Quickpick from "@/components/ui/Homecomponets/Quickpick";
import TodaysSpecial from "@/components/ui/Homecomponets/Todaysspecial";

export default function Component() {
  return (
    <section className="">
      <Header />
      <FoodCategories/>
      <TodaysSpecial/>
      <div className="py-4">

      <Quickpick/>
      </div>
    </section>
  );
}

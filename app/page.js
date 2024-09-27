import FoodCategories from "@/components/ui/Homecomponets/Categories";
import Header from "@/components/ui/Homecomponets/Header";
import TodaysSpecial from "@/components/ui/Homecomponets/Todaysspecial";

export default function Component() {
  return (
    <section className="">
      <Header />
      <FoodCategories/>
      <TodaysSpecial/>
    </section>
  );
}

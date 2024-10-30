export const dynamic = 'force-dynamic'

import HeroSlider from "@/components/Sliders/HeroSlider";
import CategorySlider from "@/components/Sliders/CategorySlider";
import GameCategory from "@/components/GameCategory";
import { getGameCategories, getGamesByCategoryId, getGamesBySelectedCategories } from "@/lib/gameQueries";

export default async function Home() {
  try {
    const [categories, category] = await Promise.all([
      getGameCategories(),
      getGamesByCategoryId(1)
    ]);

    if (!categories) {
      console.error('Failed to fetch categories');
      return <div>Error: Could not load categories</div>;
    }

    if (!category) {
      console.error('Failed to fetch category with ID 1');
      return <div>Error: Could not load featured category</div>;
    }

    const selectedCategoryIds = [1,2,5];
    const multipleCategories = await getGamesBySelectedCategories(selectedCategoryIds);

    return (
      <>
        <HeroSlider />
        <CategorySlider categories={categories} />
        <GameCategory category={category} />
      </>
    );
  } catch (error) {
    console.error('Error in Home page:', error);
    return <div>Error loading page content</div>;
  }
}

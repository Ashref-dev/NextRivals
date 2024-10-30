export const dynamic = 'force-dynamic'

import HeroSlider from "@/components/Sliders/HeroSlider";
import CategorySlider from "@/components/Sliders/CategorySlider";
import GameCategory from "@/components/GameCategory";
import { getGameCategories, getGamesByCategoryId, getGamesBySelectedCategories } from "@/lib/gameQueries";

export default async function Home() {
  // Add error handling and null checks
  try {
    const [categories, category] = await Promise.all([
      getGameCategories(),
      getGamesByCategoryId(1)
    ]);

    // Guard clause for null data
    if (!categories || !category) {
      return <div>Loading...</div>;
    }

    const selectedCategoryIds = [1,2,5];
    const multipleCategories = await getGamesBySelectedCategories(selectedCategoryIds);

    return (
      <>
        <HeroSlider />
        {categories.length > 0 && <CategorySlider categories={categories} />}
        {category && <GameCategory category={category} />}
      </>
    );
  } catch (error) {
    console.error('Error loading home page:', error);
    return <div>Error loading page content</div>;
  }
}

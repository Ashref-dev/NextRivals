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

    if (!categories || !Array.isArray(categories)) {
      console.error('Categories data is invalid:', categories);
      return <div>Error: Invalid categories data</div>;
    }

    if (!category || !category.title) {
      console.error('Category data is invalid:', category);
      return <div>Error: Invalid category data</div>;
    }

    const selectedCategoryIds = [1,2,5];
    const multipleCategories = await getGamesBySelectedCategories(selectedCategoryIds);

    return (
      <>
        <HeroSlider />
        {categories.length > 0 && <CategorySlider categories={categories} />}
        {category && category.games && <GameCategory category={category} />}
      </>
    );
  } catch (error) {
    console.error('Error loading home page:', error);
    return <div>Error loading page content</div>;
  }
}

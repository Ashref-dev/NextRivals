export const dynamic = 'force-dynamic'

import HeroSlider from "@/components/Sliders/HeroSlider";
import CategorySlider from "@/components/Sliders/CategorySlider";
import GameCategory from "@/components/GameCategory";
import { getGameCategories, getGamesByCategoryId, getGamesBySelectedCategories } from "@/lib/gameQueries";

export default async function Home() {
  try {
    console.log('Starting to fetch data...');

    const [categories, category] = await Promise.all([
      getGameCategories(),
      getGamesByCategoryId(1)
    ]);

    console.log('Data fetch complete:');
    console.log('Categories:', categories);
    console.log('Category:', category);

    if (!categories?.length) {
      console.log('No categories found');
      return <div>No categories available</div>;
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
    console.error('Detailed error in Home page:', {
      message: error.message,
      stack: error.stack,
      cause: error.cause
    });
    
    return (
      <div className="p-4 text-center">
        <h2 className="text-xl font-bold text-red-500 mb-2">Error loading page content</h2>
        <p className="text-sm text-gray-400">Please try refreshing the page</p>
        {process.env.NODE_ENV === 'development' && (
          <pre className="mt-4 text-left text-sm bg-gray-800 p-4 rounded">
            {error.message}
          </pre>
        )}
      </div>
    );
  }
}

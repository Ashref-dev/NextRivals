import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export async function POST(request) {
  try {
    const data = await request.json();
    
    // Basic validation
    if (!data.title?.trim()) {
      return Response.json({ error: 'Game title is required' }, { status: 400 });
    }
    if (!data.game_url?.trim()) {
      return Response.json({ error: 'Game URL is required' }, { status: 400 });
    }

    // Create slug from title
    const slug = data.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');

    // Find or create category
    let category;
    if (data.category) {
      const categorySlug = data.category
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');

      category = await prisma.category.upsert({
        where: { slug: categorySlug },
        update: {},
        create: {
          title: data.category.trim(),
          slug: categorySlug,
        },
      });
    }

    // Create the game
    const game = await prisma.game.create({
      data: {
        title: data.title.trim(),
        slug: slug,
        game_url: data.game_url.trim(),
        image: data.image?.trim() || '',
        published: true,
        ...(category && {
          categories: {
            connect: {
              id: category.id
            }
          }
        })
      },
    });

    return Response.json(game);

  } catch (error) {
    console.error('Error creating game:', error);
    return Response.json(
      { error: 'Failed to create game. Please try again.' },
      { status: 500 }
    );
  }
} 
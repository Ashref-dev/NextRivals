import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function POST(request) {
  try {
    const data = await request.json();
    
    // Validate required fields
    if (!data.title) {
      return NextResponse.json(
        { error: 'Title is required' },
        { status: 400 }
      );
    }

    // Create slug from title
    const slug = data.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');

    // Create the game
    const game = await prisma.game.create({
      data: {
        title: data.title,
        slug: slug,
        game_url: data.game_url || '',
        image: data.image || '',
        published: true,
        // Add category if provided
        ...(data.category && {
          categories: {
            create: {
              title: data.category,
              slug: data.category.toLowerCase().replace(/[^a-z0-9]+/g, '-')
            }
          }
        })
      },
      include: {
        categories: true
      }
    });

    return NextResponse.json(game);

  } catch (error) {
    console.error('Error creating game:', error);
    return NextResponse.json(
      { error: 'Failed to create game' },
      { status: 500 }
    );
  }
} 
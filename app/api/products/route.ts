import { NextRequest, NextResponse } from 'next/server';
import { getAllProducts, addProduct } from '@/lib/db';
import { verifyAdminKey, getApiKeyFromRequest } from '@/lib/auth';

/**
 * GET /api/products
 * Fetch all products
 * Public endpoint - no authentication required
 */
export async function GET(_request: NextRequest) {
  try {
    const products = await getAllProducts();
    return NextResponse.json(products, {
      headers: {
        'Cache-Control': 'public, max-age=60, stale-while-revalidate=300',
      },
    });
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json(
      { message: 'Failed to fetch products', error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/products
 * Create a new product
 * Protected endpoint - requires API key
 */
export async function POST(request: NextRequest) {
  try {
    // Verify authentication
    const apiKey = getApiKeyFromRequest(request.headers);
    if (!verifyAdminKey(apiKey)) {
      return NextResponse.json({ message: 'Unauthorized: Invalid or missing API key' }, { status: 401 });
    }

    // Parse request body
    const body = await request.json();
    const { name, slug, description, price, category, inventory } = body;

    // Validate required fields
    if (!name || !slug || price === undefined || inventory === undefined) {
      return NextResponse.json(
        { message: 'Missing required fields: name, slug, price, inventory' },
        { status: 400 }
      );
    }

    // Create product
    const newProduct = await addProduct({
      name,
      slug,
      description: description || '',
      price: parseFloat(price),
      category: category || 'Electronics',
      inventory: parseInt(inventory),
    });

    return NextResponse.json(newProduct, { status: 201 });
  } catch (error) {
    console.error('Error creating product:', error);
    return NextResponse.json(
      { message: 'Failed to create product', error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
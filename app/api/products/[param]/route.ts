import { NextRequest, NextResponse } from 'next/server';
import { getProductById, getProductBySlug, updateProduct } from '@/lib/db';
import { verifyAdminKey, getApiKeyFromRequest } from '@/lib/auth';

/**
 * GET /api/products/[param]
 * Fetch a single product by slug or ID
 * Public endpoint - no authentication required
 */
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ param: string }> }
) {
  try {
    const { param } = await params;

    if (!param) {
      return NextResponse.json({ message: 'Product identifier is required' }, { status: 400 });
    }

    // Try to fetch by slug first, then by ID
    let product = await getProductBySlug(param);
    if (!product) {
      product = await getProductById(param);
    }

    if (!product) {
      return NextResponse.json({ message: 'Product not found' }, { status: 404 });
    }

    return NextResponse.json(product, {
      headers: {
        'Cache-Control': 'public, max-age=60, stale-while-revalidate=300',
      },
    });
  } catch (error) {
    console.error('Error fetching product:', error);
    return NextResponse.json(
      { message: 'Failed to fetch product', error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/products/[param]
 * Update a product by ID
 * Protected endpoint - requires API key
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ param: string }> }
) {
  try {
    // Verify authentication
    const apiKey = getApiKeyFromRequest(request.headers);
    if (!verifyAdminKey(apiKey)) {
      return NextResponse.json({ message: 'Unauthorized: Invalid or missing API key' }, { status: 401 });
    }

    const { param } = await params;

    if (!param) {
      return NextResponse.json({ message: 'Product ID is required' }, { status: 400 });
    }

    // Check if product exists
    const existingProduct = await getProductById(param);
    if (!existingProduct) {
      return NextResponse.json({ message: 'Product not found' }, { status: 404 });
    }

    // Parse request body
    const body = await request.json();
    const { name, slug, description, price, category, inventory } = body;

    // Update product
    const updatedProduct = await updateProduct(param, {
      ...(name && { name }),
      ...(slug && { slug }),
      ...(description !== undefined && { description }),
      ...(price !== undefined && { price: parseFloat(price) }),
      ...(category && { category }),
      ...(inventory !== undefined && { inventory: parseInt(inventory) }),
    });

    return NextResponse.json(updatedProduct);
  } catch (error) {
    console.error('Error updating product:', error);
    return NextResponse.json(
      { message: 'Failed to update product', error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
// app/api/admin/products/bulk-upload/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { parse } from 'papaparse';
import slugify from 'slugify';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/auth';

export async function POST(req: NextRequest) {
  try {
    await requireAdmin();

    const formData = await req.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    const csvText = await file.text();
    console.log("CSV Content Preview:", csvText.substring(0, 500));

    const parseResult = parse(csvText, {
      header: true,
      skipEmptyLines: true,
      transformHeader: (h) => h.trim().toLowerCase().replace(/\s+/g, '_'),
    });

    const rows = parseResult.data as any[];
    console.log(`Parsed ${rows.length} rows:`, rows);

    const successes: any[] = [];
    const errors: any[] = [];

    for (let i = 0; i < rows.length; i++) {
      const row = rows[i];
      const rowNumber = i + 2;

      try {
        if (!row.name?.trim() || !row.price || !row.category_id) {
          throw new Error(`Missing required fields (name, price, category_id). Got: ${JSON.stringify(Object.keys(row))}`);
        }

        const category = await prisma.category.findUnique({
          where: { id: row.category_id.trim() },
        });

        if (!category) {
          throw new Error(`Category ID "${row.category_id}" not found`);
        }

        const features = row.features
          ? row.features.split(/[\n|]/).map((f: string) => f.trim()).filter(Boolean)
          : [];

        const images = row.images
          ? row.images.split(',').map((url: string) => url.trim()).filter(Boolean)
          : [];

        const productData = {
          name: row.name.trim(),
          slug: slugify(row.name, { lower: true, strict: true }) + '-' + Date.now().toString().slice(-6),
          description: (row.description || '').trim(),
          longDescription: (row.long_description || '').trim(),
          price: Number(row.price),
          stock: Number(row.stock) || 0,
          emoji: (row.emoji || '📦').trim(),
          badge: row.badge?.trim() || null,
          featured: row.featured === 'true' || row.featured === true,
          isActive: row.is_active !== 'false',
          features,
          specifications: row.specifications ? JSON.parse(row.specifications) : {},
          categoryId: row.category_id.trim(),
          images,
        };

        const product = await prisma.product.create({
          data: productData,
        });

        successes.push({ row: rowNumber, name: product.name, id: product.id });
      } catch (err: any) {
        errors.push({ row: rowNumber, error: err.message, rowData: row });
      }
    }

    return NextResponse.json({
      message: `Processed ${rows.length} rows`,
      successes: successes.length,
      errors: errors.length,
      details: { successes, errors },
    });

  } catch (error: any) {
    console.error("Bulk upload error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
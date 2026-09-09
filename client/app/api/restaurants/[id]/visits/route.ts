import { NextResponse } from 'next/server';
import { pool } from '@/db/pool';
import { handleError } from '@/lib/errors';
import { toVisit } from '@/lib/types';
import { parseId } from '@/lib/validation';


type Params = { params: { id: string } };

/**
 * GET /api/restaurants/:id/visits
 * Returns all visits for a restaurant.
 */
export async function GET(_req: Request, { params }: Params) {
  try {
    const id = parseId(params.id);
    if (id === null) {
        return NextResponse.json({ error: 'Restaurant not found' }, { status: 404 });
    }

    const { rows } = await pool.query(
      'SELECT * FROM visits WHERE "restaurantId" = $1 ORDER BY date DESC', [id]
    );
    // Map every row - raw rows don't match the contract (NUMERIC comes back
    // as a string, timestamps as Date objects). See lib/types.ts.
    return NextResponse.json(rows.map(toVisit));
 
  } catch (err) {
    return handleError(err);
  }
}
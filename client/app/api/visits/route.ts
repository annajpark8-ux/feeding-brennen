import { NextResponse } from 'next/server';
import { pool } from '@/db/pool';
import { handleError } from '@/lib/errors';
import { toVisit } from '@/lib/types';
import { validateVisit } from '@/lib/validation';

/**
 * GET /api/visits
 * Returns all visits.
 */
export async function GET() {
  try {
    const { rows } = await pool.query(
      'SELECT * FROM visits ORDER BY date DESC, created_at DESC'
    );
    // Map every row - raw rows don't match the contract (NUMERIC comes back
    // as a string, timestamps as Date objects). See lib/types.ts.
    return NextResponse.json(rows.map(toVisit));
 
  } catch (err) {
    return handleError(err);
  }
}

/**
 * POST /api/visits
 * Create a new visit.
 */
export async function POST(_req: Request) {
  try {
    const body = await _req.json(); //parse _req
    const error = validateVisit(body); //check for errors
    if (error) {
      return NextResponse.json({ error }, { status: 400 });
    }

    const { restaurantId, date, amountSpent, notes } = body; //pull out the attributes
    const { rows } = await pool.query(
    `INSERT INTO visits ("restaurantId", date, "amountSpent", notes) 
    VALUES ($1, $2, $3, $4) RETURNING *`,
    [restaurantId, date, amountSpent, notes]
    );
    
    return NextResponse.json(toVisit(rows[0]), { status: 201 }); //rows is an array of rows

  } catch (err) {
    return handleError(err);
  }
}

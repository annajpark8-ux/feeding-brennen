import { NextResponse } from 'next/server';
import { pool } from '@/db/pool';
import { handleError } from '@/lib/errors';
import { toVisit } from '@/lib/types';
import { validateVisit, parseId } from '@/lib/validation';


type Params = { params: { id: string } };

/**
 * GET /api/visits/:id
 * Returns a single visit, or 404 if it doesn't exist.
 */
export async function GET(_req: Request, { params }: Params) {
  try {
    const id = parseId(params.id);
    if (id === null) {
      return NextResponse.json({ error: 'Visit not found' }, { status: 404 });
    }

    const { rows } = await pool.query(
      'SELECT * FROM visits WHERE id = $1',
      [id]
    );

    if (rows.length === 0) {
      return NextResponse.json({ error: 'Visit not found' }, { status: 404 });
    }

    return NextResponse.json(toVisit(rows[0]));
  
  } catch (err) {
    return handleError(err);
  }
}

/**
 * PUT /api/visits/:id
 * Update an existing visit.
 */
export async function PUT(_req: Request, _ctx: Params) {
  try {
    const body = await _req.json(); //parse _req
    const id = parseId(_ctx.params.id);
    if (id === null) {
      return NextResponse.json({ error: 'Visit not found' }, { status: 404 });
    }
    
    const error = validateVisit(body); //check for errors
        if (error) {
          return NextResponse.json({ error }, { status: 400 });
        }

    const { restaurantId, date, amountSpent, notes} = body; //pull out the attributes
    const { rows } = await pool.query(
      `UPDATE visits SET "restaurantId" = $1, date = $2, "amountSpent" = $3, notes = $4 
      WHERE id = $5 RETURNING *`,
      [restaurantId, date, amountSpent, notes, id]
    );

    if (rows.length === 0) {
      return NextResponse.json({ error: 'Visit not found' }, { status: 404 });
    }

    return NextResponse.json(toVisit(rows[0]));
  
  } catch (err) {
    return handleError(err);
  }
}

/**
 * DELETE /api/visits/:id
 * Delete a visit.
 */
export async function DELETE(_req: Request, _ctx: Params) {
  try {
    const id = parseId(_ctx.params.id);
    if (id === null) {
      return NextResponse.json({ error: 'Visit not found' }, { status: 404 });
    }

    const { rows } = await pool.query(
      `DELETE FROM visits WHERE id = $1 RETURNING *`,
      [id]
    );

    if (rows.length === 0) {
      return NextResponse.json({ error: 'Visit not found' }, { status: 404 });
    }

    return new NextResponse(null, { status: 204 });
  
  } catch (err) {
    return handleError(err);
  }
}

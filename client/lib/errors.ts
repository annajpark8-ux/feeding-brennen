import { NextResponse } from 'next/server';

export function handleError(err: unknown): NextResponse {
  console.error('API error:', err); 

  if (err instanceof SyntaxError) {
    return NextResponse.json({ error: 'Malformed body'}, { status: 400 });
  }

  if (typeof err === 'object' && err !== null && 'code' in err) {
    const code = (err as { code: unknown }).code;

    switch (code) {
      case '23503':   // foreign key violation
        return NextResponse.json({ error: 'No such restaurant exists' }, { status: 409 });
    }
  }

  return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
}
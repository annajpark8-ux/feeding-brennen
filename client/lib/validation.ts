export function validateRestaurant(body: unknown): string | null {

    if (typeof body !== 'object' || body === null || Array.isArray(body)) {
        return "Invalid Body";         
    }

    const { name, cuisine, address, rating } = body as Record<string, unknown>;

    //name
    if (name === undefined || name === null) {
        return "Missing Name"; 
    } else if (typeof name !== 'string') {
        return "Invalid Name"; 
    } else if (name.trim() === "") {
        return "Missing Name"; 
    }

    //cuisine
    if (cuisine !== undefined && cuisine !== null && typeof cuisine !== 'string') {
        return "Invalid Cuisine";
    }

    //address
    if (address !== undefined && address !== null && typeof address !== 'string') {
        return "Invalid Address";
    }

    //rating
    if (rating !== undefined && rating !== null) {
        if (typeof rating !== 'number' || !Number.isFinite(rating)) {
            return "Invalid Rating";
        } else if (rating < 0 || rating > 5) {
            return "Rating out of range of 0-5";
        }
    }

    return null;
}

export function parseId(raw: string): number | null {
  const id = Number(raw);
  if (!Number.isInteger(id) || !(id > 0)) {
    return null;
  }
  return id;
}

export function validateVisit(body: unknown): string | null {

    if (typeof body !== 'object' || body === null || Array.isArray(body)) {
        return "Invalid Body";         
    }

    const { restaurantId, date, amountSpent, notes } = body as Record<string, unknown>;

    //restaurantId
    if (restaurantId === undefined || restaurantId === null) {
        return "Missing Restaurant Id"; 
    } else if (typeof restaurantId !== 'number') {
        return "Invalid Restaurant Id"; 
    } else if (!Number.isInteger(restaurantId) || restaurantId <= 0) {
        return "Invalid Restaurant Id";
    }

    //date
    if (date === undefined || date === null) {
        return "Missing Date"; 
    } else if (typeof date !== 'string') {
        return "Invalid Date";
    } else if (date.trim() === "") {
        return "Missing Date"; 
    } else if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
        return "Date must be YYYY-MM-DD";
    }

    //amountSpent
    if (amountSpent !== undefined && amountSpent !== null) {
        if (typeof amountSpent !== 'number' || !Number.isFinite(amountSpent)) {
            return "Invalid Amount";
        } else if (amountSpent < 0) {
            return "Invalid Amount";
        }
    }

    //notes
    if (notes !== undefined && notes !== null && typeof notes !== 'string') {
        return "Invalid Notes";
    }

    return null;
}
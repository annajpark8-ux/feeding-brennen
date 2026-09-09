import { getRestaurants, getVisits } from '@/lib/apiClient';
import RestaurantForm from './components/restaurant_form';
import Link from 'next/link';

// Server component. Fetches restaurants on each request and renders a plain
// list. There is no loading state, no empty state, and no error handling: if
// the API is down or returns something unexpected, this throws.
export default async function HomePage() {
  const restaurants = await getRestaurants();
  const visits = await getVisits();
  
  const amounts = visits.map((v) => v.amountSpent).filter((a): a is number => a !== null);
  const total = amounts.reduce((sum, a) => sum + a, 0);
  const average = amounts.length > 0 ? total / amounts.length : null;

  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - 7);
  const cutoffStr = cutoff.toISOString().slice(0, 10);
  const recent = visits.filter((v) => v.date >= cutoffStr);

  const recentAmounts = recent.map((v) => v.amountSpent).filter((a): a is number => a !== null);
  const recentTotal = recentAmounts.reduce((sum, a) => sum + a, 0);

  return (
    <div>
      <div className="flex gap-8 rounded-lg border border-gray-200 bg-white p-4">
        <div>
          <div className="text-2xl font-medium">
              {average === null ? '—' : `$${average.toFixed(2)}`}
          </div>
          <div className="text-xs uppercase tracking-wide text-gray-500">
              Avg per visit
          </div>
        </div>

        <div>
            <div className="text-2xl font-medium">${total.toFixed(2)}</div>
            <div className="text-xs uppercase tracking-wide text-gray-500">
                Total spent
            </div>
        </div>

        <div>
          <div className="text-2xl font-medium">${recentTotal.toFixed(2)}</div>
          <div className="text-xs uppercase tracking-wide text-gray-500">
              Last 7 Days
          </div>
        </div>
      </div>

      <h2 className="mb-4 mt-8 text-lg font-medium">Restaurants</h2>
      <ul className="space-y-3">
        {restaurants.map((restaurant) => (
          <li
            key={restaurant.id}
            className="rounded-lg border border-gray-200 bg-white p-4 hover:border-gray-400"
          >
            <Link href={`/restaurants/${restaurant.id}`} className="block">
              <div className="flex items-baseline justify-between">
                <span className="font-medium">{restaurant.name}</span>
                <span className="text-sm text-gray-500">
                  {restaurant.rating}★
                </span>
              </div>
              <div className="mt-1 text-sm text-gray-600">
                {restaurant.cuisine} · {restaurant.address}
              </div>
            </Link>
          </li>
        ))}
      </ul>
      <h2 className="mb-4 mt-8 text-lg font-medium">Add Restaurant</h2>
      <RestaurantForm />
    </div>
  );
}


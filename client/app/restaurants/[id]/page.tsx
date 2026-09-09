import { getRestaurant, getRestaurantVisits } from '@/lib/apiClient';
import VisitForm from '@/app/components/visit_form';
import Link from 'next/link';

export default async function RestaurantPage({ params }: { params: { id: string } }) {
    const restaurant = await getRestaurant(params.id);
    const visits = await getRestaurantVisits(params.id);

    const amounts = visits.map((v) => v.amountSpent).filter((a): a is number => a !== null);
    const total = amounts.reduce((sum, a) => sum + a, 0);
    const average = amounts.length > 0 ? total / amounts.length : null;

    return (
        <div className="space-y-8">
            <Link href="/" className="text-sm text-gray-500 hover:text-gray-700">
            &lt;- All Restaurants
            </Link>
            <div>
                <div className="flex items-baseline justify-between">
                    <h2 className="text-2xl font-medium">{restaurant.name}</h2>
                    <span className="text-sm text-gray-500">{restaurant.rating}★</span>
                </div>
                <p className="mt-1 text-sm text-gray-600">
                    {restaurant.cuisine} · {restaurant.address}
                </p>
            </div>

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
                    <div className="text-2xl font-medium">{visits.length}</div>
                    <div className="text-xs uppercase tracking-wide text-gray-500">
                        Visits
                    </div>
                </div>
            </div>

            <div>
                <h3 className="mb-4 text-lg font-medium">Visits</h3>
                {visits.length === 0 ? (
                    <p className="text-sm text-gray-500">No visits yet.</p>
                ) : (
                    <ul className="space-y-3">
                        {visits.map((visit) => (
                            <li key={visit.id}
                                className="rounded-lg border border-gray-200 bg-white p-4"
                            >
                                <div className="flex items-baseline justify-between">
                                    <span className="font-medium">{visit.date}</span>
                                    <span className="text-sm text-gray-600">
                                        {visit.amountSpent === null ? '—' : `$${visit.amountSpent.toFixed(2)}`}
                                    </span>
                                </div>
                                {visit.notes && (
                                    <p className="mt-1 text-sm text-gray-600">{visit.notes}</p>
                                )}
                            </li>
                        ))}
                    </ul>
                )}
            </div>
            
            <div>
                <h2 className="mb-4 mt-8 text-lg font-medium">Add Visit</h2>
                    <VisitForm restaurantId={restaurant.id} />
            </div>

        </div>
  );
}
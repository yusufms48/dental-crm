import { useState } from "react";
import { PRICE_LIST } from "../../utils/priceList";

export default function PriceList() {
  const [search, setSearch] = useState("");

  const filtered = PRICE_LIST.map((category) => ({
    ...category,
    services: category.services.filter((s) =>
      s.name.toLowerCase().includes(search.toLowerCase()),
    ),
  })).filter((category) => category.services.length > 0);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Прайс-лист</h1>
      </div>

      <div className="mb-6">
        <input
          type="text"
          placeholder="Поиск по услуге..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
        />
      </div>

      {filtered.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm p-8 text-center text-gray-400">
          Услуги не найдены
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((category) => (
            <div
              key={category.category}
              className="bg-white rounded-xl shadow-sm overflow-hidden"
            >
              <div className="bg-slate-600 px-5 py-3">
                <h2 className="text-white font-semibold">
                  {category.category}
                </h2>
              </div>
              <div className="divide-y divide-gray-100">
                {category.services.map((service) => (
                  <div
                    key={service.name}
                    className="flex items-center justify-between px-5 py-3"
                  >
                    <p className="text-sm text-gray-700">
                      {service.name}
                      {service.note && (
                        <span className="ml-1 text-xs text-gray-400">
                          ({service.note})
                        </span>
                      )}
                    </p>
                    <p className="text-sm font-semibold text-blue-400">
                      {service.price} AZN
                    </p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

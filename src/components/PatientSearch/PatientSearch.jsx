import { useState } from "react";

export default function PatientSearch({ patients, value, onChange }) {
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  const selected = patients.find((p) => p.id === value);

  const filtered = patients.filter((p) =>
    p.name.toLowerCase().includes(query.toLowerCase()),
  );

  const handleSelect = (patient) => {
    onChange(patient.id);
    setQuery("");
    setIsOpen(false);
  };

  const handleClear = () => {
    onChange("");
    setQuery("");
    setIsOpen(false);
  };

  return (
    <div className="relative">
      {selected ? (
        <div className="flex items-center justify-between px-3 py-2 border border-gray-300 rounded-lg bg-gray-50">
          <span className="text-sm text-gray-800">{selected.name}</span>
          <button
            type="button"
            onClick={handleClear}
            className="text-gray-400 hover:text-gray-600 text-lg leading-none"
          >
            &times;
          </button>
        </div>
      ) : (
        <input
          type="text"
          placeholder="Введите имя пациента..."
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          onBlur={() => setTimeout(() => setIsOpen(false), 150)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      )}

      {isOpen && !selected && (
        <ul className="absolute z-10 w-full bg-white border border-gray-200 rounded-lg shadow-lg mt-1 max-h-48 overflow-y-auto">
          {filtered.length === 0 ? (
            <li className="px-4 py-2 text-sm text-gray-400">
              Пациенты не найдены
            </li>
          ) : (
            filtered.map((patient) => (
              <li
                key={patient.id}
                onMouseDown={() => handleSelect(patient)}
                className="px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 cursor-pointer"
              >
                {patient.name}
              </li>
            ))
          )}
        </ul>
      )}
    </div>
  );
}

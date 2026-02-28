export default function CompanyProducts() {
  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
          Sales Bills
        </h2>
        <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">
          + Add Sales Bill
        </button>
      </div>

      {/* Your product table would go here */}
      <div className="bg-white dark:bg-[#1a1a1a] border border-gray-200 dark:border-gray-800 rounded-xl p-8 text-center text-gray-500">
        Sales Bill list will appear here.
      </div>
    </div>
  );
}

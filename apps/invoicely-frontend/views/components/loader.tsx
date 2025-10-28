export default function ScreenLoader() {
  return (
    <div className="flex items-center justify-center w-full h-screen bg-gray-50 dark:bg-gray-900">
      <div className="flex flex-col items-center space-y-4">
        <div className="w-16 h-16 border-4 dark:border-b-secondary-dark border-t-transparent rounded-full animate-spin"></div>
        <p className="text-gray-700 dark:text-gray-300 font-medium text-lg">
          Loading your dashboard…
        </p>
      </div>
    </div>
  );
}

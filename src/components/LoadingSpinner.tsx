export function LoadingSpinner() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-6 sm:p-8">
      <div className="h-16 w-16 rounded-full border-8 border-gray-300 border-t-gray-500 animate-spin sm:h-24 sm:w-24"></div>
      <p className="mt-4 text-base font-medium text-gray-600 sm:mt-6 sm:text-lg">Indl\u00e6ser...</p>
    </div>
  );
}

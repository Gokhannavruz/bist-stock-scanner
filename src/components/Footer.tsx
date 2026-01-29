export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-200 mt-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col sm:flex-row items-center justify-between space-y-2 sm:space-y-0">
          <p className="text-sm text-gray-500">
            Powered by <span className="font-semibold text-gray-700">BIST Swing Scanner</span>
          </p>
          <p className="text-xs text-gray-400">
            v1.0 - For educational purposes only
          </p>
        </div>
      </div>
    </footer>
  );
}

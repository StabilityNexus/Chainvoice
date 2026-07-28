
import ProductCatalogImport from "../components/ProductCatalogImport";

function Settings() {
  return (
    <div className="w-full max-w-7xl mx-auto px-2 sm:px-4 md:px-6 py-6">
      <div className="mb-6 sm:mb-8">
        <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2">
          Settings
        </h2>
        <p className="text-sm sm:text-base text-gray-300">
          Manage your account settings and product catalog
        </p>
      </div>

      <div className="space-y-6 sm:space-y-8">
        {/* Product Catalog Section */}
        <section>
          <div className="mb-4">
            <h3 className="text-xl font-semibold text-white">Product Catalog</h3>
            <p className="text-sm text-gray-400">
              Manage your products for quick access when creating invoices.
            </p>
          </div>
          <ProductCatalogImport />
        </section>
      </div>
    </div>
  );
}

export default Settings;

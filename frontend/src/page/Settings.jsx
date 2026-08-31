import InvoiceBackupSettings from "../components/InvoiceBackupSettings";
import ProductCatalogImport from "../components/ProductCatalogImport";
import UserProfileSettings from "../components/UserProfileSettings";

const SETTINGS_SECTIONS = [
  {
    id: "your-information",
    title: "Your Information",
    description:
      "The sender details applied to every invoice you create. Saved on this device only.",
    Content: UserProfileSettings,
  },
  {
    id: "product-catalog",
    title: "Product Catalog",
    description:
      "Manage your products for quick access when creating invoices.",
    Content: ProductCatalogImport,
  },
  {
    id: "invoice-backup",
    title: "Invoice Backup",
    description:
      "Export your locally stored invoices or restore them from a backup file.",
    Content: InvoiceBackupSettings,
  },
];

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
        {SETTINGS_SECTIONS.map(({ id, title, description, Content }) => (
          <section key={id} id={id} className="scroll-mt-24">
            <div className="mb-4">
              <h3 className="text-xl font-semibold text-white">{title}</h3>
              <p className="text-sm text-gray-400">{description}</p>
            </div>
            <Content />
          </section>
        ))}
      </div>
    </div>
  );
}

export default Settings;

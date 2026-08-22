import ProductCatalogImport from "../components/ProductCatalogImport";
import UserProfileSettings from "../components/UserProfileSettings";
import { PAGE_CONTAINER, PAGE_HEADER } from "@/utils/layout";
import { cn } from "@/lib/utils";

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
];

function Settings() {
  return (
    <div className={cn(PAGE_CONTAINER, "py-3 sm:py-4")}>
      <div className={PAGE_HEADER}>
        <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2">
          Settings
        </h2>
        <p className="text-sm sm:text-base text-gray-300">
          Manage your account settings and product catalog
        </p>
      </div>

      <div className="space-y-4 sm:space-y-6">
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

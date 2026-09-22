import ProductCatalogImport from "../components/ProductCatalogImport";
import UserProfileSettings from "../components/UserProfileSettings";
import { PAGE_CONTAINER, PAGE_HEADER } from "@/utils/layout";
import { cn } from "@/lib/utils";

/**
 * Each card carries its own heading, so the page does not repeat the same
 * title immediately above the card that already states it.
 */
const SETTINGS_SECTIONS = [
  { id: "your-information", Content: UserProfileSettings },
  { id: "product-catalog", Content: ProductCatalogImport },
];

function Settings() {
  return (
    <div className={cn(PAGE_CONTAINER, "py-3 sm:py-4")}>
      <div className={PAGE_HEADER}>
        <h2 className="text-2xl sm:text-3xl font-bold text-white mb-1">
          Settings
        </h2>
        <p className="text-sm sm:text-base text-gray-300">
          Manage your sender details and product catalog
        </p>
      </div>

      <div className="space-y-4 sm:space-y-6">
        {SETTINGS_SECTIONS.map(({ id, Content }) => (
          <section key={id} id={id} className="scroll-mt-24">
            <Content />
          </section>
        ))}
      </div>
    </div>
  );
}

export default Settings;

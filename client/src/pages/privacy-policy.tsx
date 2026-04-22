import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <SiteHeader />
      <main className="flex-1">
        <section className="py-16 px-4">
          <div className="max-w-2xl mx-auto">
            <h1 className="text-3xl font-bold mb-8">Privacy Policy</h1>

            <div className="space-y-6 text-muted-foreground">
              <div>
                <h2 className="text-lg font-semibold text-foreground mb-2">Information We Collect</h2>
                <p>
                  We collect information you provide directly, including your name, email address,
                  phone number, business information, and Federal Firearms License (FFL) details
                  when you submit a dealer application or order.
                </p>
              </div>

              <div>
                <h2 className="text-lg font-semibold text-foreground mb-2">How We Use Your Information</h2>
                <p>
                  We use your information to process orders, communicate about your account,
                  comply with federal firearms regulations, and improve our products and services.
                  We do not sell your personal information to third parties.
                </p>
              </div>

              <div>
                <h2 className="text-lg font-semibold text-foreground mb-2">FFL and SOT Information</h2>
                <p>
                  As a federal firearms licensee, we are required to retain certain records,
                  including FFL and SOT information, in accordance with ATF regulations.
                  These records are kept confidential and are only used for compliance purposes.
                </p>
              </div>

              <div>
                <h2 className="text-lg font-semibold text-foreground mb-2">Information Sharing</h2>
                <p>
                  We may share your information with payment processors, shipping carriers,
                  and legal authorities when required by law. We do not share your personal
                  information with unrelated third parties for marketing purposes.
                </p>
              </div>

              <div>
                <h2 className="text-lg font-semibold text-foreground mb-2">Data Security</h2>
                <p>
                  We implement reasonable security measures to protect your personal information
                  from unauthorized access, disclosure, or destruction.
                </p>
              </div>

              <div>
                <h2 className="text-lg font-semibold text-foreground mb-2">Contact Us</h2>
                <p>
                  If you have questions about this Privacy Policy, please contact us at{" "}
                  <a href="mailto:privacy@dubdub22.com" className="text-primary hover:underline">
                    privacy@dubdub22.com
                  </a>
                  .
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}

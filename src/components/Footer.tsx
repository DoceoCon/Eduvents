import Link from "next/link";

const Footer = () => {
  return (
    <footer className="border-t border-border bg-card mt-auto">
      <div className="container-tight py-8">
        <div className="flex flex-col gap-6">
          {/* Top Section - Logo and Navigation */}
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center">
              <img
                src="/logo.png"
                alt="EDUVENTS"
                className="h-41 w-auto object-contain"
              />
            </div>

            <nav className="flex items-center space-x-6 text-sm">
              <Link
                href="/privacy-policy"
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                Privacy Policy
              </Link>
              <span className="text-muted-foreground">•</span>
              <Link
                href="/terms-of-use"
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                Terms of Use
              </Link>
              <span className="text-muted-foreground">•</span>
              <Link
                href="/terms-and-conditions"
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                Terms & Conditions
              </Link>
            </nav>
          </div>

          {/* Bottom Section - Company Information */}
          <div className="text-center space-y-2 border-t border-border pt-4">
            <p className="text-sm text-muted-foreground">
              Eduvents is a subsidiary of Doceo Consulting Ltd, registered in
              England (Company No 12962009)
            </p>
            <p className="text-sm text-muted-foreground">
              VAT number: 432467596 | Registered office: 36 Rathmore Road SE7
              7QW
            </p>
            <p className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} EDUVENTS. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

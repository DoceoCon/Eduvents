import Link from 'next/link';

const Footer = () => {
  return (
    <footer className="border-t border-border bg-card mt-auto">
      <div className="container-tight py-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center space-x-2">
            <span className="text-xl font-bold text-gradient">EDUVENTS</span>
          </div>

          <nav className="flex items-center space-x-6 text-sm">
            <Link href="/" className="text-muted-foreground hover:text-primary transition-colors">
              Home
            </Link>
            <Link href="/events" className="text-muted-foreground hover:text-primary transition-colors">
              Find Events
            </Link>
            <Link href="/list-event" className="text-muted-foreground hover:text-primary transition-colors">
              List Your Event
            </Link>
          </nav>

          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} EDUVENTS. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

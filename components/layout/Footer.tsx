import Link from 'next/link';
import { GraduationCap, Github, Linkedin, Mail, Phone, User } from 'lucide-react';

export function Footer() {
  return (
    <footer className="w-full border-t border-border bg-muted/30 pt-16 pb-8 transition-colors duration-300">
      <div className="mx-auto w-full px-4 sm:px-8 lg:px-12">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
          {/* Logo & Pitch */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center space-x-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-primary to-indigo-400 text-white shadow-md shadow-primary/20">
                <GraduationCap className="h-5 w-5" />
              </div>
              <span className="text-lg font-bold tracking-tight text-foreground">
                UniScope
              </span>
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed max-w-xs">
              Empowering students to search, compare, and predict their path to India's top colleges. Make informed academic decisions with validated placement records.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-sm font-semibold text-foreground uppercase tracking-wider mb-4">
              Explore Platform
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/colleges" className="text-muted-foreground hover:text-foreground transition-colors">
                  All Colleges Listing
                </Link>
              </li>
              <li>
                <Link href="/compare" className="text-muted-foreground hover:text-foreground transition-colors">
                  College Comparison Tool
                </Link>
              </li>
              <li>
                <Link href="/predictor" className="text-muted-foreground hover:text-foreground transition-colors">
                  Rank & Cutoff Predictor
                </Link>
              </li>
              <li>
                <Link href="/login" className="text-muted-foreground hover:text-foreground transition-colors">
                  Student Sign In
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="text-sm font-semibold text-foreground uppercase tracking-wider mb-4">
              Top Categories
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/colleges?courseType=cse" className="text-muted-foreground hover:text-foreground transition-colors">
                  Engineering Colleges (IITs/NITs)
                </Link>
              </li>
              <li>
                <Link href="/colleges?courseType=pgp" className="text-muted-foreground hover:text-foreground transition-colors">
                  Management Institutes (IIMs)
                </Link>
              </li>
              <li>
                <Link href="/colleges?courseType=mbbs" className="text-muted-foreground hover:text-foreground transition-colors">
                  Medical Colleges (AIIMS)
                </Link>
              </li>
              <li>
                <Link href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                  Placement Statistics 2026
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-sm font-semibold text-foreground uppercase tracking-wider mb-4">
              Get in Touch
            </h3>
            <ul className="space-y-3 text-sm text-muted-foreground mb-4">
              <li className="flex items-center space-x-3">
                <User className="h-4 w-4 text-primary shrink-0" />
                <span className="font-medium text-foreground">Sneha Chandravanshi</span>
              </li>
              <li className="flex items-center space-x-3">
                <Phone className="h-4 w-4 text-primary shrink-0" />
                <a href="tel:+917724905769" className="hover:text-foreground transition-colors">+91 7724905769</a>
              </li>
              <li className="flex items-center space-x-3">
                <Mail className="h-4 w-4 text-primary shrink-0" />
                <a href="mailto:chandravanshisneha102@gmail.com" className="hover:text-foreground transition-colors">chandravanshisneha102@gmail.com</a>
              </li>
            </ul>
            <div className="flex space-x-4 pt-2">
              <a 
                href="https://www.linkedin.com/in/sneha-chandravanshi-374082252/" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-muted-foreground hover:text-primary transition-all duration-300 hover:scale-110"
                title="LinkedIn"
              >
                <Linkedin className="h-5 w-5" />
              </a>
              <a 
                href="https://github.com/SnehaChandravanshi" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-muted-foreground hover:text-primary transition-all duration-300 hover:scale-110"
                title="GitHub"
              >
                <Github className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-border/60 flex flex-col md:flex-row items-center justify-between text-xs text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} UniScope Platform. All rights reserved.</p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <Link href="#" className="hover:text-foreground transition-colors">Privacy Policy</Link>
            <Link href="#" className="hover:text-foreground transition-colors">Terms of Service</Link>
            <Link href="#" className="hover:text-foreground transition-colors">Sitemap</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
export default Footer;

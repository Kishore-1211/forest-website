import { Logo } from "@/components/common/Logo";
import { Container } from "@/components/layout/Container";

const FOOTER_LINKS = ["About", "Contact", "Privacy"];

export function Footer() {
  return (
    <footer className="bg-charcoal py-16 text-fog-gray">
      <Container>
        <div className="flex flex-col items-start gap-8 sm:flex-row sm:items-center sm:justify-between">
          <Logo className="text-soft-white" />
          <nav aria-label="Footer">
            <ul className="flex gap-6">
              {FOOTER_LINKS.map((link) => (
                <li key={link}>
                  <a
                    href="#"
                    className="text-sm font-normal transition-colors duration-[250ms] hover:text-soft-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-warm-gold"
                  >
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </div>
        <p className="mt-8 text-sm font-normal">
          &copy; {new Date().getFullYear()} Forest. All rights reserved.
        </p>
      </Container>
    </footer>
  );
}

import Link from 'next/link'

const LINKS = {
  'Produit': [
    { label: 'Comment ça marche', href: '#how' },
    { label: 'Tarifs', href: '#pricing' },
    { label: 'Intégrations', href: '#' },
    { label: 'Changelog', href: '#' },
  ],
  'Légal': [
    { label: 'Conditions générales', href: '#' },
    { label: 'Politique de confidentialité', href: '#' },
    { label: 'Mentions légales', href: '#' },
  ],
  'Ressources': [
    { label: 'Blog', href: '#' },
    { label: 'FAQ', href: '#faq' },
    { label: 'Contact', href: 'mailto:hello@dunly.io' },
  ],
}

export default function Footer() {
  return (
    <footer className="border-t border-[#1A1A1A] py-16">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-12 mb-16">
          {/* Logo + description */}
          <div className="col-span-2">
            <div className="font-display font-bold text-2xl mb-4">
              DUNL<span className="text-[#00FF87]">Y</span>
            </div>
            <p className="text-[#888] text-sm leading-relaxed max-w-xs">
              Relance automatique des factures impayées. Conçu pour les freelances, PME et experts-comptables.
            </p>
            <div className="flex items-center gap-4 mt-6">
              {['X', 'in', 'yt'].map((social, i) => (
                <a
                  key={i}
                  href="#"
                  className="w-8 h-8 rounded-lg bg-[#1A1A1A] flex items-center justify-center text-xs text-[#888] hover:bg-[rgba(0,255,135,0.1)] hover:text-[#00FF87] transition-all duration-200"
                >
                  {social}
                </a>
              ))}
            </div>
          </div>

          {/* Liens */}
          {Object.entries(LINKS).map(([category, items]) => (
            <div key={category}>
              <h4 className="font-medium text-white text-sm mb-4">{category}</h4>
              <ul className="space-y-3">
                {items.map(item => (
                  <li key={item.label}>
                    <Link
                      href={item.href}
                      className="text-sm text-[#888] hover:text-white transition-colors relative group"
                    >
                      {item.label}
                      <span className="absolute -bottom-0.5 left-0 w-0 h-px bg-[#00FF87] group-hover:w-full transition-all duration-300" />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="border-t border-[#1A1A1A] pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-[#888]">
            © 2025 Dunly SAS. Tous droits réservés.
          </p>
          <p className="text-xs text-[#888]">
            Fait avec <span className="text-[#00FF87]">♥</span> pour les entrepreneurs français
          </p>
        </div>
      </div>
    </footer>
  )
}

'use client'

import { useRef, useState } from 'react'
import { motion, useInView, AnimatePresence } from 'framer-motion'
import { Plus, Minus } from 'lucide-react'

const FAQS = [
  {
    q: 'Comment Dunly sait à qui envoyer les relances ?',
    a: 'Dunly analyse automatiquement tes factures — numéro, montant, date d\'échéance, client. Il suffit de connecter ton logiciel ou d\'importer un CSV. Dunly identifie les impayés et programme les relances sans aucune action de ta part.',
  },
  {
    q: 'Mes clients vont-ils savoir que c\'est automatisé ?',
    a: 'Non. Les emails sont envoyés depuis ton adresse email habituelle, avec ton nom et ta signature. Le contenu est personnalisé et naturel — tes clients croiront que tu les as écrits toi-même.',
  },
  {
    q: 'Que se passe-t-il si mon client ne répond toujours pas après 3 relances ?',
    a: 'Dunly te notifie et marque la facture comme "bloquée". À toi de décider : lettre recommandée, mise en demeure, recouvrement externe. On te fourni un récapitulatif complet de toutes les relances pour faciliter les démarches.',
  },
  {
    q: 'Quels logiciels de facturation sont compatibles ?',
    a: 'Dunly s\'intègre nativement avec Pennylane et QuickBooks. Pour les autres logiciels, l\'import CSV universel permet d\'utiliser Dunly avec n\'importe quelle solution. De nouvelles intégrations sont ajoutées régulièrement.',
  },
  {
    q: 'Puis-je personnaliser les templates d\'emails ?',
    a: 'Oui, entièrement. Tu peux modifier les modèles par défaut ou en créer de nouveaux depuis zéro. Tu choisis le ton (bienveillant, ferme, urgent), le délai d\'envoi, et le contenu exact de chaque relance.',
  },
]

function FAQItem({ item, index }: { item: typeof FAQS[0]; index: number }) {
  const [open, setOpen] = useState(false)

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1 }}
      className="border-b border-[#1A1A1A] last:border-0"
    >
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between py-6 text-left group"
      >
        <span className="text-white font-medium pr-8 group-hover:text-[#00FF87] transition-colors">
          {item.q}
        </span>
        <div className="flex-shrink-0 w-6 h-6 rounded-full border border-[#1A1A1A] flex items-center justify-center group-hover:border-[#00FF87] transition-colors">
          {open ? (
            <Minus size={12} className="text-[#00FF87]" />
          ) : (
            <Plus size={12} className="text-[#888]" />
          )}
        </div>
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.23, 1, 0.32, 1] }}
            className="overflow-hidden"
          >
            <p className="text-[#888] pb-6 leading-relaxed">{item.a}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

export default function FAQ() {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-100px' })

  return (
    <section id="faq" ref={ref} className="py-32">
      <div className="max-w-3xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          className="text-center mb-16"
        >
          <span className="text-sm text-[#888] uppercase tracking-widest">FAQ</span>
          <h2 className="font-display font-bold text-[clamp(2rem,5vw,4rem)] mt-4 leading-tight">
            Questions <span className="text-[#00FF87]">fréquentes</span>
          </h2>
        </motion.div>

        <div className="glass rounded-3xl border border-[#1A1A1A] px-8">
          {FAQS.map((item, i) => (
            <FAQItem key={i} item={item} index={i} />
          ))}
        </div>
      </div>
    </section>
  )
}

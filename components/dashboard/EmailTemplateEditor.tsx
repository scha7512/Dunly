'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Sparkles, PenLine, Eye, Copy, Check, Info, Loader2, ChevronDown, ChevronUp } from 'lucide-react'
import toast from 'react-hot-toast'

const VARIABLES = [
  { key: '[prenom]', label: 'Prénom client', example: 'Jean' },
  { key: '[nom]', label: 'Nom client', example: 'Dupont' },
  { key: '[entreprise_client]', label: 'Entreprise client', example: 'Acme Corp' },
  { key: '[numero_facture]', label: 'N° facture', example: 'FAC-2025-001' },
  { key: '[montant]', label: 'Montant dû', example: '1 500,00 €' },
  { key: '[date_echeance]', label: 'Date échéance', example: '01/03/2025' },
  { key: '[jours_retard]', label: 'Jours de retard', example: '30' },
  { key: '[mon_entreprise]', label: 'Mon entreprise', example: 'Ma Société' },
  { key: '[mon_prenom]', label: 'Mon prénom', example: 'Marie' },
  { key: '[mon_email]', label: 'Mon email', example: 'marie@masociete.fr' },
  { key: '[mon_telephone]', label: 'Mon téléphone', example: '06 12 34 56 78' },
]

const TEMPLATE_TYPES = [
  { key: 'douce', label: 'Relance douce', color: '#00FF87', delay: 'J+30' },
  { key: 'ferme', label: 'Relance ferme', color: '#FFB800', delay: 'J+45' },
  { key: 'urgente', label: 'Relance urgente', color: '#FF4444', delay: 'J+60' },
]

const DEFAULT_TEMPLATES: Record<string, string> = {
  douce: `Objet : Rappel facture [numero_facture] — [montant]

Bonjour [prenom],

J'espère que vous allez bien. Je me permets de vous contacter au sujet de la facture [numero_facture] d'un montant de [montant], dont l'échéance était le [date_echeance].

Il est possible que ce règlement vous ait échappé. Pourriez-vous procéder au virement dans les meilleurs délais ?

N'hésitez pas à me contacter si vous avez la moindre question.

Bien cordialement,
[mon_prenom] — [mon_entreprise]
[mon_email] · [mon_telephone]`,

  ferme: `Objet : Relance — Facture [numero_facture] en attente de règlement

Bonjour [prenom],

Malgré mon précédent message, la facture [numero_facture] de [montant] reste impayée depuis [jours_retard] jours (échéance : [date_echeance]).

Je vous demande de bien vouloir régulariser cette situation dans un délai de 7 jours.

Sans retour de votre part, je serai contraint(e) de prendre des mesures supplémentaires.

Cordialement,
[mon_prenom] — [mon_entreprise]
[mon_email] · [mon_telephone]`,

  urgente: `Objet : ⚠️ URGENT — Facture [numero_facture] impayée depuis [jours_retard] jours

Bonjour [prenom],

La facture [numero_facture] de [montant] est toujours impayée malgré mes relances précédentes. L'échéance était le [date_echeance], soit [jours_retard] jours de retard.

Sans règlement sous 48h, je serai dans l'obligation de transmettre ce dossier à mon service contentieux.

[mon_prenom] — [mon_entreprise]
[mon_email]`,
}

function previewTemplate(text: string): string {
  return text
    .replace(/\[prenom\]/g, 'Jean')
    .replace(/\[nom\]/g, 'Dupont')
    .replace(/\[entreprise_client\]/g, 'Acme Corp')
    .replace(/\[numero_facture\]/g, 'FAC-2025-001')
    .replace(/\[montant\]/g, '1 500,00 €')
    .replace(/\[date_echeance\]/g, '01/03/2025')
    .replace(/\[jours_retard\]/g, '30')
    .replace(/\[mon_entreprise\]/g, 'Ma Société')
    .replace(/\[mon_prenom\]/g, 'Marie')
    .replace(/\[mon_email\]/g, 'marie@masociete.fr')
    .replace(/\[mon_telephone\]/g, '06 12 34 56 78')
}

export default function EmailTemplateEditor() {
  const [selectedType, setSelectedType] = useState('douce')
  const [mode, setMode] = useState<'manuel' | 'ia'>('manuel')
  const [templates, setTemplates] = useState(DEFAULT_TEMPLATES)
  const [preview, setPreview] = useState(false)
  const [showTuto, setShowTuto] = useState(false)
  const [aiContext, setAiContext] = useState('')
  const [aiLoading, setAiLoading] = useState(false)
  const [saved, setSaved] = useState(false)

  const currentTemplate = templates[selectedType] || ''

  const insertVariable = (variable: string) => {
    const textarea = document.getElementById('template-editor') as HTMLTextAreaElement
    if (!textarea) return
    const start = textarea.selectionStart
    const end = textarea.selectionEnd
    const newText = currentTemplate.substring(0, start) + variable + currentTemplate.substring(end)
    setTemplates(t => ({ ...t, [selectedType]: newText }))
    setTimeout(() => {
      textarea.focus()
      textarea.setSelectionRange(start + variable.length, start + variable.length)
    }, 0)
  }

  const generateWithAI = async () => {
    setAiLoading(true)
    try {
      const res = await fetch('/api/generate-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: selectedType, context: aiContext }),
      })
      const data = await res.json()
      if (data.email) {
        setTemplates(t => ({ ...t, [selectedType]: data.email }))
        setMode('manuel')
        toast.success('Email généré ! Tu peux le modifier si besoin.')
      }
    } catch {
      toast.error('Erreur lors de la génération')
    } finally {
      setAiLoading(false)
    }
  }

  const handleSave = () => {
    setSaved(true)
    toast.success('Template enregistré !')
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <div className="bg-[#0D0D0D] border border-[#1A1A1A] rounded-2xl overflow-hidden">
      {/* Header */}
      <div className="px-6 py-4 border-b border-[#1A1A1A] flex items-center justify-between">
        <h3 className="font-semibold text-white">Éditeur de templates d&apos;emails</h3>
        <div className="flex items-center gap-2">
          {/* Mode toggle */}
          <div className="flex items-center gap-1 p-1 bg-[#141414] border border-[#1A1A1A] rounded-xl">
            <button
              onClick={() => setMode('manuel')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${mode === 'manuel' ? 'bg-[#1A1A1A] text-white' : 'text-[#555] hover:text-white'}`}
            >
              <PenLine size={12} /> Manuel
            </button>
            <button
              onClick={() => setMode('ia')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${mode === 'ia' ? 'bg-[rgba(0,255,135,0.15)] text-[#00FF87]' : 'text-[#555] hover:text-white'}`}
            >
              <Sparkles size={12} /> IA ✨
            </button>
          </div>
        </div>
      </div>

      {/* Type selector */}
      <div className="flex border-b border-[#1A1A1A]">
        {TEMPLATE_TYPES.map(t => (
          <button
            key={t.key}
            onClick={() => setSelectedType(t.key)}
            className={`flex-1 px-4 py-3 text-xs font-medium transition-all border-b-2 ${
              selectedType === t.key
                ? 'border-current'
                : 'border-transparent text-[#555] hover:text-white'
            }`}
            style={selectedType === t.key ? { color: t.color, borderColor: t.color } : {}}
          >
            {t.label}
            <span className="ml-1.5 text-[10px] opacity-60">{t.delay}</span>
          </button>
        ))}
      </div>

      <div className="p-6 space-y-4">
        {/* MODE IA */}
        <AnimatePresence mode="wait">
          {mode === 'ia' && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="bg-[rgba(0,255,135,0.03)] border border-[rgba(0,255,135,0.15)] rounded-2xl p-5"
            >
              <div className="flex items-center gap-2 mb-3">
                <Sparkles size={16} className="text-[#00FF87]" />
                <span className="text-sm font-semibold text-white">Génération par IA</span>
              </div>
              <p className="text-xs text-[#888] mb-4">
                Décris ton activité et ton style de communication. L&apos;IA génère un email professionnel adapté à ta situation, avec toutes les variables automatiquement intégrées.
              </p>
              <textarea
                value={aiContext}
                onChange={e => setAiContext(e.target.value)}
                placeholder="Ex : Je suis graphiste indépendant, je travaille principalement avec des PME. Mon style est professionnel mais chaleureux. Je veux rester ferme sans être agressif..."
                rows={4}
                className="w-full bg-[#141414] border border-[#1A1A1A] rounded-xl px-4 py-3 text-sm text-white placeholder-[#333] focus:outline-none focus:border-[#00FF87] resize-none"
              />
              <button
                onClick={generateWithAI}
                disabled={aiLoading}
                className="mt-3 w-full flex items-center justify-center gap-2 btn-gradient text-black font-bold py-3 rounded-xl text-sm disabled:opacity-60"
              >
                {aiLoading ? (
                  <><Loader2 size={15} className="animate-spin" /> Génération en cours...</>
                ) : (
                  <><Sparkles size={15} /> Générer l&apos;email avec l&apos;IA</>
                )}
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* MODE MANUEL */}
        {/* Tutoriel */}
        <div className="border border-[#1A1A1A] rounded-xl overflow-hidden">
          <button
            onClick={() => setShowTuto(!showTuto)}
            className="w-full flex items-center justify-between px-4 py-3 text-xs text-[#888] hover:text-white transition-colors"
          >
            <div className="flex items-center gap-2">
              <Info size={13} className="text-[#00FF87]" />
              <span>Comment utiliser les variables ?</span>
            </div>
            {showTuto ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
          </button>
          <AnimatePresence>
            {showTuto && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden"
              >
                <div className="px-4 pb-4 border-t border-[#1A1A1A]">
                  <p className="text-xs text-[#888] mt-3 mb-3 leading-relaxed">
                    Les <span className="text-[#00FF87] font-mono">[variables]</span> sont remplacées automatiquement par les vraies données à l&apos;envoi. Par exemple <span className="font-mono text-[#00FF87]">[prenom]</span> deviendra <span className="text-white">&quot;Jean&quot;</span> si ton client s&apos;appelle Jean.
                  </p>
                  <p className="text-xs text-[#888] mb-3">
                    💡 <strong className="text-white">Astuce :</strong> Clique sur une variable ci-dessous pour l&apos;insérer directement dans ton email à l&apos;endroit de ton curseur.
                  </p>
                  <div className="bg-[#141414] rounded-xl p-3 text-xs font-mono text-[#888] leading-relaxed">
                    <span className="text-[#555]">Bonjour </span>
                    <span className="text-[#00FF87]">[prenom]</span>
                    <span className="text-[#555]">, votre facture </span>
                    <span className="text-[#00FF87]">[numero_facture]</span>
                    <span className="text-[#555]"> de </span>
                    <span className="text-[#00FF87]">[montant]</span>
                    <span className="text-[#555]"> est en retard...</span>
                    <br />
                    <span className="text-[#333 mt-1 block">↓ devient automatiquement ↓</span>
                    <span className="text-white mt-1 block">Bonjour Jean, votre facture FAC-2025-001 de 1 500,00 € est en retard...</span>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Variables chips */}
        <div>
          <p className="text-xs text-[#555] mb-2">Cliquer pour insérer une variable :</p>
          <div className="flex flex-wrap gap-2">
            {VARIABLES.map(v => (
              <button
                key={v.key}
                onClick={() => insertVariable(v.key)}
                title={`Exemple : ${v.example}`}
                className="flex items-center gap-1 px-2.5 py-1 bg-[#141414] border border-[#1A1A1A] rounded-lg text-xs font-mono text-[#00FF87] hover:border-[#00FF87] hover:bg-[rgba(0,255,135,0.05)] transition-all"
              >
                {v.key}
              </button>
            ))}
          </div>
        </div>

        {/* Éditeur / Prévisualisation */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs text-[#555]">{preview ? 'Prévisualisation (données exemple)' : 'Contenu de l\'email'}</p>
            <button
              onClick={() => setPreview(!preview)}
              className="flex items-center gap-1.5 text-xs text-[#888] hover:text-white transition-colors"
            >
              <Eye size={12} />
              {preview ? 'Modifier' : 'Prévisualiser'}
            </button>
          </div>

          {preview ? (
            <div className="bg-[#141414] border border-[#1A1A1A] rounded-xl p-4 min-h-[240px] text-sm text-white whitespace-pre-wrap leading-relaxed font-mono">
              {previewTemplate(currentTemplate)}
            </div>
          ) : (
            <textarea
              id="template-editor"
              value={currentTemplate}
              onChange={e => setTemplates(t => ({ ...t, [selectedType]: e.target.value }))}
              rows={10}
              className="w-full bg-[#141414] border border-[#1A1A1A] rounded-xl px-4 py-3 text-sm text-white font-mono placeholder-[#333] focus:outline-none focus:border-[#00FF87] resize-none leading-relaxed"
              placeholder="Écris ton email ici..."
            />
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between pt-2">
          <button
            onClick={() => {
              setTemplates(t => ({ ...t, [selectedType]: DEFAULT_TEMPLATES[selectedType] }))
              toast.success('Template réinitialisé')
            }}
            className="text-xs text-[#555] hover:text-white transition-colors"
          >
            Réinitialiser par défaut
          </button>
          <div className="flex items-center gap-3">
            <button
              onClick={() => { navigator.clipboard.writeText(currentTemplate); toast.success('Copié !') }}
              className="flex items-center gap-1.5 text-xs text-[#888] hover:text-white transition-colors"
            >
              <Copy size={12} /> Copier
            </button>
            <button
              onClick={handleSave}
              className="flex items-center gap-1.5 btn-gradient text-black text-xs font-bold px-4 py-2 rounded-full"
            >
              {saved ? <><Check size={12} /> Enregistré !</> : 'Enregistrer le template'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

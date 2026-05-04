import { Resend } from 'resend'

// Lazy initialization pour éviter l'erreur au build sans env vars
let _resend: Resend | null = null

export function getResend(): Resend {
  if (!_resend) {
    _resend = new Resend(process.env.RESEND_API_KEY ?? 'placeholder')
  }
  return _resend
}

// Export pour compatibilité directe
export const resend = {
  emails: {
    send: (...args: Parameters<Resend['emails']['send']>) => getResend().emails.send(...args),
  },
}

export const FROM_EMAIL = 'Dunly <noreply@dunly.io>'

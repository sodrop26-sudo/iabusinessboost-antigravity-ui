import './style.css'
import { N8N_WEBHOOK_URL } from './config.js'

const form = document.getElementById('form')
const prenomInput = document.getElementById('prenom')
const nomInput = document.getElementById('nom')
const emailInput = document.getElementById('email')
const statusEl = document.getElementById('status')
const btn = document.getElementById('submit')

form?.addEventListener('submit', async (event) => {
  event.preventDefault()

  const payload = {
    prenom: prenomInput?.value || '',
    nom: nomInput?.value || '',
    email: emailInput?.value || ''
  }

  console.log('Payload:', payload)

  if (!payload.prenom || !payload.nom || !payload.email) {
    statusEl.textContent = 'Merci de remplir tous les champs.'
    return
  }

  btn.disabled = true
  statusEl.textContent = 'Envoi en cours...'

  try {
    const response = await fetch(N8N_WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    })

    console.log('Status:', response.status)

    if (!response.ok) {
      throw new Error('Erreur HTTP ' + response.status)
    }

    statusEl.textContent =
      '✅ Inscription confirmée, bienvenue chez IA Business Boost'

    form.reset()
  } catch (error) {
    console.error(error)
    statusEl.textContent = '❌ Erreur : ' + error.message
  } finally {
    btn.disabled = false
  }
})

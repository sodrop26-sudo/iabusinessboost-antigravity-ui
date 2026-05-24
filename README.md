# IA Business Boost - Antigravity UI

## Description

Projet de mini infrastructure IA auto-hébergée.

Cette interface permet à un utilisateur de s’inscrire via un formulaire connecté à un workflow n8n auto-hébergé sur Google Cloud.

Les données sont envoyées via webhook HTTPS puis enregistrées automatiquement dans Google Sheets.

---

## Stack utilisée

### Frontend
- Antigravity
- Vite
- JavaScript

### Backend
- n8n
- Docker
- Docker Compose
- Traefik Reverse Proxy

### Infrastructure
- Google Cloud Platform (GCP)
- Ubuntu 22.04 LTS
- HTTPS Let's Encrypt

### Base de données / stockage
- PostgreSQL
- Google Sheets

---

## Architecture

Utilisateur → Interface Antigravity → Webhook HTTPS → Traefik → n8n → Google Sheets → Réponse JSON → Interface utilisateur

---

## Fonctionnement

1. L’utilisateur remplit le formulaire :
   - prénom
   - nom
   - email

2. L’interface envoie les données via HTTP POST vers n8n.

3. Le workflow n8n :
   - reçoit les données
   - ajoute une ligne dans Google Sheets
   - renvoie une réponse JSON

4. L’interface affiche :

"Inscription confirmée, bienvenue chez IA Business Boost"

---

## Lancer le projet localement

```bash
npm install
npm run dev
```

---

## URL n8n

```text
https://n8n.iabusinessboost.com
```

---

## Exemple de payload envoyé

```json
{
  "prenom": "John",
  "nom": "Doe",
  "email": "john@example.com"
}
```

---

## Exemple de réponse

```json
{
  "success": true,
  "message": "Inscription confirmée, bienvenue chez IA Business Boost"
}
```

---

## Déploiement infrastructure

Infrastructure hébergée sur Google Cloud avec :
- VM e2-micro
- Docker Compose
- Reverse proxy Traefik
- HTTPS Let's Encrypt


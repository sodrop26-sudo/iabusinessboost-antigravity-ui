import './style.css'
import { N8N_WEBHOOK_URL, N8N_CONTACT_WEBHOOK_URL } from './config.js'

// --- Constants & Keys ---
const STORAGE_KEY = 'iabb_user_session';

// --- Toast System ---
function showToast(message, type = 'success') {
  const container = document.getElementById('toast-container');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.innerHTML = `
    <span class="toast-content">${message}</span>
    <button class="toast-close" aria-label="Fermer">&times;</button>
  `;

  container.appendChild(toast);

  // Close action
  const closeToast = () => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(100%)';
    setTimeout(() => {
      if (toast.parentNode) {
        toast.remove();
      }
    }, 300);
  };

  toast.querySelector('.toast-close').addEventListener('click', closeToast);

  // Auto-remove
  setTimeout(() => {
    if (toast.parentNode) {
      closeToast();
    }
  }, 5000);
}

// --- Session Management (localStorage) ---
const Auth = {
  getUser() {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      return data ? JSON.parse(data) : null;
    } catch (e) {
      console.error('Error reading localStorage', e);
      return null;
    }
  },

  saveUser(user) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({
        ...user,
        loggedIn: true,
        loginTime: new Date().getTime()
      }));
    } catch (e) {
      console.error('Error writing to localStorage', e);
    }
  },

  logout() {
    try {
      localStorage.removeItem(STORAGE_KEY);
      showToast('Vous avez été déconnecté avec succès.', 'info');
      window.location.hash = '#/';
      renderNavbar();
    } catch (e) {
      console.error('Error removing from localStorage', e);
    }
  },

  isLoggedIn() {
    const user = this.getUser();
    return !!(user && user.loggedIn);
  }
};

// --- Mobile Navigation Toggle ---
function setupMobileMenu() {
  const header = document.querySelector('.app-header');
  const menuToggle = document.getElementById('menu-toggle');

  if (menuToggle && header) {
    // Remove existing listeners to avoid duplicates
    const newMenuToggle = menuToggle.cloneNode(true);
    menuToggle.parentNode.replaceChild(newMenuToggle, menuToggle);

    newMenuToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      header.classList.toggle('menu-open');
    });

    // Close menu when clicking outside
    document.addEventListener('click', () => {
      header.classList.remove('menu-open');
    });
  }
}

// --- Navbar Rendering ---
function renderNavbar() {
  const navLinksContainer = document.getElementById('nav-links');
  if (!navLinksContainer) return;

  const currentHash = window.location.hash || '#/';
  const loggedIn = Auth.isLoggedIn();
  const user = Auth.getUser();

  let html = '';

  if (loggedIn) {
    html = `
      <a href="#/" class="nav-item ${currentHash === '#/' ? 'active' : ''}">Accueil</a>
      <a href="#/dashboard" class="nav-item ${currentHash === '#/dashboard' ? 'active' : ''}">Tableau de bord</a>
      <a href="#/contact" class="nav-item ${currentHash === '#/contact' ? 'active' : ''}">Contact</a>
      <span class="nav-item user-badge" style="color: var(--color-primary); font-weight: 600;">
        👤 ${user.prenom || user.email.split('@')[0]}
      </span>
      <a href="javascript:void(0)" id="logout-btn" class="btn-nav-logout">
        <span class="logout-icon">🚪</span> Déconnexion
      </a>
    `;
  } else {
    html = `
      <a href="#/" class="nav-item ${currentHash === '#/' ? 'active' : ''}">Accueil</a>
      <a href="#/contact" class="nav-item ${currentHash === '#/contact' ? 'active' : ''}">Contact</a>
      <a href="#/login" class="nav-item btn-nav-secondary">Connexion</a>
      <a href="#/register" class="nav-item btn-nav-primary">S'inscrire</a>
    `;
  }

  navLinksContainer.innerHTML = html;

  // Attach logout listener if logged in
  if (loggedIn) {
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
      logoutBtn.addEventListener('click', (e) => {
        e.preventDefault();
        Auth.logout();
      });
    }
  }

  // Setup mobile toggle menu listeners
  setupMobileMenu();
}

// --- Dynamic Views (Page Renderers) ---
const Views = {
  // 1. Page d'accueil / présentation
  home() {
    return {
      title: "IA Business Boost - L'IA au service de votre performance",
      html: `
        <div class="hero-section fade-in">
          <div class="hero-content">
            <span class="badge-tag">Mini Application Automatisée</span>
            <h1 class="hero-title title-gradient">IA Business Boost</h1>
            <p class="hero-subtitle">L'IA au service de votre performance</p>
            <p class="hero-description">
              Nous aidons les PME, indépendants et entrepreneurs à automatiser leurs tâches répétitives grâce à l’intelligence artificielle, n8n et des workflows connectés.
            </p>
            <div class="hero-actions">
              <a href="#/register" class="btn-primary">Commencer <span style="font-size: 1.1rem;">🚀</span></a>
              <a href="#/contact" class="btn-secondary">Demander un contact <span style="font-size: 1.1rem;">✉️</span></a>
            </div>
          </div>
          <div class="hero-image-container">
            <div class="hero-image-wrapper">
              <div class="hero-image" style="font-size: 8rem; display: flex; align-items: center; justify-content: center; user-select: none;">🤖</div>
            </div>
          </div>
        </div>

        <section class="features-section fade-in" style="animation-delay: 0.15s;">
          <h2 class="features-title">Pourquoi automatiser avec nous ?</h2>
          <p class="features-subtitle">Gagnez en efficacité en connectant vos outils du quotidien.</p>
          
          <div class="features-grid">
            <div class="feature-card">
              <span class="feature-icon">🔌</span>
              <h3>Intégrations n8n</h3>
              <p>Des workflows automatisés connectant vos logiciels favoris pour éradiquer les saisies manuelles.</p>
            </div>
            
            <div class="feature-card">
              <span class="feature-icon">🧠</span>
              <h3>Modèles IA sur-mesure</h3>
              <p>Exploitez ChatGPT, Claude et d'autres intelligences artificielles directement intégrés dans vos processus métiers.</p>
            </div>
            
            <div class="feature-card">
              <span class="feature-icon">📈</span>
              <h3>Performance Boostée</h3>
              <p>Libérez du temps qualitatif pour vos équipes et augmentez votre productivité opérationnelle sans effort.</p>
            </div>
          </div>
        </section>
      `,
      init() {
        // No specific initialization needed for landing page
      }
    };
  },

  // 2. Page d'inscription
  register() {
    return {
      title: "Créer votre compte - IA Business Boost",
      html: `
        <div class="form-layout fade-in">
          <div class="card-glass">
            <div class="form-header">
              <h2>Rejoindre l'aventure</h2>
              <p>Créez votre compte IA Business Boost en quelques secondes</p>
            </div>
            
            <form id="register-form">
              <div class="form-group">
                <label for="reg-prenom" class="form-label">Prénom</label>
                <input id="reg-prenom" type="text" class="form-input" placeholder="Votre prénom" required autocomplete="given-name" />
              </div>
              
              <div class="form-group">
                <label for="reg-nom" class="form-label">Nom</label>
                <input id="reg-nom" type="text" class="form-input" placeholder="Votre nom" required autocomplete="family-name" />
              </div>
              
              <div class="form-group">
                <label for="reg-email" class="form-label">Email</label>
                <input id="reg-email" type="email" class="form-input" placeholder="votre@email.com" required autocomplete="email" />
              </div>
              
              <div class="form-group">
                <label for="reg-password" class="form-label">Mot de passe</label>
                <input id="reg-password" type="password" class="form-input" placeholder="••••••••" required autocomplete="new-password" />
              </div>
              
              <button type="submit" id="register-submit-btn" class="btn-primary form-btn-submit">
                Créer mon compte
              </button>
              
              <div id="register-status"></div>
            </form>
            
            <div class="form-footer">
              Déjà inscrit ? <a href="#/login">Connectez-vous ici</a>
            </div>
          </div>
        </div>
      `,
      init() {
        const form = document.getElementById('register-form');
        const prenomInput = document.getElementById('reg-prenom');
        const nomInput = document.getElementById('reg-nom');
        const emailInput = document.getElementById('reg-email');
        const passwordInput = document.getElementById('reg-password');
        const statusEl = document.getElementById('register-status');
        const btn = document.getElementById('register-submit-btn');

        if (!form) return;

        form.addEventListener('submit', async (e) => {
          e.preventDefault();

          const prenom = prenomInput.value.trim();
          const nom = nomInput.value.trim();
          const email = emailInput.value.trim();
          const password = passwordInput.value;

          if (!prenom || !nom || !email || !password) {
            statusEl.className = 'form-status error';
            statusEl.innerHTML = '❌ Merci de remplir tous les champs.';
            return;
          }

          // Disable inputs during load
          btn.disabled = true;
          btn.innerHTML = `<div class="spinner"></div> Envoi en cours...`;
          statusEl.innerHTML = '';

          const payload = {
            prenom,
            nom,
            email,
            password,
            type: 'inscription'
          };

          console.log('Sending payload to n8n webhook:', payload);

          try {
            const response = await fetch(N8N_WEBHOOK_URL, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json'
              },
              body: JSON.stringify(payload)
            });

            console.log('Webhook response status:', response.status);

            if (!response.ok) {
              throw new Error('Erreur HTTP ' + response.status);
            }

            // Inscription confirmée. Save to localStorage.
            Auth.saveUser({ prenom, nom, email });

            // Render navigation header again for updated state
            renderNavbar();

            // Toast notification
            showToast('✅ Compte créé avec succès ! Bienvenue chez IA Business Boost.', 'success');

            // Redirect to dashboard with a query parameter/flag for welcome message
            localStorage.setItem('iabb_show_welcome_banner', 'true');
            window.location.hash = '#/dashboard';

          } catch (error) {
            console.error('Webhook error:', error);
            statusEl.className = 'form-status error';
            statusEl.innerHTML = `❌ Erreur : ${error.message}. Connexion au serveur impossible.`;

            // Optional fallback: Save locally anyway if n8n webhook fails but user requested to simulate?
            // "À la soumission : envoyer les données au webhook n8n d'inscription défini dans config.js, enregistrer l'utilisateur dans localStorage, rediriger vers #/dashboard"
            // We should respect the webhook. If the webhook fails, we warn but allow simulated signup for test purposes.
            // Let's add a button in the error state to "Passer hors-ligne" or just force it for convenience, or stick strictly to webhook response.
            // Let's stick to webhook response, but give user info. 
          } finally {
            btn.disabled = false;
            btn.innerHTML = `Créer mon compte`;
          }
        });
      }
    };
  },

  // 3. Page de connexion
  login() {
    return {
      title: "Connexion - IA Business Boost",
      html: `
        <div class="form-layout fade-in">
          <div class="card-glass">
            <div class="form-header">
              <h2>Espace Connexion</h2>
              <p>Accédez à votre espace IA Business Boost</p>
            </div>
            
            <form id="login-form">
              <div class="form-group">
                <label for="login-email" class="form-label">Email</label>
                <input id="login-email" type="email" class="form-input" placeholder="votre@email.com" required autocomplete="email" />
              </div>
              
              <div class="form-group">
                <label for="login-password" class="form-label">Mot de passe</label>
                <input id="login-password" type="password" class="form-input" placeholder="••••••••" required autocomplete="current-password" />
              </div>
              
              <button type="submit" id="login-submit-btn" class="btn-primary form-btn-submit">
                Se connecter
              </button>
            </form>
            
            <div class="form-footer">
              Nouveau client ? <a href="#/register">Créez un compte ici</a>
            </div>
          </div>
        </div>
      `,
      init() {
        const form = document.getElementById('login-form');
        const emailInput = document.getElementById('login-email');
        const passwordInput = document.getElementById('login-password');
        const btn = document.getElementById('login-submit-btn');

        if (!form) return;

        form.addEventListener('submit', (e) => {
          e.preventDefault();

          const email = emailInput.value.trim();

          if (!email) return;

          btn.disabled = true;
          btn.innerHTML = `<div class="spinner"></div> Connexion...`;

          // Simulation of simple login: save email in localStorage and redirect
          // If we had a previous registration of this user, let's keep the details
          const existingUser = Auth.getUser();
          const prenom = (existingUser && existingUser.email === email) ? existingUser.prenom : '';
          const nom = (existingUser && existingUser.email === email) ? existingUser.nom : '';

          setTimeout(() => {
            Auth.saveUser({
              prenom: prenom || '',
              nom: nom || '',
              email: email
            });

            renderNavbar();
            showToast('Ravi de vous revoir ! Connexion réussie.', 'success');
            window.location.hash = '#/dashboard';
          }, 600); // Small realistic delay for UI satisfaction
        });
      }
    };
  },

  // 4. Page dashboard après connexion
  dashboard() {
    const user = Auth.getUser() || { prenom: '', nom: '', email: 'votre@email.com' };
    const displayName = user.prenom ? user.prenom : user.email;
    const showWelcome = localStorage.getItem('iabb_show_welcome_banner') === 'true';

    // Clear the welcome banner flag so it doesn't show up again
    localStorage.removeItem('iabb_show_welcome_banner');

    return {
      title: "Tableau de bord - IA Business Boost",
      html: `
        <div class="dashboard-container fade-in">
          ${showWelcome ? `
            <div class="form-status success" style="margin-bottom: 24px; padding: 16px;">
              🎉 Inscription confirmée ! Bienvenue chez IA Business Boost. Votre session est active.
            </div>
          ` : ''}
          
          <div class="dashboard-header">
            <div class="dashboard-welcome">
              <h2>Bienvenue, ${displayName} !</h2>
              <p>Voici l'aperçu de votre espace d'automatisation IA.</p>
            </div>
            <div>
              <a href="#/contact" class="btn-accent">🚀 Lancer un projet IA</a>
            </div>
          </div>

          <div class="dashboard-stats-grid">
            <div class="stat-card">
              <div class="stat-icon-wrapper">🤖</div>
              <div class="stat-info">
                <span class="stat-value">n8n</span>
                <span class="stat-label">Workflow Principal</span>
              </div>
            </div>
            
            <div class="stat-card accent-gold">
              <div class="stat-icon-wrapper">🔋</div>
              <div class="stat-info">
                <span class="stat-value">Connecté</span>
                <span class="stat-label">Statut Webhook</span>
              </div>
            </div>
            
            <div class="stat-card">
              <div class="stat-icon-wrapper">📁</div>
              <div class="stat-info">
                <span class="stat-value">Actif</span>
                <span class="stat-label">Google Sheets DB</span>
              </div>
            </div>
          </div>

          <div class="dashboard-content-layout">
            <div class="dashboard-panel">
              <h3>Vos intégrations de service</h3>
              
              <div class="integration-list">
                <div class="integration-item">
                  <div class="integration-meta">
                    <span class="integration-logo">🔄</span>
                    <div>
                      <div class="integration-name">Webhook d'Inscription</div>
                      <div class="integration-desc">Connecté à n8n & Google Sheets</div>
                    </div>
                  </div>
                  <span class="integration-status active">Fonctionnel</span>
                </div>
                
                <div class="integration-item">
                  <div class="integration-meta">
                    <span class="integration-logo">📧</span>
                    <div>
                      <div class="integration-name">Demande de Contact</div>
                      <div class="integration-desc">Formulaire client direct n8n</div>
                    </div>
                  </div>
                  <span class="integration-status active">Fonctionnel</span>
                </div>
                
                <div class="integration-item" style="opacity: 0.6;">
                  <div class="integration-meta">
                    <span class="integration-logo">💬</span>
                    <div>
                      <div class="integration-name">IA Chat Assistant (Bientôt)</div>
                      <div class="integration-desc">Support automatisé intelligent GPT-4</div>
                    </div>
                  </div>
                  <span class="integration-status" style="background: rgba(232, 238, 252, 0.05); color: var(--color-text-muted);">En pause</span>
                </div>
              </div>
            </div>

            <div class="dashboard-action-banner">
              <h4>Besoin d'une automatisation sur-mesure ?</h4>
              <p>Nos experts conçoivent vos scénarios n8n et connectent vos plateformes cloud (CRM, Drive, Emailing).</p>
              <a href="#/contact" class="btn-primary" style="width: 100%;">
                Contacter un expert <span style="font-size: 1rem;">✉️</span>
              </a>
            </div>
          </div>
        </div>
      `,
      init() {
        // Dashboard specific listeners if any
      }
    };
  },

  // 5. Page demande de contact
  contact() {
    const user = Auth.getUser() || { prenom: '', nom: '', email: '' };

    return {
      title: "Demande de contact - IA Business Boost",
      html: `
        <div class="form-layout fade-in">
          <div class="card-glass">
            <div class="form-header">
              <h2>Formuler votre demande</h2>
              <p>Décrivez-nous votre projet d'automatisation n8n et IA</p>
            </div>
            
            <form id="contact-form">
              <div class="form-group">
                <label for="contact-prenom" class="form-label">Prénom</label>
                <input id="contact-prenom" type="text" class="form-input" placeholder="Votre prénom" required value="${user.prenom || ''}" />
              </div>
              
              <div class="form-group">
                <label for="contact-nom" class="form-label">Nom</label>
                <input id="contact-nom" type="text" class="form-input" placeholder="Votre nom" required value="${user.nom || ''}" />
              </div>
              
              <div class="form-group">
                <label for="contact-email" class="form-label">Email</label>
                <input id="contact-email" type="email" class="form-input" placeholder="votre@email.com" required value="${user.email || ''}" autocomplete="email" />
              </div>
              
              <div class="form-group">
                <label for="contact-message" class="form-label">Message / Description du projet</label>
                <textarea id="contact-message" class="form-input" placeholder="Bonjour, j'aimerais automatiser la récupération de mes leads et leur traitement par IA..." required></textarea>
              </div>
              
              <button type="submit" id="contact-submit-btn" class="btn-primary form-btn-submit">
                Envoyer ma demande
              </button>
              
              <div id="contact-status"></div>
            </form>
          </div>
        </div>
      `,
      init() {
        const form = document.getElementById('contact-form');
        const prenomInput = document.getElementById('contact-prenom');
        const nomInput = document.getElementById('contact-nom');
        const emailInput = document.getElementById('contact-email');
        const messageInput = document.getElementById('contact-message');
        const statusEl = document.getElementById('contact-status');
        const btn = document.getElementById('contact-submit-btn');

        if (!form) return;

        form.addEventListener('submit', async (e) => {
          e.preventDefault();

          const prenom = prenomInput.value.trim();
          const nom = nomInput.value.trim();
          const email = emailInput.value.trim();
          const message = messageInput.value.trim();

          if (!prenom || !nom || !email || !message) {
            statusEl.className = 'form-status error';
            statusEl.innerHTML = '❌ Veuillez remplir tous les champs.';
            return;
          }

          btn.disabled = true;
          btn.innerHTML = `<div class="spinner"></div> Envoi en cours...`;
          statusEl.innerHTML = '';

          const payload = {
            prenom,
            nom,
            email,
            message,
            type: 'contact'
          };

          console.log('Sending contact payload to n8n:', payload);

          try {
            const response = await fetch(N8N_CONTACT_WEBHOOK_URL, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json'
              },
              body: JSON.stringify(payload)
            });

            console.log('Webhook response status:', response.status);

            if (!response.ok) {
              throw new Error('Erreur HTTP ' + response.status);
            }

            statusEl.className = 'form-status success';
            statusEl.innerHTML = '✅ Votre demande de contact a été envoyée avec succès. Notre équipe vous recontactera rapidement.';

            showToast('✅ Message envoyé ! Nous vous répondrons sous 24h.', 'success');

            // Clear message field only
            messageInput.value = '';
          } catch (error) {
            console.error('Webhook error:', error);
            statusEl.className = 'form-status error';
            statusEl.innerHTML = `❌ Échec de l'envoi : ${error.message}. Veuillez réessayer ultérieurement.`;
            showToast(`❌ Erreur d'envoi: ${error.message}`, 'error');
          } finally {
            btn.disabled = false;
            btn.innerHTML = `Envoyer ma demande`;
          }
        });
      }
    };
  }
};

// --- Client-side Router ---
function router() {
  const hash = window.location.hash || '#/';
  const appContainer = document.getElementById('app');
  if (!appContainer) return;

  // Close hamburger menu on navigation (if open)
  const header = document.querySelector('.app-header');
  if (header) {
    header.classList.remove('menu-open');
  }

  // Auth Guards
  const loggedIn = Auth.isLoggedIn();

  let targetView = 'home';

  if (hash === '#/') {
    targetView = 'home';
  } else if (hash === '#/register') {
    if (loggedIn) {
      window.location.hash = '#/dashboard';
      return;
    }
    targetView = 'register';
  } else if (hash === '#/login') {
    if (loggedIn) {
      window.location.hash = '#/dashboard';
      return;
    }
    targetView = 'login';
  } else if (hash === '#/dashboard') {
    if (!loggedIn) {
      window.location.hash = '#/login';
      return;
    }
    targetView = 'dashboard';
  } else if (hash === '#/contact') {
    targetView = 'contact';
  } else {
    // 404 Fallback to home
    window.location.hash = '#/';
    return;
  }

  // Render view
  const viewData = Views[targetView]();

  // Dynamic page title update
  document.title = viewData.title;

  // Inject HTML structure
  appContainer.innerHTML = viewData.html;

  // Execute view specific initialization logic (attach events etc.)
  viewData.init();

  // Refresh navbar to reflect active tabs
  renderNavbar();
}

// --- App Initialization ---
document.addEventListener('DOMContentLoaded', () => {
  // Initial navbar render
  renderNavbar();

  // Router trigger on page load
  router();

  // Route change listener
  window.addEventListener('hashchange', router);
});

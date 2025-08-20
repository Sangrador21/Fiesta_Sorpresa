// ==========================
// IMPORTS Firebase (usa la versión que prefieras de 10.x)
// ==========================
// import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
// import {
//     getAuth, onAuthStateChanged, signInAnonymously,
//     isSignInWithEmailLink, sendSignInLinkToEmail, signInWithEmailLink, signOut
// } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
// import {
//     getFirestore, collection, addDoc, query, where, orderBy,
//     onSnapshot, serverTimestamp, doc, getDoc, deleteDoc
// } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

// Firebase por CDN (v12.1.0)
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-app.js";
import { initializeAppCheck, ReCaptchaV3Provider } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-app-check.js";
import { getAuth, onAuthStateChanged, signInAnonymously, signOut, GoogleAuthProvider, signInWithPopup, signInWithRedirect, getRedirectResult } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-auth.js";
import { getFirestore, collection, addDoc, query, orderBy, onSnapshot, serverTimestamp, doc, deleteDoc } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js";
// import { getAnalytics } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-analytics.js";

const firebaseConfig = {
    apiKey: "AIzaSyA2pa_CqN4HEuTWod7GnqpLBQ6djag0p8A",
    authDomain: "fiesta-sorpresa-c160a.firebaseapp.com",
    projectId: "fiesta-sorpresa-c160a",
    storageBucket: "fiesta-sorpresa-c160a.firebasestorage.app",
    messagingSenderId: "216287828576",
    appId: "1:216287828576:web:36644baeb2466d1b178105",
    measurementId: "G-5WHQ8CCJP4"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Inicializa App Check ANTES de getAuth/getFirestore
initializeAppCheck(app, { provider: new ReCaptchaV3Provider('6LfG6KsrAAAAAD2Ay2FPIW2GL6tfINepL0NscyAd'),
    isTokenAutoRefreshEnabled: true, // renueva tokens en segundo plano
});

// Servicios 
const auth = getAuth(app);
const db = getFirestore(app);
// const analytics = getAnalytics(app);

// === ÚNICO ADMIN POR CORREO ===
const ADMIN_EMAIL = "yaelsangrador16@gmail.com"; // <-- cámbialo por el tuyo

// Toast global reutilizable
window.showToast = function (msg, type = 'success') {
    const el = document.getElementById('appToast');
    const body = document.getElementById('appToastBody');
    if (!el || !body) { console.log(msg); return; }
    el.classList.remove('text-bg-success','text-bg-danger','text-bg-warning');
    el.classList.add(type === 'success' ? 'text-bg-success'
                : type === 'warning' ? 'text-bg-warning' : 'text-bg-danger');
    body.textContent = msg;
    bootstrap.Toast.getOrCreateInstance(el, { delay: 3500 }).show();
};


// ==========================
// CONFIGURACIÓN RÁPIDA (datos del evento)
// ==========================
const CONFIG = {
    nombreAbue: 'Rafaela Flores Valderrama',
    edad: 66,
    tituloHero: 'Fiesta Sorpresa',
    subtitulo: 'Una tarde para agradecer su amor, su vida y su abrazo de siempre.',
    fechaISO: '2025-10-25T14:30:00-06:00',
    lugar: 'Iglesia: Parroquia de San Agustín de Hipona',
    direccion: 'Salón de Fiestas: Ubicado a un costado de la Parroquia de San Agustín de Hipona',
    mapsEmbed: 'https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d3758.922177104802!2d-99.2744894!3d19.5878345!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x85d21c74845a79af%3A0xc9ad05d37432a3b2!2sParroquia%20de%20San%20Agustin%20de%20Hipona!5e0!3m2!1ses-419!2smx!4v1754612072932!5m2!1ses-419!2smx',
    rsvpPhone: '525540118688',
    pdfUrl: 'Rafaela_Flores_Invitacion.pdf',
    videoUrl: 'Rafaela_Flores_Video.mp4',

    musicUrl: 'Ojitos_Mentirosos.mp3',

    mapsLink: 'https://maps.app.goo.gl/az2jSaFsnQRzbPfo8',
    mapsLat: '',      
    mapsLng: '', 
    mapsPlaceId: ''  
};


// ==========================
// Utilidades de formateo
// ==========================
const meses = ['enero','febrero','marzo','abril','mayo','junio','julio','agosto','septiembre','octubre','noviembre','diciembre'];
function fechaBonita(date) {
    const d = new Date(date);
    const dd = d.getDate();
    const mm = meses[d.getMonth()];
    const yyyy = d.getFullYear();
    let hh = d.getHours();
    const min = String(d.getMinutes()).padStart(2,'0');
    const ampm = hh >= 12 ? 'p.m.' : 'a.m.';
    hh = hh % 12; if (hh === 0) hh = 12;
    return { fecha: `${dd} de ${mm} de ${yyyy}`, hora: `${hh}:${min} ${ampm}` };
}

// ==========================
// Pinta contenido estático
// ==========================
(function initStatic(){
    const setText = (id, val) => {
        const el = document.getElementById(id);
        if (el) el.textContent = val;
    };
    const setSrc = (id, val) => {
        const el = document.getElementById(id);
        if (el) el.src = val;
    };

    // Texto principal
    setText('nombreAbue', CONFIG.nombreAbue);
    setText('edad', CONFIG.edad);
    setText('subtitulo', CONFIG.subtitulo);

    // Fechas y lugares
    const f = fechaBonita(CONFIG.fechaISO);
    setText('fechaLarga', f.fecha);
    setText('horaLarga', f.hora);
    setText('fechaSide', `${f.fecha} – ${f.hora}`);

    setText('lugar', CONFIG.lugar);
    setText('direccion', CONFIG.direccion);
    setText('lugarSide', CONFIG.lugar);
    setText('direccionSide', CONFIG.direccion);
    setText('fechaHero', `${f.fecha} · ${f.hora}`);

    // Footer
    setText('anioFooter', new Date().getFullYear());

    // PDF / Video / Mapa
    const btnPDF = document.getElementById('btnPDF');
    if (btnPDF) btnPDF.href = CONFIG.pdfUrl;

    setSrc('videoAbue', CONFIG.videoUrl);
    setSrc('iframeMapa', CONFIG.mapsEmbed);

    // // WhatsApp
    // const msg = `Hola, soy ${CONFIG.rsvpNombre}. Confirmo mi asistencia a la fiesta sorpresa de ${CONFIG.nombreAbue} (${CONFIG.edad} años) el ${f.fecha} a las ${f.hora}. ¡Allí estaré a tiempo!`;
    // const wa = `https://wa.me/${CONFIG.rsvpPhone}?text=${encodeURIComponent(msg)}`;
    // ['btnRSVP','btnRSVP2','btnRSVP3'].forEach(id => {
    //     const el = document.getElementById(id);
    //     if (el) el.href = wa;
    // });
})();

// ===== WhatsApp dinámico con nombre del invitado =====
(function setupRSVP(){
    const ids = ['btnRSVP','btnRSVP2','btnRSVP3']; // el que no exista se ignora

    // Guarda/lee el nombre localmente
    const getSavedName = () => localStorage.getItem('guestName') || '';
    const saveName = (n) => n && localStorage.setItem('guestName', n);

    // Intenta usar el nombre del campo "Tu nombre" del libro de dedicatorias si existe
    const getNameFromForm = () => (document.getElementById('dNombre')?.value || '').trim();

    const f = fechaBonita(CONFIG.fechaISO);
    const buildWA = (name) => {
        const quien = name && name.length ? name : 'Yo';
        const msg = `Hola, soy ${quien}. Confirmo mi asistencia a la fiesta sorpresa de ${CONFIG.nombreAbue} (${CONFIG.edad} años) el ${f.fecha} a las ${f.hora}. ¡Allí estaré a tiempo!`;
        return `https://wa.me/${CONFIG.rsvpPhone}?text=${encodeURIComponent(msg)}`;
    };

    ids.forEach(id => {
        const el = document.getElementById(id);
        if (!el) return;

        el.addEventListener('click', (e) => {
            let name = getNameFromForm() || getSavedName();
            if (!name) {
                const sugerido = getSavedName() || '';
                const input = prompt('¿Cómo te llamas para la confirmación?', sugerido);
                if (input) { name = input.trim(); saveName(name); }
            }
            const url = buildWA(name);

            // Abrimos de forma explícita según target para garantizar navegación
            e.preventDefault();
            if (el.target === '_blank') {
                window.open(url, '_blank', 'noopener');  // abrir en nueva pestaña
            } else {
                location.href = url;                     // misma pestaña
            }
        });
    });
})();

document.getElementById('dNombre')?.addEventListener('input', (e) => {
    const v = (e.target.value || '').trim();
    if (v) localStorage.setItem('guestName', v);
});


// ==========================
// Slider
// ==========================
// Sincroniza los indicadores con la cantidad de slides del carrusel
(function syncCarouselIndicators(){
    const SHOW_DOTS = false; // Puntos 
    const car = document.getElementById('clubesCarousel');
    if (!car) return;

    // Asegura contenedor
    let ind = car.querySelector('.carousel-indicators');
    if (!ind) {
        ind = document.createElement('div');
        ind.className = 'carousel-indicators';
        car.appendChild(ind);
    }

    const items = car.querySelectorAll('.carousel-inner .carousel-item');
    if (!items.length) return;

    // Activa sólo el primero
    items.forEach((item, i) => item.classList.toggle('active', i === 0));

    // Si no queremos puntitos, removemos el contenedor y salimos
    if (!SHOW_DOTS) { ind.remove(); return; }

    // (si SHOW_DOTS = true) genera los botones
    ind.innerHTML = '';
    items.forEach((_, i) => {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.setAttribute('data-bs-target', '#clubesCarousel');
        btn.setAttribute('data-bs-slide-to', String(i));
        btn.setAttribute('aria-label', `Foto ${i + 1}`);
        if (i === 0) btn.classList.add('active');
        ind.appendChild(btn);
    });
})();

// ==========================
// Countdown
// ==========================
(function startCountdown(){
    const end = new Date(CONFIG.fechaISO).getTime();
    function tick(){
        const now = Date.now();
        let diff = Math.max(0, end - now);
        const days = Math.floor(diff / (1000*60*60*24)); diff -= days*(1000*60*60*24);
        const hrs  = Math.floor(diff / (1000*60*60));    diff -= hrs*(1000*60*60);
        const min  = Math.floor(diff / (1000*60));       diff -= min*(1000*60);
        const sec  = Math.floor(diff / 1000);
        document.getElementById('cd-dias').textContent = String(days);
        document.getElementById('cd-horas').textContent = String(hrs).padStart(2,'0');
        document.getElementById('cd-min').textContent  = String(min).padStart(2,'0');
        document.getElementById('cd-sec').textContent  = String(sec).padStart(2,'0');
    }
    tick();
    setInterval(tick, 1000);
})();

// ==========================
// Scroll suave
// ==========================
document.querySelectorAll('a.nav-link[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
        e.preventDefault();
        const target = document.querySelector(a.getAttribute('href'));
        if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
});

// ===== Acceso Organizador (Navbar + Modal) =====
const adminMenuBtn   = document.getElementById('adminMenuBtn');
const cmdAdminOpen   = document.getElementById('cmdAdminOpen');
const cmdAdminPanel  = document.getElementById('cmdAdminPanel');
const cmdAdminLogout = document.getElementById('cmdAdminLogout');

const adminModalEl   = document.getElementById('adminModal');
const adminEmailInp  = document.getElementById('adminEmail');
const adminErrorBox  = document.getElementById('adminError');
const btnGoogleLogin = document.getElementById('btnGoogleLogin');



cmdAdminOpen?.addEventListener('click', () => {
    adminErrorBox?.classList.add('d-none');
    if (adminEmailInp) adminEmailInp.value = '';
    bootstrap.Modal.getOrCreateInstance(adminModalEl).show();
});

btnGoogleLogin?.addEventListener('click', async () => {
    try {
        adminErrorBox?.classList.add('d-none');

        const entered = (adminEmailInp?.value || '').trim().toLowerCase();
        if (entered !== ADMIN_EMAIL.toLowerCase()) {
        adminErrorBox.textContent = 'Ese correo no está autorizado.';
        adminErrorBox.classList.remove('d-none');
        return;
        }

        const provider = new GoogleAuthProvider();
        provider.setCustomParameters({ login_hint: ADMIN_EMAIL, prompt: 'select_account' });

        try {
        const { user } = await signInWithPopup(auth, provider);
        if ((user.email || '').toLowerCase() !== ADMIN_EMAIL.toLowerCase()) {
            await signOut(auth);
            throw new Error('Cuenta no autorizada.');
        }
        } catch (e) {
        if (e?.code === 'auth/popup-blocked' || e?.code === 'auth/cancelled-popup-request') {
            await signInWithRedirect(auth, provider);
            return; // continúa en getRedirectResult
        }
        throw e;
        }

        bootstrap.Modal.getOrCreateInstance(adminModalEl).hide();
        showToast?.('Sesión iniciada como organizador.', 'success');
    } catch (e) {
        console.error('Google sign-in error:', e);
        adminErrorBox.textContent = e?.message || 'No se pudo iniciar sesión.';
        adminErrorBox.classList.remove('d-none');
    }
});

// Si venimos de redirect:
getRedirectResult(auth).then(res => {
    const user = res?.user;
    if (!user) return;
    if ((user.email || '').toLowerCase() !== ADMIN_EMAIL.toLowerCase()) {
        signOut(auth);
        adminErrorBox.textContent = 'Cuenta no autorizada.';
        adminErrorBox.classList.remove('d-none');
        return;
    }
    bootstrap.Modal.getOrCreateInstance(adminModalEl).hide();
    showToast?.('Sesión iniciada como organizador.', 'success');
}).catch(console.error);


cmdAdminPanel?.addEventListener('click', () => {
    document.querySelector('#detalles')?.scrollIntoView({ behavior: 'smooth' });
});

cmdAdminLogout?.addEventListener('click', async () => {
    try {
        await signOut(auth);
        await signInAnonymously(auth);
        if (typeof showToast === 'function') showToast('Sesión cerrada.', 'success');
    } catch (e) { console.error(e); }
});

// ==========================
// Libro de dedicatorias (Firestore + Auth) — PRIVADO PARA INVITADOS
// ==========================
(function libroDedicatorias(){
    // Helpers UI
    function setSubmitting(s) {
        STATE.isSending = s;
        if (btnFirmar) {
            btnFirmar.disabled = s;
            btnFirmar.innerHTML = s
            ? '<span class="spinner-border spinner-border-sm me-2" aria-hidden="true"></span> Enviando...'
            : '<i class="bi bi-send me-1"></i>Firmar';
        }
    }

    const nombre = document.getElementById('dNombre');
    const mensaje = document.getElementById('dMensaje');
    const contador = document.getElementById('dContador');
    const lista = document.getElementById('listaDedicatorias');
    const form = document.getElementById('formDedicatoria');
    
    // Límites leídos del DOM (caen en 500/50 si faltan)
    const MAX_MSG  = Number(mensaje?.getAttribute('maxlength')) || 500;
    const MAX_NAME = Number(nombre?.getAttribute('maxlength')) || 50;

    const btnExportar = document.getElementById('btnExportar');
    const btnFirmar = document.getElementById('btnFirmar');

    const authInfo = document.getElementById('authInfo');
    const contadorFirmas = document.getElementById('contadorFirmas');

    if (!form || !lista) return;

    const COL = collection(db, 'dedicatorias');
    const STATE = {
        user: null,
        isAdmin: false,
        verTodas: true,       // como admin verás todas por defecto
        unsubscribe: null,
        lastSnapshot: [],
        isSending: false,
    };

    // ---- Estado de sesión (con filtro por correo del único admin)
    onAuthStateChanged(auth, async (user) => {
        if (!user) { try { await signInAnonymously(auth); } catch(e){ console.error(e); } return; }
        STATE.user = user;

        STATE.isAdmin = !user.isAnonymous && (user.email || '').toLowerCase() === ADMIN_EMAIL.toLowerCase();

        // Navbar
        adminMenuBtn?.classList.toggle('btn-outline-dark', !STATE.isAdmin);
        adminMenuBtn?.classList.toggle('btn-success', STATE.isAdmin);
        if (adminMenuBtn) {
            adminMenuBtn.innerHTML = STATE.isAdmin
            ? '<i class="bi bi-shield-lock-fill me-1"></i> Organizador'
            : '<i class="bi bi-shield-lock me-1"></i> Organizador';
        }
        cmdAdminPanel?.classList.toggle('d-none', !STATE.isAdmin);
        cmdAdminLogout?.classList.toggle('d-none', !STATE.isAdmin);

        // Texto en el form y controles sensibles
        authInfo.textContent = STATE.isAdmin ? `Sesión: admin (${user.email || 'sin-email'})` : 'Sesión: invitado';
        btnExportar?.classList.toggle('d-none', !STATE.isAdmin);

        contadorFirmas.textContent = '';

        if (!STATE.isAdmin) { STATE.unsubscribe?.(); STATE.unsubscribe = null; renderPrivado(); return; }
        startQuery();
        });

        cmdAdminLogout?.addEventListener('click', async () => {
        try { await signOut(auth); await signInAnonymously(auth); showToast?.('Sesión cerrada.', 'success'); }
        catch (e) { console.error(e); }
    });


    function startQuery() {
        if (STATE.unsubscribe) { STATE.unsubscribe(); STATE.unsubscribe = null; }
        if (!STATE.user || !STATE.isAdmin) return;

        const q = query(COL, orderBy('ts', 'desc'));
        STATE.unsubscribe = onSnapshot(q, (snap) => {
        const data = snap.docs.map(d => ({ id: d.id, ...d.data() }));
        STATE.lastSnapshot = data;
        renderAdmin(data);
        }, (err) => console.error('onSnapshot error:', err));
    }

    // Vista Invitado: nada de lecturas
    function renderPrivado() {
        lista.innerHTML = '';
        const box = document.createElement('div');
        box.className = 'alert alert-success mb-0';
        box.innerHTML = `
        <div class="fw-semibold"><i class="bi bi-check2-circle me-1"></i> Tu mensaje será privado</div>
        <div class="small">Gracias por escribirle unas palabras a la festejada. Al enviar, solo el organizador podrá verlas.</div>
        `;
        lista.append(box);
    }

    // Vista Admin: lista con borrar/exportar
    function renderAdmin(arr) {
        lista.innerHTML = '';

        contadorFirmas.textContent = `Firmas: ${arr.length}`;

        if (arr.length === 0) {
        const vacio = document.createElement('div');
        vacio.className = 'text-secondary small';
        vacio.textContent = 'Aún no hay dedicatorias.';
        lista.append(vacio);
        return;
        }

        arr.forEach(d => {
        const card = document.createElement('div');
        card.className = 'border rounded p-3';

        const head = document.createElement('div');
        head.className = 'd-flex justify-content-between align-items-start';

        const left = document.createElement('div');
        const nom = document.createElement('div');
        nom.className = 'fw-semibold';
        nom.textContent = d.nombre || 'Anónimo';

        const fecha = document.createElement('div');
        fecha.className = 'small text-secondary';
        const fechaJS = d.ts && d.ts.toDate ? d.ts.toDate() : new Date();
        fecha.textContent = fechaJS.toLocaleString('es-MX', { dateStyle: 'medium', timeStyle: 'short' });

        left.append(nom, fecha);

        const canDelete = STATE.isAdmin; // si quieres permitir autor: || d.userId === STATE.user.uid
        const del = document.createElement('button');
        del.type = 'button';
        del.className = 'btn btn-sm btn-outline-danger';
        del.innerHTML = '<i class="bi bi-trash"></i>';
        del.disabled = !canDelete;
        del.title = canDelete ? 'Eliminar dedicatoria' : 'Sin permiso para borrar';
        del.addEventListener('click', async () => {
            if (!canDelete) return;
            if (!confirm('¿Eliminar esta dedicatoria?')) return;
            try {
            await deleteDoc(doc(db, 'dedicatorias', d.id));
            } catch (e) {
            alert('No se pudo borrar.');
            console.error(e);
            }
        });

        head.append(left, del);

        const body = document.createElement('p');
        body.className = 'mb-0 mt-2';
        body.textContent = d.mensaje || '';

        card.append(head, body);
        lista.append(card);
        });
    }

    // Submit (enviar dedicatoria)
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        if (!STATE.user || STATE.isSending) return;

        const nom = (nombre.value || 'Anónimo').trim().slice(0,50);
        const msg = (mensaje.value || '').trim();

        if (!msg) { mensaje.focus(); return; }
        if (msg.length > MAX_MSG) {
            showToast(`Máximo ${MAX_MSG} caracteres.`, 'warning');
            return;
            }
        if (nom.length > MAX_NAME) {
            showToast(`Nombre máximo ${MAX_NAME} caracteres.`, 'warning');
            return;
        }

        if (!navigator.onLine) { showToast('Sin conexión. Intenta de nuevo.', 'warning'); return; }

        setSubmitting(true);

        try {
            await addDoc(COL, {
            userId: STATE.user.uid,
            nombre: nom,
            mensaje: msg,
            ts: serverTimestamp()
            });

            form.reset();
            if (contador) contador.textContent = '0';

            // Feedback visual
            showToast('¡Tu dedicatoria fue enviada! 🎉', 'success');

            // (Opcional) Caja verde dentro del listado para invitados
            if (!STATE.isAdmin) {
            const ok = document.createElement('div');
            ok.className = 'alert alert-success mt-2';
            ok.innerHTML = '<i class="bi bi-send-check me-1"></i> ¡Gracias! Tu dedicatoria fue enviada.';
            lista.prepend(ok);
            setTimeout(() => ok.remove(), 5000);
            }
        } catch (e) {
            console.error('Error al guardar:', e);
            // Mensajes más claros por tipo de error
            const code = (e && e.code) || '';
            if (code === 'permission-denied') {
            showToast('No tienes permisos para escribir. Avísale al organizador.', 'danger');
            } else if (code === 'unauthenticated') {
            showToast('Sesión inválida. Recarga la página e intenta de nuevo.', 'danger');
            } else {
            showToast('No se pudo guardar la dedicatoria. Intenta más tarde.', 'danger');
            }
        } finally {
            setSubmitting(false);
        }
    });


    // Contador de caracteres
    if (mensaje && contador) {
        const updateCount = () => { contador.textContent = String(mensaje.value.length); };
        updateCount(); // arranca en 0/500
        mensaje.addEventListener('input', updateCount);
    }

    // Exportar (solo admin)
    btnExportar?.addEventListener('click', () => {
        if (!STATE.isAdmin) return;
        const blob = new Blob([JSON.stringify(STATE.lastSnapshot, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'dedicatorias_todas.json';
        document.body.append(a);
        a.click();
        a.remove();
        URL.revokeObjectURL(url);
    });

})();


// Marcar la Miniatura activa 
// document.addEventListener('DOMContentLoaded', () => {
//   const carouselEl = document.getElementById('clubesCarousel');
//   if (!carouselEl) return;

//   // resalta la miniatura activa
//   const thumbLinks = Array.from(document.querySelectorAll('[data-bs-target="#clubesCarousel"][data-bs-slide-to] img'));

//   const setActiveThumb = (idx) => {
//     thumbLinks.forEach((img, i) => {
//       img.classList.toggle('opacity-100', i === idx);
//       img.classList.toggle('opacity-75', i !== idx);
//       img.classList.toggle('border', i === idx);
//       img.classList.toggle('border-2', i === idx);
//       img.classList.toggle('border-success', i === idx);
//     });
//   };

//   // inicial
//   setActiveThumb(0);

//   // al terminar cada transición
//   carouselEl.addEventListener('slid.bs.carousel', (e) => {
//     // e.to es el índice al que llegó (Bootstrap 5.3)
//     if (typeof e.to === 'number') setActiveThumb(e.to);
//   });
// });


// Actualizar el año de los derechos 
document.getElementById('anioFooter').textContent = new Date().getFullYear();

// ==========================
// Agregar al calendario 
// ==========================

// ====== Configura aquí tu evento ======
const CAL_CFG = {
    titulo:   "Fiesta Sorpresa - Rafaela Flores",
    detalles: "Celebremos juntos a Rafaela. Por favor, llega con tiempo para la sorpresa.",
    lugar:    "Parroquia de San Agustín de Hipona",
    zona:     "America/Mexico_City",
    // Inicio local (24h): AAAA-MM-DDTHH:mm
    inicioLocal: "2025-10-25T14:30",
    duracionMin: 630, // (Minutos)
};

// ====== Utilidades ======
const pad = n => String(n).padStart(2,"0");
const fmtGoogle = d =>
    d.getFullYear() + pad(d.getMonth()+1) + pad(d.getDate()) +
    "T" + pad(d.getHours()) + pad(d.getMinutes()) + pad(d.getSeconds());
const fmtICS = d =>
    d.getFullYear() + pad(d.getMonth()+1) + pad(d.getDate()) +
    "T" + pad(d.getHours()) + pad(d.getMinutes()) + "00";

// ====== Crear enlaces ======
function buildCalendarLinks(cfg){
    const start = new Date(cfg.inicioLocal);
    const end   = new Date(start.getTime() + (cfg.duracionMin||120)*60000);

  // Google Calendar
    const gcal = new URL("https://calendar.google.com/calendar/render");
    gcal.searchParams.set("action","TEMPLATE");
    gcal.searchParams.set("text", cfg.titulo);
    gcal.searchParams.set("details", cfg.detalles);
    gcal.searchParams.set("location", cfg.lugar);
    gcal.searchParams.set("ctz", cfg.zona);
    gcal.searchParams.set("dates", `${fmtGoogle(start)}/${fmtGoogle(end)}`);

  // ICS
    const ics =
    `BEGIN:VCALENDAR
    VERSION:2.0
    PRODID:-//SACY//Fiesta Rafaela//ES
    CALSCALE:GREGORIAN
    METHOD:PUBLISH
    BEGIN:VEVENT
    UID:${Date.now()}@sacy
    DTSTAMP:${fmtICS(new Date())}
    DTSTART:${fmtICS(start)}
    DTEND:${fmtICS(end)}
    SUMMARY:${cfg.titulo}
    DESCRIPTION:${cfg.detalles}
    LOCATION:${cfg.lugar}
    END:VEVENT
    END:VCALENDAR`;

    const blob = new Blob([ics], {type: "text/calendar;charset=utf-8"});
    const urlICS = URL.createObjectURL(blob);

    return { gcal: gcal.toString(), ics: urlICS };
}

// ====== Pinta enlaces al cargar ======
document.addEventListener("DOMContentLoaded", () => {
    const { gcal, ics } = buildCalendarLinks(CAL_CFG);

    const aGoogle = document.getElementById("lnkGoogleCal");
    if (aGoogle) aGoogle.href = gcal;

    const aICS = document.getElementById("lnkICS");
    if (aICS)  aICS.href = ics;
});

// ===== Abrir en Google Maps =====
(function setupAbrirMaps(){
    const btn = document.getElementById('btnAbrirMaps');
    if (!btn) return;

    // 1) Link de compartir: el más confiable
    if (CONFIG.mapsLink) {
        btn.href = CONFIG.mapsLink;
        return;
    }

    // 2) Coordenadas exactas (si algún día las pones)
    if (CONFIG.mapsLat && CONFIG.mapsLng) {
        btn.href = `https://www.google.com/maps/dir/?api=1&destination=${CONFIG.mapsLat},${CONFIG.mapsLng}`;
        return;
    }

    // 3) place_id (opcional)
    if (CONFIG.mapsPlaceId) {
        btn.href = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(CONFIG.lugar)}&query_place_id=${CONFIG.mapsPlaceId}`;
        return;
    }

    // 4) Fallback: intenta del embed o por nombre
    function extractLatLng(embedUrl){
        if (!embedUrl) return null;
        const mLng = embedUrl.match(/!2d(-?\d+\.?\d*)/); // long
        const mLat = embedUrl.match(/!3d(-?\d+\.?\d*)/); // lat
        return (mLng && mLat) ? { lat: mLat[1], lng: mLng[1] } : null;
    }
    const coords = extractLatLng(CONFIG.mapsEmbed);
    btn.href = coords
        ? `https://www.google.com/maps/dir/?api=1&destination=${coords.lat},${coords.lng}`
        : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(CONFIG.lugar)}`;
})();


// Botón "Volver arriba"
(function () {
    const toTop = document.getElementById('toTop');
    if (!toTop) return;

    const showAfter = 600; // px
    const show = () => {
        toTop.style.opacity = '1';
        toTop.style.transform = 'translateY(0)';
        toTop.style.boxShadow = '0 10px 28px rgba(79,138,109,.25)';
    };
    const hide = () => {
        toTop.style.opacity = '0';
        toTop.style.transform = 'translateY(6px)';
        toTop.style.boxShadow = 'none';
    };
    const toggle = () => (window.scrollY > showAfter ? show() : hide());

    toggle();
    window.addEventListener('scroll', toggle);
    toTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
    toTop.addEventListener('mouseenter', () => (toTop.style.boxShadow = '0 14px 36px rgba(79,138,109,.32)'));
    toTop.addEventListener('mouseleave', () => (toTop.style.boxShadow = '0 10px 28px rgba(79,138,109,.25)'));
})();

// ==========================
// Música de fondo (autoplay con mute + unlock con primer gesto + reanudar tras video)
// ==========================
(function setupBackgroundMusic(){
    const btn   = document.getElementById('btnMusicFloat');
    const icon  = document.getElementById('iconMusic');
    const audio = document.getElementById('bgMusic');
    const video = document.getElementById('videoAbue');
    if (!btn || !audio) return;

    // Fuente desde tu CONFIG
    if (CONFIG?.musicUrl) audio.src = CONFIG.musicUrl;

    // Preferencia del usuario (true por defecto)
    const PREF_KEY = 'musicEnabled';
    const wantsMusic = () => localStorage.getItem(PREF_KEY) !== 'false';
    const setWantsMusic = (val) => localStorage.setItem(PREF_KEY, val ? 'true' : 'false');

    const TARGET_VOL = 0.75;
    audio.volume = TARGET_VOL;       // volumen lógico
    audio.loop = true;
    audio.preload = 'auto';

    // UI del botón
    function setBtnState(playing){
        btn.setAttribute('aria-pressed', playing ? 'true' : 'false');
        btn.classList.toggle('btn-warning', playing);
        btn.classList.toggle('btn-outline-secondary', !playing);
        icon.classList.toggle('bi-music-note-beamed', playing);
        icon.classList.toggle('bi-volume-mute', !playing);
    }
    function showBtn(){
        btn.style.opacity = '1';
        btn.style.transform = 'translateY(0)';
    }
    function hideBtn(){
        btn.style.opacity = '0';
        btn.style.transform = 'translateY(6px)';
    }
    const showAfter = 600;
    const toggleFloaters = () => (window.scrollY > showAfter ? (showBtn(),0) : (hideBtn(),0));
    toggleFloaters(); window.addEventListener('scroll', toggleFloaters);

    // Fade de volumen suave
    function fadeTo(targetVol = 0, ms = 280){
        targetVol = Math.max(0, Math.min(1, targetVol));
        const steps = 10, stepTime = Math.max(16, Math.floor(ms/steps));
        const delta = (targetVol - audio.volume) / steps;
        return new Promise(res => {
        let i = 0;
        const it = setInterval(() => {
            i++;
            audio.volume = Math.max(0, Math.min(1, audio.volume + delta));
            if (i >= steps) { clearInterval(it); audio.volume = targetVol; res(); }
        }, stepTime);
        });
    }

    // iOS/Safari: "desbloquea" la cadena de audio con Web Audio en el primer gesto
    let audioCtx;
    async function primeAudioChain(){
        try{
        const Ctx = window.AudioContext || window.webkitAudioContext;
        if (!Ctx) return;
        audioCtx = audioCtx || new Ctx();
        if (audioCtx.state === 'suspended') await audioCtx.resume();

        // fuente silenciosa 1 sample para "primar" la sesión de audio
        const buf = audioCtx.createBuffer(1, 1, audioCtx.sampleRate);
        const src = audioCtx.createBufferSource();
        src.buffer = buf; src.connect(audioCtx.destination); src.start(0);
        }catch{}
    }

    // Autoplay seguro: arranca muteado (permitido en todos)
    async function autoplayMuted(){
        try{
        audio.muted = true;         // clave para que el autoplay no sea bloqueado
        await audio.play();
        setBtnState(true);
        return true;
        }catch{
        setBtnState(false);
        return false;
        }
    }

    // Unmute con fade (usa tras el primer gesto o cuando el user toca el botón)
    async function unmuteWithFade(){
        try{
        audio.muted = false;
        if (audio.paused) await audio.play();  // en iOS puede requerir este play explícito
        audio.volume = 0;
        await fadeTo(TARGET_VOL, 320);
        setBtnState(true);
        }catch{
        // si algo falla, mantenemos el estado visual coherente
        setBtnState(false);
        }
    }

    // Pausa bonita
    async function pauseMusic(){
        try{
        await fadeTo(0, 160);
        audio.pause();
        setBtnState(false);
        }finally{
        audio.volume = TARGET_VOL; // deja listo para la próxima
        }
    }

    // Primer gesto global = desbloqueo + desmute si el user quiere música
    function installGlobalUnlockOnce(){
        const doc = document;
        const unlock = async () => {
        doc.removeEventListener('pointerdown', unlock, true);
        doc.removeEventListener('keydown', unlock, true);
        await primeAudioChain();
        if (wantsMusic()){
            await unmuteWithFade();
        }
        };
        // pointerdown cubre click y touch en iOS/Android
        doc.addEventListener('pointerdown', unlock, true);
        // keydown por si es desktop
        doc.addEventListener('keydown', unlock, true);
    }

    // Click del botón flotante: toggle
    btn.addEventListener('click', async () => {
        if (audio.paused || audio.muted){
        setWantsMusic(true);
        await primeAudioChain();
        // Si no está reproduciendo (o está muteado), asegúrate de ponerlo a andar y desmutear
        if (audio.paused) {
            try{ await audio.play(); }catch{}
        }
        await unmuteWithFade();
        }else{
        setWantsMusic(false);
        await pauseMusic();
        audio.muted = true; // evita bloqueos en el siguiente arranque
        }
    });

    // Reanudar música tras pausar/terminar el video (solo si estaba activa)
    let resumeAfterVideo = false;
    if (video){
        video.addEventListener('play', async () => {
        resumeAfterVideo = !audio.paused && wantsMusic();
        if (resumeAfterVideo) await pauseMusic();
        });
        const tryResume = async () => {
        if (resumeAfterVideo && wantsMusic()){
            await primeAudioChain();
            // Asegura reproducción y desmute con fade
            try{ await audio.play(); }catch{}
            await unmuteWithFade();
        }
        resumeAfterVideo = false;
        };
        video.addEventListener('pause', tryResume);
        video.addEventListener('ended', tryResume);
    }

    // Arranque
    (async function boot(){
        // Estado inicial del botón
        setBtnState(wantsMusic());

        // Intenta autoplay (muteado, permitido por políticas)
        if (wantsMusic()){
        await autoplayMuted();
        }else{
        // Si el user la tenía apagada, mantenla pausada/muteada
        try{ audio.pause(); }catch{}
        audio.muted = true;
        setBtnState(false);
        }

        // Instala el “unlock” del primer gesto para desmutear con fade
        installGlobalUnlockOnce();

        // Si el audio se cargó posterior al play, reintenta (algunas veces iOS requiere canplay)
        audio.addEventListener('canplay', async ()=>{
        if (wantsMusic() && audio.paused){
            try{ await audio.play(); }catch{}
        }
        });
    })();
})();




// ===== Álbum paginado + lightbox =====
document.addEventListener('DOMContentLoaded', () => {
    // Lista de fotos del álbum 
    const ALBUM = [
        'img/album/Rafita_A1.jpeg', 'img/album/Rafita_A2.jpeg', 'img/album/Rafita_A3.jpeg', 'img/album/Rafita_A4.jpeg', 'img/album/Rafita_A5.jpeg', 'img/album/Rafita_A6.jpeg',
        'img/album/Rafita_A7.jpeg', 'img/album/Rafita_A8.jpeg', 'img/album/Rafita_A9.jpeg', 'img/album/Rafita_A10.jpg', 'img/album/Rafita_A11.jpeg', 'img/album/Rafita_A12.jpeg',
        'img/album/Rafita_A13.jpeg', 'img/album/Rafita_A14.jpeg', 'img/album/Rafita_A15.jpeg', 'img/album/Rafita_A16.jpeg', 'img/album/Rafita_A17.jpeg', 'img/album/Rafita_A18.jpeg',
        'img/album/Rafita_A19.jpeg', 'img/album/Rafita_A20.jpeg', 'img/album/Rafita_A21.jpeg', 'img/album/Rafita_A22.jpeg', 'img/album/Rafita_A23.jpeg', 'img/album/Rafita_A24.jpeg',
        'img/album/Rafita_A25.jpeg', 'img/album/Rafita_A26.jpeg', 'img/album/Rafita_A27.jpeg', 'img/album/Rafita_A28.jpeg', 'img/album/Rafita_A29.jpeg', 'img/album/Rafita_A30.jpeg',
        'img/album/Rafita_A31.jpeg', 'img/album/Rafita_A32.jpeg', 'img/album/Rafita_A33.jpeg', 'img/album/Rafita_A34.jpeg', 'img/album/Rafita_A35.jpeg', 'img/album/Rafita_A36.jpeg',
        'img/album/Rafita_A37.jpeg', 'img/album/Rafita_A38.jpeg', 'img/album/Rafita_A39.jpeg', 'img/album/Rafita_A40.jpeg', 'img/album/Rafita_A41.jpeg', 'img/album/Rafita_A42.jpeg',
        'img/album/Rafita_A43.jpeg', 'img/album/Rafita_A44.jpeg', 'img/album/Rafita_A45.jpeg', 'img/album/Rafita_A46.jpeg', 'img/album/Rafita_A47.jpeg', 'img/album/Rafita_A48.jpeg',
        'img/album/Rafita_A49.jpeg', 'img/album/Rafita_A50.jpeg', 'img/album/Rafita_A51.jpeg', 'img/album/Rafita_A52.jpeg', 'img/album/Rafita_A53.jpeg', 'img/album/Rafita_A54.jpeg',
        'img/album/Rafita_A55.jpeg', 'img/album/Rafita_A56.jpeg', 'img/album/Rafita_A57.jpeg', 'img/album/Rafita_A58.jpeg', 'img/album/Rafita_A59.jpeg', 'img/album/Rafita_A60.jpeg',
        'img/album/Rafita_A61.jpeg', 'img/album/Rafita_A62.jpg', 'img/album/Rafita_A63.jpg', 'img/album/Rafita_A64.jpg', 'img/album/Rafita_A65.jpg', 'img/album/Rafita_A66.jpeg',
    ];

    const PER_PAGE = 6; // 6 miniaturas por página
    const chunk = (arr, size) => Array.from({length: Math.ceil(arr.length/size)}, (_,i)=> arr.slice(i*size, i*size+size));

    // DOM refs
    const pager = document.getElementById('albumPager');
    const inner = pager?.querySelector('.carousel-inner');
    const indicators = pager?.querySelector('.carousel-indicators');
    const counter = document.getElementById('albumPageCounter');
    const lbInner = document.querySelector('#lightboxCarousel .carousel-inner');
    const lbEl = document.getElementById('lightboxModal');

    if (!pager || !inner || !indicators || !lbInner || !lbEl) return;

    // Construye "páginas" (slides del carrusel) con grid 3x2
    const pages = chunk(ALBUM, PER_PAGE);
    inner.innerHTML = '';
    indicators.innerHTML = '';

    pages.forEach((page, pageIndex) => {
        // Slide
        const item = document.createElement('div');
        item.className = 'carousel-item' + (pageIndex === 0 ? ' active' : '');

        // Grid responsive: 2 por fila en XS, 3 por fila en MD+
        const row = document.createElement('div');
        row.className = 'row g-3';

        page.forEach((src, i) => {
        const globalIdx = pageIndex * PER_PAGE + i;
        const col = document.createElement('div');
        col.className = 'col-6 col-md-4';

        const a = document.createElement('a');
        a.href = '#';
        a.setAttribute('data-bs-toggle','modal');
        a.setAttribute('data-bs-target','#lightboxModal');
        a.dataset.albumIdx = String(globalIdx);

        const img = document.createElement('img');
        img.src = src;
        img.alt = `Foto ${globalIdx + 1}`;
        img.className = 'img-fluid rounded shadow-sm';
        img.loading = 'lazy';
        img.decoding = 'async';
        // Mantén proporción bonita sin CSS externo
        img.style = 'width:100%; aspect-ratio:4/3; object-fit:cover;';

        a.append(img);
        col.append(a);
        row.append(col);
        });

        item.append(row);
        inner.append(item);

        // Indicador
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.setAttribute('data-bs-target','#albumPager');
        btn.setAttribute('data-bs-slide-to', String(pageIndex));
        btn.ariaLabel = `Página ${pageIndex+1}`;
        if (pageIndex === 0) btn.classList.add('active');
        indicators.append(btn);
    });

    // Contador "Página X de Y"
    const pagerInstance = bootstrap.Carousel.getOrCreateInstance(pager);
    const setCounter = (idx=0) => counter.textContent = `Página ${idx+1} de ${pages.length}`;
    setCounter(0);
    pager.addEventListener('slid.bs.carousel', e => {
        if (typeof e.to === 'number') setCounter(e.to);
    });

    // Lightbox: construye TODAS las diapositivas una sola vez
    lbInner.innerHTML = '';
    ALBUM.forEach((src, idx) => {
        const item = document.createElement('div');
        item.className = 'carousel-item' + (idx === 0 ? ' active' : '');

        const ratio = document.createElement('div');
        ratio.className = 'ratio ratio-16x9 bg-black protect';

        const big = document.createElement('img');
        big.src = src;
        big.alt = `Foto ${idx+1}`;
        big.className = 'w-100 h-100 object-fit-contain';
        big.loading = 'lazy';
        big.decoding = 'async';

        ratio.append(big);
        item.append(ratio);
        lbInner.append(item);
    });

    // Desactivar arrastre y clic derecho en las imágenes del lightbox
    document.querySelectorAll('#lightboxCarousel img').forEach(img => {
    img.style.pointerEvents = 'none';
    img.setAttribute('draggable','false');
    });


    // Al hacer click en miniatura, abrir el lightbox en ese índice global
    document.querySelectorAll('[data-album-idx]').forEach(a => {
        a.addEventListener('click', (ev) => {
            ev.preventDefault(); // evita el salto por "#"
            const idx = Number(a.dataset.albumIdx || 0);
            const car = bootstrap.Carousel.getOrCreateInstance(document.getElementById('lightboxCarousel'));
            car.to(idx);
        });
    });

    // Reset al cerrar
    lbEl.addEventListener('hidden.bs.modal', () => {
        const car = bootstrap.Carousel.getOrCreateInstance(document.getElementById('lightboxCarousel'));
        car.pause();
    });
});

// ==== Anti-copia básica (barrera suave) ====
(function antiCopy(){
    // Bloquea clic derecho SOLO sobre imágenes, video, carruseles y modal
    document.addEventListener('contextmenu', (e) => {
        if (e.target.closest('img, video, .protect, #lightboxModal')) e.preventDefault();
    });

    // Evita arrastrar/soltar medios
    document.addEventListener('dragstart', (e) => {
        if (e.target.closest('img, video')) e.preventDefault();
    });
    document.querySelectorAll('img, video').forEach(el => el.setAttribute('draggable','false'));

    // Bloquea algunos atajos típicos (Cmd/Ctrl+S, +P, +U)
    document.addEventListener('keydown', (e) => {
        const k = (e.key || '').toLowerCase();
        if ((e.ctrlKey || e.metaKey) && ['s','p','u'].includes(k)) e.preventDefault();
    });
})();

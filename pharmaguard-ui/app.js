// PharmaGuard SN — interface de l'application
// Servie par l'API (port 8000) : chemin relatif. Ouverte autrement : on vise localhost:8000.
const API_BASE = location.port === "8000" ? "/api/v1" : "http://localhost:8000/api/v1";

const NIVEAUX = {
    0: { label: "Aucune interaction", court: "Aucune", badge: "badge-green", icon: "fa-shield-halved" },
    1: { label: "Information", court: "Information", badge: "badge-blue", icon: "fa-circle-info" },
    2: { label: "Précaution d'emploi", court: "Précaution", badge: "badge-amber", icon: "fa-circle-exclamation" },
    3: { label: "Association déconseillée", court: "Déconseillée", badge: "badge-orange", icon: "fa-triangle-exclamation" },
    4: { label: "Contre-indication", court: "Contre-indication", badge: "badge-red", icon: "fa-ban" },
};
const niveau = n => NIVEAUX[n] || NIVEAUX[0];

const state = {
    medicaments: [],
    lastAnalyse: null,
    currentInteraction: null,
    currentDetail: null,
    historique: [],
};

const $ = id => document.getElementById(id);

// Échappe le texte avant insertion via innerHTML (noms de patients saisis librement)
function esc(value) {
    return String(value ?? "").replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
}

// ====== API ======
async function api(path, options = {}) {
    let response;
    try {
        response = await fetch(`${API_BASE}${path}`, {
            ...options,
            headers: options.body ? { "Content-Type": "application/json" } : undefined,
        });
    } catch {
        setApiStatus(false);
        throw new Error("Serveur injoignable. Lancez START_DEMO.bat.");
    }
    setApiStatus(true);
    const data = await response.json().catch(() => null);
    if (!response.ok) {
        const detail = data?.detail;
        const msg = Array.isArray(detail) ? detail.map(d => d.msg).join(", ") : detail;
        throw new Error(msg || `Erreur serveur (${response.status})`);
    }
    return data;
}

function setApiStatus(ok) {
    $("api-banner").classList.toggle("hidden", ok);
}

// ====== NAVIGATION ======
const VIEWS = {
    "view-dashboard": { nav: "nav-dashboard", title: "Tableau de bord", subtitle: "Vue d'ensemble des analyses" },
    "view-analyse": { nav: "nav-analyse", title: "Nouvelle analyse", subtitle: "Saisie et vérification d'une ordonnance" },
    "view-historique": { nav: "nav-historique", title: "Historique", subtitle: "Analyses enregistrées depuis le démarrage du serveur" },
};

function switchView(viewId) {
    const info = VIEWS[viewId];
    if (!info) return;
    document.querySelectorAll(".view").forEach(el => el.classList.toggle("active", el.id === viewId));
    document.querySelectorAll(".nav-item").forEach(el => el.classList.toggle("active", el.id === info.nav));
    $("page-title").textContent = info.title;
    $("page-subtitle").textContent = info.subtitle;

    if (viewId === "view-dashboard") loadDashboard();
    if (viewId === "view-historique") loadHistorique();
    if (viewId === "view-analyse") $("patient-name").focus();
}

// ====== DATES ======
function formatDate(iso) {
    const d = new Date(iso);
    if (isNaN(d)) return "—";
    const heure = d.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" });
    const jour = x => new Date(x.getFullYear(), x.getMonth(), x.getDate()).getTime();
    const ecart = Math.round((jour(new Date()) - jour(d)) / 86400000);
    if (ecart === 0) return `Aujourd'hui, ${heure}`;
    if (ecart === 1) return `Hier, ${heure}`;
    return d.toLocaleDateString("fr-FR", { day: "2-digit", month: "2-digit", year: "numeric" });
}

function initiales(nom) {
    return nom.split(/\s+/).filter(Boolean).map(w => w[0]).join("").toUpperCase().slice(0, 2) || "?";
}

// ====== DASHBOARD ======
async function loadDashboard() {
    let data;
    try {
        data = await api("/historique");
    } catch {
        $("recent-list").innerHTML = '<p class="empty-state">Historique indisponible : serveur injoignable.</p>';
        return;
    }
    state.historique = data;
    const majeures = data.reduce((n, a) => n + a.interactions.filter(i => i.niveau >= 3).length, 0);
    const sansRisque = data.filter(a => a.niveau_max <= 1).length;

    $("stat-analyses").textContent = data.length;
    $("stat-interactions").textContent = majeures;
    $("stat-securisees").textContent = data.length ? `${Math.round((sansRisque / data.length) * 100)} %` : "—";

    renderRecentList(data.slice(0, 5));
}

function renderRecentList(analyses) {
    const list = $("recent-list");
    list.innerHTML = "";
    if (!analyses.length) {
        list.innerHTML = '<p class="empty-state">Aucune analyse pour le moment.</p>';
        return;
    }
    analyses.forEach(a => {
        const n = niveau(a.niveau_max);
        const row = document.createElement("div");
        row.className = "list-item clickable";
        row.innerHTML = `
            <div class="item-info">
                <div class="avatar-patient">${esc(initiales(a.patient_nom))}</div>
                <div>
                    <h4>${esc(a.patient_nom)}</h4>
                    <span class="date">${formatDate(a.date)} · ${a.nb_medicaments} médicament(s)</span>
                </div>
            </div>
            <span class="badge ${n.badge}"><i class="fa-solid ${n.icon}"></i> ${n.court}</span>`;
        row.addEventListener("click", () => openAnalyseDetail(a));
        list.appendChild(row);
    });
}

// ====== AUTOCOMPLÉTION ======
const medsInput = $("meds-input");
const autocompleteList = $("autocomplete-list");
let searchTimeout = null;
let searchSeq = 0;

function hideAutocomplete() {
    autocompleteList.style.display = "none";
    autocompleteList.innerHTML = "";
}

medsInput.addEventListener("input", () => {
    const q = medsInput.value.trim();
    clearTimeout(searchTimeout);
    if (q.length < 2) return hideAutocomplete();
    searchTimeout = setTimeout(async () => {
        const seq = ++searchSeq;
        try {
            const results = await api(`/medicaments/search?q=${encodeURIComponent(q)}`);
            if (seq === searchSeq) renderAutocomplete(results);  // ignore les réponses obsolètes
        } catch (err) {
            showToast(err.message, "error");
        }
    }, 200);
});

medsInput.addEventListener("keydown", e => {
    if (e.key === "Enter") {
        e.preventDefault();
        autocompleteList.querySelector(".autocomplete-item")?.click();
    }
});

function renderAutocomplete(results) {
    autocompleteList.innerHTML = "";
    if (!results.length) {
        autocompleteList.innerHTML = '<div class="autocomplete-empty">Aucun médicament trouvé dans la base de démo</div>';
        autocompleteList.style.display = "block";
        return;
    }
    results.forEach(med => {
        const item = document.createElement("div");
        item.className = "autocomplete-item";
        item.innerHTML = `<div><strong>${esc(med.nom_commercial)}</strong><br><small>${esc(med.dci)}</small></div>
                          <span>${esc(med.classe)}</span>`;
        item.addEventListener("click", () => {
            addMedicament(med);
            medsInput.value = "";
            hideAutocomplete();
            medsInput.focus();
        });
        autocompleteList.appendChild(item);
    });
    autocompleteList.style.display = "block";
}

// ====== ORDONNANCE ======
function addMedicament(med) {
    if (!state.medicaments.some(m => m.nom_commercial === med.nom_commercial)) {
        state.medicaments.push(med);
    }
    renderMedsList();
}

function removeMedicament(index) {
    state.medicaments.splice(index, 1);
    renderMedsList();
}

function renderMedsList() {
    const container = $("meds-list");
    container.innerHTML = "";
    const vide = state.medicaments.length === 0;
    $("empty-meds").style.display = vide ? "block" : "none";
    $("btn-analyser").disabled = vide;

    state.medicaments.forEach((med, index) => {
        const tag = document.createElement("div");
        tag.className = "med-tag";
        tag.innerHTML = `
            <div class="med-tag-info">
                <h5><i class="fa-solid fa-capsules"></i> ${esc(med.nom_commercial)}</h5>
                <small>${esc(med.dci)}</small>
            </div>
            <button class="remove-med" title="Retirer"><i class="fa-solid fa-trash"></i></button>`;
        tag.querySelector("button").addEventListener("click", () => removeMedicament(index));
        container.appendChild(tag);
    });
}

function resetAnalyse() {
    state.medicaments = [];
    state.lastAnalyse = null;
    $("patient-name").value = "";
    $("patient-age").value = "";
    renderMedsList();
    showPanel("initial-state");
    $("patient-name").focus();
}

function showPanel(id) {
    ["initial-state", "loader", "results-container"].forEach(p => $(p).classList.toggle("hidden", p !== id));
}

// ====== ANALYSE ======
$("btn-analyser").addEventListener("click", async () => {
    const age = parseInt($("patient-age").value, 10);
    const payload = {
        patient_nom: $("patient-name").value.trim() || "Patient non renseigné",
        patient_age: Number.isFinite(age) ? age : null,
        medicaments: state.medicaments.map(m => ({ nom: m.nom_commercial })),
    };

    $("btn-analyser").disabled = true;
    showPanel("loader");
    try {
        const data = await api("/analyse", { method: "POST", body: JSON.stringify(payload) });
        state.lastAnalyse = data;
        renderResults(data);
        showPanel("results-container");
        loadNotifications();
    } catch (err) {
        showToast(err.message, "error");
        showPanel("initial-state");
    } finally {
        $("btn-analyser").disabled = state.medicaments.length === 0;
    }
});

function alertCard(inter, { full = false } = {}) {
    const n = niveau(inter.niveau);
    const card = document.createElement("div");
    card.className = `alert-card alert-${inter.niveau}`;
    card.innerHTML = `
        <div class="alert-header">
            <i class="fa-solid ${n.icon}"></i>
            <span class="alert-title">${esc(inter.label)}</span>
            <span class="alert-level">Niveau ${inter.niveau}</span>
        </div>
        <div class="alert-body">
            <div class="alert-mols">${esc(inter.dci_a)} <span>×</span> ${esc(inter.dci_b)}</div>
            <p class="alert-desc ${full ? "" : "clamp"}">${esc(inter.mecanisme)}</p>
            <div class="alert-meta">
                <span class="source-mini"><i class="fa-solid fa-book-medical"></i> ${esc(inter.source)}</span>
                <span class="alert-link">Détails <i class="fa-solid fa-arrow-right"></i></span>
            </div>
        </div>`;
    card.addEventListener("click", () => openModal(inter));
    return card;
}

function emptyCard(message) {
    const card = document.createElement("div");
    card.className = "alert-card alert-0 static";
    card.innerHTML = `
        <div class="alert-header"><i class="fa-solid fa-shield-halved"></i><span class="alert-title">Aucune interaction</span></div>
        <div class="alert-body"><p class="alert-desc">${esc(message)}</p></div>`;
    return card;
}

function renderResults(data) {
    const list = $("alerts-list");
    list.innerHTML = "";

    const title = $("results-title");
    const n = niveau(data.niveau_max);
    title.className = `results-title level-${data.niveau_max}`;
    title.innerHTML = data.nb_interactions
        ? `<i class="fa-solid ${n.icon}"></i> ${data.nb_interactions} interaction${data.nb_interactions > 1 ? "s" : ""} détectée${data.nb_interactions > 1 ? "s" : ""}`
        : `<i class="fa-solid fa-shield-halved"></i> Aucune interaction détectée`;

    const summary = document.createElement("p");
    summary.className = "results-summary";
    summary.textContent = `${data.patient_nom} · ${data.nb_medicaments} médicament(s) · ${data.message}`;
    list.appendChild(summary);

    if (data.non_reconnus?.length) {
        const warn = document.createElement("div");
        warn.className = "inline-warning";
        warn.innerHTML = `<i class="fa-solid fa-circle-question"></i> Non reconnu(s), non analysé(s) : ${data.non_reconnus.map(esc).join(", ")}`;
        list.appendChild(warn);
    }

    if (!data.interactions.length) list.appendChild(emptyCard(data.message));
    data.interactions.forEach(inter => list.appendChild(alertCard(inter)));
}

// ====== MODALE INTERACTION ======
function openModal(inter) {
    state.currentInteraction = inter;
    const n = niveau(inter.niveau);
    $("modal-header").className = `modal-header level-${inter.niveau}`;
    $("modal-conduite-box").className = `modal-section alert-section level-${inter.niveau}`;
    $("modal-icon").className = `fa-solid ${n.icon}`;
    $("modal-title").textContent = `${inter.label} · niveau ${inter.niveau}`;
    $("modal-mol-a").textContent = inter.dci_a;
    $("modal-mol-b").textContent = inter.dci_b;
    $("modal-meca").textContent = inter.mecanisme;
    $("modal-conduite").textContent = inter.conduite;
    $("modal-source-text").textContent = inter.source;
    $("interaction-modal").classList.remove("hidden");
}

function closeModal() {
    $("interaction-modal").classList.add("hidden");
}

// ====== MODALE DÉTAIL D'ANALYSE ======
function openAnalyseDetail(analyse) {
    state.currentDetail = analyse;
    const n = niveau(analyse.niveau_max);
    $("analyse-modal-title").textContent = `Analyse — ${analyse.patient_nom}`;
    $("detail-patient").textContent = analyse.patient_nom;
    $("detail-age").textContent = analyse.patient_age != null ? `${analyse.patient_age} ans` : "Non renseigné";
    $("detail-date").textContent = formatDate(analyse.date);
    $("detail-niveau").innerHTML = `<span class="badge ${n.badge}"><i class="fa-solid ${n.icon}"></i> ${n.court}</span>`;

    const meds = $("detail-meds-list");
    meds.innerHTML = (analyse.medicaments || [])
        .map(m => `<span class="detail-med-tag"><i class="fa-solid fa-capsules"></i> ${esc(m)}</span>`)
        .join("");

    const list = $("detail-interactions-list");
    list.innerHTML = "";
    if (!analyse.interactions?.length) list.appendChild(emptyCard(analyse.message));
    (analyse.interactions || []).forEach(inter => list.appendChild(alertCard(inter, { full: true })));

    $("analyse-detail-modal").classList.remove("hidden");
}

function closeAnalyseModal() {
    $("analyse-detail-modal").classList.add("hidden");
}

// ====== IMPRESSION ======
function printHtml(html) {
    const container = $("print-container");
    container.innerHTML = html;
    window.addEventListener("afterprint", () => { container.innerHTML = ""; }, { once: true });
    window.print();
}

function reportHtml(analyse) {
    const now = new Date();
    return `
        <div class="print-report">
            <div class="print-header-report">
                <h1>PharmaGuard SN — Rapport d'analyse</h1>
                <p class="print-date">Imprimé le ${now.toLocaleDateString("fr-FR")} à ${now.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })}</p>
            </div>
            <div class="print-patient">
                <h2>${esc(analyse.patient_nom)}${analyse.patient_age != null ? `, ${analyse.patient_age} ans` : ""}</h2>
                <p>Analyse du ${new Date(analyse.date).toLocaleString("fr-FR")}</p>
                <p><strong>Médicaments :</strong> ${(analyse.medicaments || []).map(esc).join(", ")}</p>
                <p><strong>Conclusion :</strong> ${esc(analyse.message)}</p>
            </div>
            ${analyse.interactions.map(interactionHtml).join("") || "<p>Aucune interaction répertoriée.</p>"}
            ${disclaimerHtml()}
        </div>`;
}

function interactionHtml(inter) {
    return `
        <div class="print-interaction print-level-${inter.niveau}">
            <h3>Niveau ${inter.niveau} — ${esc(inter.label)} : ${esc(inter.dci_a)} × ${esc(inter.dci_b)}</h3>
            <p><strong>Mécanisme :</strong> ${esc(inter.mecanisme)}</p>
            <p><strong>Conduite à tenir :</strong> ${esc(inter.conduite)}</p>
            <p class="print-source">Source : ${esc(inter.source)}</p>
        </div>`;
}

function disclaimerHtml() {
    return `<div class="print-footer-report">Démonstration — données fictives et simplifiées, à ne pas utiliser pour une décision clinique.</div>`;
}

function exportResultsPDF() {
    if (!state.lastAnalyse) return showToast("Aucun résultat à exporter.", "warning");
    printHtml(reportHtml(state.lastAnalyse));
}

function printAnalyseDetail() {
    if (state.currentDetail) printHtml(reportHtml(state.currentDetail));
}

function printInteractionFiche() {
    const inter = state.currentInteraction;
    if (!inter) return;
    printHtml(`
        <div class="print-report">
            <div class="print-header-report">
                <h1>PharmaGuard SN — Fiche interaction</h1>
                <p class="print-date">Imprimé le ${new Date().toLocaleDateString("fr-FR")}</p>
            </div>
            ${interactionHtml(inter)}
            ${disclaimerHtml()}
        </div>`);
}

// ====== HISTORIQUE ======
async function loadHistorique() {
    try {
        state.historique = await api("/historique");
    } catch (err) {
        state.historique = [];
        showToast(err.message, "error");
    }
    filterHistorique();
}

function filterHistorique() {
    const q = $("historique-search").value.toLowerCase().trim();
    const data = !q ? state.historique : state.historique.filter(a =>
        a.patient_nom.toLowerCase().includes(q) ||
        (a.medicaments || []).some(m => m.toLowerCase().includes(q)));
    renderHistoriqueTable(data);
}

function renderHistoriqueTable(data) {
    const tbody = $("historique-tbody");
    tbody.innerHTML = "";
    $("historique-empty").classList.toggle("hidden", data.length > 0);

    data.forEach(a => {
        const n = niveau(a.niveau_max);
        const tr = document.createElement("tr");
        tr.className = "clickable-row";
        tr.innerHTML = `
            <td>
                <div class="cell-patient">
                    <div class="avatar-patient-sm">${esc(initiales(a.patient_nom))}</div>
                    <div>
                        <strong>${esc(a.patient_nom)}</strong>
                        <small>${a.patient_age != null ? `${a.patient_age} ans` : ""}</small>
                    </div>
                </div>
            </td>
            <td>${formatDate(a.date)}</td>
            <td><span class="count-badge">${a.nb_medicaments}</span></td>
            <td><span class="count-badge ${a.nb_interactions ? "count-danger" : ""}">${a.nb_interactions}</span></td>
            <td><span class="badge ${n.badge}">${n.court}</span></td>
            <td><button class="btn btn-sm btn-outline"><i class="fa-solid fa-eye"></i> Voir</button></td>`;
        tr.addEventListener("click", () => openAnalyseDetail(a));
        tbody.appendChild(tr);
    });
}

// ====== NOTIFICATIONS ======
async function loadNotifications() {
    let data;
    try {
        data = await api("/notifications");
    } catch {
        return;
    }
    const badge = $("notif-badge");
    badge.textContent = data.nb_non_lues;
    badge.style.display = data.nb_non_lues > 0 ? "flex" : "none";

    const list = $("notif-list");
    if (!data.notifications.length) {
        list.innerHTML = '<p class="empty-notif">Aucune notification</p>';
        return;
    }
    list.innerHTML = "";
    data.notifications.forEach(notif => {
        const n = niveau(notif.niveau);
        const item = document.createElement("div");
        item.className = `notif-item level-${notif.niveau} ${notif.lue ? "" : "notif-unread"}`;
        item.innerHTML = `
            <div class="notif-icon"><i class="fa-solid ${n.icon}"></i></div>
            <div class="notif-text">
                <strong>${esc(notif.titre)}</strong>
                <p>${esc(notif.message)}</p>
                <small>${formatDate(notif.date)}</small>
            </div>`;
        item.addEventListener("click", async () => {
            $("notif-dropdown").classList.add("hidden");
            if (!notif.lue) api(`/notifications/${notif.id}/read`, { method: "POST" }).then(loadNotifications).catch(() => {});
            try {
                openAnalyseDetail(await api(`/historique/${notif.analyse_id}`));
            } catch (err) {
                showToast(err.message, "error");
            }
        });
        list.appendChild(item);
    });
}

function toggleNotifications() {
    const dropdown = $("notif-dropdown");
    dropdown.classList.toggle("hidden");
    if (!dropdown.classList.contains("hidden")) loadNotifications();
}

async function markAllNotificationsRead() {
    try {
        await api("/notifications/read", { method: "POST" });
        loadNotifications();
    } catch (err) {
        showToast(err.message, "error");
    }
}

// ====== RECHERCHE GLOBALE ======
const globalSearch = $("global-search");
const searchDropdown = $("search-results-dropdown");
let globalTimeout = null;

globalSearch.addEventListener("input", () => {
    const q = globalSearch.value.trim().toLowerCase();
    clearTimeout(globalTimeout);
    if (q.length < 2) {
        searchDropdown.style.display = "none";
        return;
    }
    globalTimeout = setTimeout(() => runGlobalSearch(q), 200);
});

async function runGlobalSearch(q) {
    const results = [];
    try {
        const [hist, meds] = await Promise.all([api("/historique"), api(`/medicaments/search?q=${encodeURIComponent(q)}`)]);
        hist.filter(a => a.patient_nom.toLowerCase().includes(q)).forEach(a =>
            results.push({ icon: "fa-user", label: a.patient_nom, sub: `${formatDate(a.date)} · ${niveau(a.niveau_max).court}`, action: () => openAnalyseDetail(a) }));
        meds.forEach(m =>
            results.push({ icon: "fa-capsules", label: m.nom_commercial, sub: `${m.dci} · ajouter à l'ordonnance`, action: () => { switchView("view-analyse"); addMedicament(m); } }));
    } catch (err) {
        showToast(err.message, "error");
        return;
    }

    searchDropdown.innerHTML = results.length ? "" : '<div class="search-result-item"><p>Aucun résultat</p></div>';
    results.slice(0, 8).forEach(r => {
        const item = document.createElement("div");
        item.className = "search-result-item";
        item.innerHTML = `<i class="fa-solid ${r.icon}"></i><div><strong>${esc(r.label)}</strong><small>${esc(r.sub)}</small></div>`;
        item.addEventListener("click", () => {
            searchDropdown.style.display = "none";
            globalSearch.value = "";
            r.action();
        });
        searchDropdown.appendChild(item);
    });
    searchDropdown.style.display = "block";
}

// ====== TOAST ======
function showToast(message, type = "info") {
    document.querySelector(".toast")?.remove();
    const icons = { success: "fa-circle-check", error: "fa-circle-xmark", warning: "fa-triangle-exclamation", info: "fa-circle-info" };
    const toast = document.createElement("div");
    toast.className = `toast toast-${type}`;
    toast.innerHTML = `<i class="fa-solid ${icons[type] || icons.info}"></i> ${esc(message)}`;
    document.body.appendChild(toast);
    requestAnimationFrame(() => toast.classList.add("toast-visible"));
    setTimeout(() => {
        toast.classList.remove("toast-visible");
        setTimeout(() => toast.remove(), 300);
    }, 3500);
}

// ====== ÉVÉNEMENTS GLOBAUX ======
document.addEventListener("click", e => {
    if (!medsInput.parentElement.contains(e.target)) hideAutocomplete();
    if (!$("notif-dropdown").contains(e.target) && !$("notif-btn").contains(e.target)) $("notif-dropdown").classList.add("hidden");
    if (!globalSearch.parentElement.contains(e.target)) searchDropdown.style.display = "none";
});

// Clic sur le fond sombre = fermer la modale
["interaction-modal", "analyse-detail-modal"].forEach(id =>
    $(id).addEventListener("click", e => { if (e.target.id === id) $(id).classList.add("hidden"); }));

document.addEventListener("keydown", e => {
    if (e.key !== "Escape") return;
    // Ferme d'abord la modale du dessus
    if (!$("interaction-modal").classList.contains("hidden")) closeModal();
    else closeAnalyseModal();
    $("notif-dropdown").classList.add("hidden");
    hideAutocomplete();
});

document.querySelectorAll(".nav-item[data-view]").forEach(link =>
    link.addEventListener("click", e => { e.preventDefault(); switchView(link.dataset.view); }));

loadDashboard();
loadNotifications();

(function () {
    const STORAGE_KEY = "snippet_pocket_mobile_config_v2";
    const DEFAULT_API_BASE = window.location.origin;
    const state = {
        items: [],
        filtered: [],
        currentFilter: "all",
        sortAsc: false,
        config: {
            apiBase: DEFAULT_API_BASE,
            email: "",
            authToken: "",
            authUserId: "",
            language: "pt-BR",
            linkPreviewEnabled: true,
            summarizeEnabled: true,
            aiProvider: "perplexity"
        }
    };

    const el = {
        settingsPanel: document.getElementById("settingsPanel"),
        settingsModal: document.getElementById("settingsModal"),
        toggleSettingsBtn: document.getElementById("toggleSettingsBtn"),
        closeSettingsModalBtn: document.getElementById("closeSettingsModalBtn"),
        addModal: document.getElementById("addModal"),
        openAddModalBtn: document.getElementById("openAddModalBtn"),
        closeAddModalBtn: document.getElementById("closeAddModalBtn"),
        sortBtn: document.getElementById("sortBtn"),
        languageSelect: document.getElementById("languageSelect"),
        linkPreviewToggle: document.getElementById("linkPreviewToggle"),
        summarizeToggle: document.getElementById("summarizeToggle"),
        aiProviderGroup: document.getElementById("aiProviderGroup"),
        aiProviderSelect: document.getElementById("aiProviderSelect"),
        authScreen: document.getElementById("authScreen"),
        appContent: document.getElementById("appContent"),
        authTabSignIn: document.getElementById("authTabSignIn"),
        authTabSignUp: document.getElementById("authTabSignUp"),
        authSignInForm: document.getElementById("authSignInForm"),
        authSignUpForm: document.getElementById("authSignUpForm"),
        authSignInEmail: document.getElementById("authSignInEmail"),
        authSignInPassword: document.getElementById("authSignInPassword"),
        authSignUpEmail: document.getElementById("authSignUpEmail"),
        authSignUpPassword: document.getElementById("authSignUpPassword"),
        authScreenStatus: document.getElementById("authScreenStatus"),
        apiBaseInput: document.getElementById("apiBaseInput"),
        emailInput: document.getElementById("emailInput"),
        passwordInput: document.getElementById("passwordInput"),
        saveConfigBtn: document.getElementById("saveConfigBtn"),
        registerBtn: document.getElementById("registerBtn"),
        loginBtn: document.getElementById("loginBtn"),
        logoutBtn: document.getElementById("logoutBtn"),
        syncBtn: document.getElementById("syncBtn"),
        saveSettingsBtn: document.getElementById("saveSettingsBtn"),
        exportBtn: document.getElementById("exportBtn"),
        importBtn: document.getElementById("importBtn"),
        importFile: document.getElementById("importFile"),
        urlInput: document.getElementById("urlInput"),
        titleInput: document.getElementById("titleInput"),
        tagsInput: document.getElementById("tagsInput"),
        addBtn: document.getElementById("addBtn"),
        searchInput: document.getElementById("searchInput"),
        listTabs: document.querySelectorAll("#tabs .tab-btn"),
        authStatus: document.getElementById("authStatus"),
        syncStatus: document.getElementById("syncStatus"),
        listContainer: document.getElementById("listContainer"),
        countBadge: document.getElementById("countBadge"),
        toast: document.getElementById("toast")
    };

    function showToast(message) {
        el.toast.textContent = message;
        el.toast.classList.remove("hidden");
        clearTimeout(showToast._timeout);
        showToast._timeout = setTimeout(() => el.toast.classList.add("hidden"), 2500);
    }

    function normalizeBase(url) {
        return (url || "").trim().replace(/\/+$/, "");
    }

    function parseTags(value) {
        return (value || "")
            .split(",")
            .map((tag) => tag.trim())
            .filter(Boolean);
    }

    function loadConfig() {
        try {
            const raw = localStorage.getItem(STORAGE_KEY);
            if (!raw) return;
            const parsed = JSON.parse(raw);
            state.config.apiBase = normalizeBase(parsed.apiBase || DEFAULT_API_BASE) || DEFAULT_API_BASE;
            state.config.email = parsed.email || "";
            state.config.authToken = parsed.authToken || "";
            state.config.authUserId = parsed.authUserId || "";
            state.config.language = parsed.language || "pt-BR";
            state.config.linkPreviewEnabled = parsed.linkPreviewEnabled !== false;
            state.config.summarizeEnabled = parsed.summarizeEnabled !== false;
            state.config.aiProvider = parsed.aiProvider || "perplexity";
        } catch (error) {
            console.error("Erro ao carregar config:", error);
        }
    }

    function saveConfig() {
        if (el.apiBaseInput && el.apiBaseInput.value) {
            state.config.apiBase = normalizeBase(el.apiBaseInput.value);
        }
        if (!state.config.apiBase) {
            state.config.apiBase = DEFAULT_API_BASE;
        }
        if (el.emailInput && el.emailInput.value) {
            state.config.email = (el.emailInput.value || "").trim().toLowerCase();
        }
        if (el.languageSelect) {
            state.config.language = el.languageSelect.value || "pt-BR";
        }
        if (el.linkPreviewToggle) {
            state.config.linkPreviewEnabled = Boolean(el.linkPreviewToggle.checked);
        }
        if (el.summarizeToggle) {
            state.config.summarizeEnabled = Boolean(el.summarizeToggle.checked);
        }
        if (el.aiProviderSelect) {
            state.config.aiProvider = el.aiProviderSelect.value || "perplexity";
        }

        localStorage.setItem(STORAGE_KEY, JSON.stringify(state.config));
        applyLanguage();
        updateAiProviderVisibility();
        render();
        showToast("Configuração salva");
    }

    function fillConfigInputs() {
        if (el.apiBaseInput) {
            el.apiBaseInput.value = state.config.apiBase;
            el.apiBaseInput.readOnly = true;
        }
        if (el.emailInput) {
            el.emailInput.value = state.config.email;
        }
        if (el.languageSelect) {
            el.languageSelect.value = state.config.language || "pt-BR";
        }
        if (el.linkPreviewToggle) {
            el.linkPreviewToggle.checked = state.config.linkPreviewEnabled !== false;
        }
        if (el.summarizeToggle) {
            el.summarizeToggle.checked = state.config.summarizeEnabled !== false;
        }
        if (el.aiProviderSelect) {
            el.aiProviderSelect.value = state.config.aiProvider || "perplexity";
        }
        updateAiProviderVisibility();
        applyLanguage();
        updateAuthStatus();
    }

    function updateAiProviderVisibility() {
        if (!el.aiProviderGroup || !el.summarizeToggle) return;
        el.aiProviderGroup.classList.toggle("hidden", !el.summarizeToggle.checked);
    }

    function applyLanguage() {
        if (state.config.language) {
            document.documentElement.lang = state.config.language;
        }
    }

    function hasBaseConfig() {
        return true;
    }

    function updateAuthStatus() {
        if (!el.authStatus) return;
        if (state.config.authToken) {
            el.authStatus.textContent = "Autenticado.";
        } else {
            el.authStatus.textContent = "Não autenticado.";
        }
    }

    function setAuthScreenStatus(message) {
        if (el.authScreenStatus) {
            el.authScreenStatus.textContent = message;
        }
    }

    function switchAuthScreenMode(mode) {
        const isSignIn = mode !== "signup";
        if (el.authTabSignIn) el.authTabSignIn.classList.toggle("active", isSignIn);
        if (el.authTabSignUp) el.authTabSignUp.classList.toggle("active", !isSignIn);
        if (el.authSignInForm) {
            el.authSignInForm.classList.toggle("hidden", !isSignIn);
            el.authSignInForm.style.display = isSignIn ? "grid" : "none";
        }
        if (el.authSignUpForm) {
            el.authSignUpForm.classList.toggle("hidden", isSignIn);
            el.authSignUpForm.style.display = isSignIn ? "none" : "grid";
        }
    }

    function updateAuthScreenVisibility() {
        const isAuthenticated = Boolean(state.config.authToken);
        if (el.authScreen) el.authScreen.classList.toggle("hidden", isAuthenticated);
        if (el.appContent) el.appContent.classList.toggle("hidden", !isAuthenticated);
    }

    async function validateSession() {
        if (!state.config.authToken || !state.config.apiBase) return false;
        try {
            const url = `${state.config.apiBase}/.netlify/functions/auth`;
            const response = await fetch(url, { method: "GET", headers: headers(true) });
            if (!response.ok) throw new Error("invalid session");
            const data = await response.json();
            state.config.email = data?.user?.email || state.config.email;
            state.config.authUserId = data?.user?.id || state.config.authUserId;
            localStorage.setItem(STORAGE_KEY, JSON.stringify(state.config));
            return true;
        } catch {
            state.config.authToken = "";
            state.config.authUserId = "";
            localStorage.setItem(STORAGE_KEY, JSON.stringify(state.config));
            return false;
        }
    }

    function headers(authRequired = false) {
        const base = {
            "Content-Type": "application/json"
        };
        if (state.config.authToken) {
            base.Authorization = `Bearer ${state.config.authToken}`;
        }
        if (authRequired && !state.config.authToken) {
            throw new Error("Faça login para continuar");
        }
        return base;
    }

    async function authRequest(action, email, password) {
        const url = `${state.config.apiBase}/.netlify/functions/auth`;
        const response = await fetch(url, {
            method: "POST",
            headers: headers(false),
            body: JSON.stringify({ action, email, password })
        });
        const data = await response.json().catch(() => ({}));
        if (!response.ok) {
            throw new Error(data.error || `Falha no auth: ${response.status}`);
        }
        return data;
    }

    async function register(credentials = null) {
        if (!hasBaseConfig()) {
            showToast("Configure a API Base URL");
            return;
        }
        const emailSource = credentials?.email ?? el.emailInput.value ?? "";
        const passwordSource = credentials?.password ?? el.passwordInput.value ?? "";
        const email = String(emailSource).trim().toLowerCase();
        const password = String(passwordSource);
        const data = await authRequest("register", email, password);
        state.config.email = data.user.email;
        state.config.authUserId = data.user.id;
        state.config.authToken = data.token;
        localStorage.setItem(STORAGE_KEY, JSON.stringify(state.config));
        updateAuthStatus();
        updateAuthScreenVisibility();
        setAuthScreenStatus("Conta criada com sucesso");
    }

    async function login(credentials = null) {
        if (!hasBaseConfig()) {
            showToast("Configure a API Base URL");
            return;
        }
        const emailSource = credentials?.email ?? el.emailInput.value ?? "";
        const passwordSource = credentials?.password ?? el.passwordInput.value ?? "";
        const email = String(emailSource).trim().toLowerCase();
        const password = String(passwordSource);
        const data = await authRequest("login", email, password);
        state.config.email = data.user.email;
        state.config.authUserId = data.user.id;
        state.config.authToken = data.token;
        localStorage.setItem(STORAGE_KEY, JSON.stringify(state.config));
        updateAuthStatus();
        updateAuthScreenVisibility();
        setAuthScreenStatus("Login realizado");
    }

    async function logout() {
        if (!state.config.authToken || !hasBaseConfig()) {
            state.config.authToken = "";
            state.config.authUserId = "";
            localStorage.setItem(STORAGE_KEY, JSON.stringify(state.config));
            updateAuthStatus();
            updateAuthScreenVisibility();
            return;
        }
        const url = `${state.config.apiBase}/.netlify/functions/auth`;
        await fetch(url, {
            method: "POST",
            headers: headers(false),
            body: JSON.stringify({ action: "logout" })
        });
        state.config.authToken = "";
        state.config.authUserId = "";
        localStorage.setItem(STORAGE_KEY, JSON.stringify(state.config));
        updateAuthStatus();
        updateAuthScreenVisibility();
        setAuthScreenStatus("Não autenticado.");
    }

    function legacyHeaders() {
        return {
            "Content-Type": "application/json"
        };
    }

    async function fetchSnippets() {
        const url = `${state.config.apiBase}/.netlify/functions/snippets`;
        const response = await fetch(url, { method: "GET", headers: headers(true) });
        if (!response.ok) {
            const body = await response.text();
            throw new Error(`Falha no GET: ${response.status} ${body}`);
        }
        return response.json();
    }

    async function upsertSnippet(snippet) {
        const url = `${state.config.apiBase}/.netlify/functions/snippets`;
        const response = await fetch(url, {
            method: "POST",
            headers: headers(true),
            body: JSON.stringify(snippet)
        });
        if (!response.ok) {
            const body = await response.text();
            throw new Error(`Falha no POST: ${response.status} ${body}`);
        }
    }

    async function removeSnippet(id) {
        const url = `${state.config.apiBase}/.netlify/functions/snippets`;
        const now = new Date().toISOString();
        const response = await fetch(url, {
            method: "DELETE",
            headers: headers(),
            body: JSON.stringify({
                id,
                updatedAt: now
            })
        });
        if (!response.ok) {
            const body = await response.text();
            throw new Error(`Falha no DELETE: ${response.status} ${body}`);
        }
    }

    function getDisplayTitle(item) {
        if (item.title && item.title.trim()) return item.title.trim();
        try {
            return new URL(item.content).hostname.replace(/^www\./, "");
        } catch {
            return "Sem título";
        }
    }

    function formatDate(value) {
        const d = new Date(value);
        if (Number.isNaN(d.getTime())) return "-";
        return d.toLocaleString(state.config.language || "pt-BR");
    }

    function applyFilter() {
        const term = el.searchInput.value.trim().toLowerCase();
        const byTab = state.items.filter((item) => {
            if (state.currentFilter === "favorites") {
                return item.isFavorite === true && item.isArchived !== true;
            }
            if (state.currentFilter === "archived") {
                return item.isArchived === true;
            }
            if (state.currentFilter === "all") {
                return item.isArchived !== true;
            }
            return item.type === state.currentFilter && item.isArchived !== true;
        });

        state.filtered = byTab.filter((item) => {
            const title = (item.title || "").toLowerCase();
            const content = (item.content || "").toLowerCase();
            const tags = Array.isArray(item.tags) ? item.tags.join(" ").toLowerCase() : "";
            return !term || title.includes(term) || content.includes(term) || tags.includes(term);
        });

        state.filtered.sort((a, b) => {
            const aTime = new Date(a.updatedAt).getTime();
            const bTime = new Date(b.updatedAt).getTime();
            return state.sortAsc ? aTime - bTime : bTime - aTime;
        });
    }

    function getTypeLabel(type) {
        if (type === "link") return "LINK";
        if (type === "text") return "TEXTO";
        if (type === "markdown") return "MARKDOWN";
        return String(type || "").toUpperCase();
    }

    function createCard(item) {
        const card = document.createElement("article");
        card.className = "snippet-item";
        if (item.isFavorite) card.classList.add("favorite-snippet");
        if (item.isArchived) card.classList.add("archived-snippet");

        const header = document.createElement("div");
        header.className = "snippet-header";

        const title = document.createElement("h3");
        title.className = "snippet-title";
        title.textContent = `${item.isFavorite ? "⭐ " : ""}${getDisplayTitle(item)}`;
        header.appendChild(title);

        const type = document.createElement("span");
        const typeClass = item.type === "text" ? "text" : item.type === "markdown" ? "markdown" : "link";
        type.className = `snippet-type ${typeClass}`;
        type.textContent = getTypeLabel(item.type);
        header.appendChild(type);
        card.appendChild(header);

        const content = document.createElement("div");
        content.className = "snippet-content";
        if (item.type === "link" && state.config.linkPreviewEnabled === false) {
            content.textContent = "Pré-visualização desativada.";
        } else {
            content.textContent = item.content;
        }
        card.appendChild(content);

        const tags = document.createElement("div");
        tags.className = "snippet-tags";
        (item.tags || []).forEach((tag) => {
            const tagEl = document.createElement("span");
            tagEl.className = "tag";
            tagEl.textContent = tag;
            tags.appendChild(tagEl);
        });
        card.appendChild(tags);

        const meta = document.createElement("div");
        meta.className = "meta";
        meta.textContent = `Atualizado: ${formatDate(item.updatedAt)}${item.isArchived ? " • Arquivado" : ""}`;
        card.appendChild(meta);

        const actions = document.createElement("div");
        actions.className = "snippet-actions";

        if (item.type === "link") {
            const openBtn = document.createElement("button");
            openBtn.className = "btn btn-small open-btn";
            openBtn.type = "button";
            openBtn.textContent = "Abrir";
            openBtn.addEventListener("click", () => window.open(item.content, "_blank", "noopener,noreferrer"));
            actions.appendChild(openBtn);

            if (state.config.summarizeEnabled !== false) {
                const summarizeBtn = document.createElement("button");
                summarizeBtn.className = "btn btn-small btn-secondary";
                summarizeBtn.type = "button";
                summarizeBtn.textContent = "📄 Resumir";
                summarizeBtn.addEventListener("click", () => summarizeLink(item.content));
                actions.appendChild(summarizeBtn);
            }
        }

        const favBtn = document.createElement("button");
        favBtn.className = `btn btn-small ${item.isFavorite ? "btn-favorite-active" : "btn-favorite"}`;
        favBtn.type = "button";
        favBtn.textContent = item.isFavorite ? "Desfavoritar" : "Favoritar";
        favBtn.addEventListener("click", async () => {
            try {
                const updated = {
                    ...item,
                    isFavorite: !item.isFavorite,
                    updatedAt: new Date().toISOString()
                };
                await upsertSnippet(updated);
                await sync();
            } catch (error) {
                console.error(error);
                showToast("Erro ao favoritar");
            }
        });
        actions.appendChild(favBtn);

        const archiveBtn = document.createElement("button");
        archiveBtn.className = `btn btn-small ${item.isArchived ? "btn-archive-active" : "btn-archive"}`;
        archiveBtn.type = "button";
        archiveBtn.textContent = item.isArchived ? "Desarquivar" : "Arquivar";
        archiveBtn.addEventListener("click", async () => {
            try {
                const updated = {
                    ...item,
                    isArchived: !item.isArchived,
                    updatedAt: new Date().toISOString()
                };
                await upsertSnippet(updated);
                await sync();
            } catch (error) {
                console.error(error);
                showToast("Erro ao arquivar");
            }
        });
        actions.appendChild(archiveBtn);

        const deleteBtn = document.createElement("button");
        deleteBtn.className = "btn btn-small btn-danger";
        deleteBtn.type = "button";
        deleteBtn.textContent = "Excluir";
        deleteBtn.addEventListener("click", async () => {
            if (!window.confirm("Excluir este link?")) return;
            try {
                await removeSnippet(item.id);
                await sync();
            } catch (error) {
                console.error(error);
                showToast("Erro ao excluir");
            }
        });
        actions.appendChild(deleteBtn);

        card.appendChild(actions);

        const date = document.createElement("div");
        date.className = "snippet-date";
        date.textContent = `Atualizado: ${formatDate(item.updatedAt)}`;
        card.appendChild(date);

        return card;
    }

    function summarizeLink(url) {
        const provider = state.config.aiProvider || "perplexity";
        const prompt = `Resuma os principais pontos deste link: ${url}`;
        const targetUrl =
            provider === "chatgpt"
                ? `https://chat.openai.com/?q=${encodeURIComponent(prompt)}&hints=search&temporary-chat=true`
                : `https://www.perplexity.ai/search?q=${encodeURIComponent(prompt)}&copilot=true`;
        window.open(targetUrl, "_blank", "noopener,noreferrer");
    }

    function exportSnippets() {
        const payload = JSON.stringify(state.items, null, 2);
        const blob = new Blob([payload], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        const stamp = new Date().toISOString().replace(/[:.]/g, "-");
        a.href = url;
        a.download = `snippets-pocket-${stamp}.json`;
        document.body.appendChild(a);
        a.click();
        a.remove();
        URL.revokeObjectURL(url);
        showToast("Export concluído");
    }

    async function importSnippetsFromFile(file) {
        if (!file) return;
        try {
            const text = await file.text();
            const parsed = JSON.parse(text);
            const items = Array.isArray(parsed) ? parsed : parsed?.snippets;
            if (!Array.isArray(items) || !items.length) {
                throw new Error("Arquivo sem snippets válidos");
            }
            for (const raw of items) {
                const now = new Date().toISOString();
                const snippet = {
                    id: String(raw.id || Date.now() + Math.random()),
                    title: String(raw.title || ""),
                    type: raw.type || "link",
                    content: String(raw.content || ""),
                    tags: Array.isArray(raw.tags) ? raw.tags : [],
                    isFavorite: Boolean(raw.isFavorite),
                    isArchived: Boolean(raw.isArchived),
                    createdAt: raw.createdAt || now,
                    updatedAt: raw.updatedAt || now
                };
                if (!snippet.content) continue;
                await upsertSnippet(snippet);
            }
            await sync();
            showToast("Import concluído");
        } catch (error) {
            console.error(error);
            showToast("Erro ao importar");
        }
    }

    function render() {
        applyFilter();
        el.countBadge.textContent = String(state.filtered.length);
        el.listContainer.innerHTML = "";

        if (!state.filtered.length) {
            const empty = document.createElement("div");
            empty.className = "empty-state";
            empty.innerHTML = "<p>Nenhum item encontrado</p><p>Salve seu primeiro link acima.</p>";
            el.listContainer.appendChild(empty);
            return;
        }

        state.filtered.forEach((item) => {
            el.listContainer.appendChild(createCard(item));
        });
    }

    async function sync() {
        if (!hasBaseConfig()) {
            showToast("Configure a API Base URL");
            if (el.syncStatus) {
                el.syncStatus.textContent = "Configuração incompleta.";
            }
            return;
        }
        if (!state.config.authToken) {
            showToast("Faça login para sincronizar");
            if (el.syncStatus) {
                el.syncStatus.textContent = "Não autenticado.";
            }
            return;
        }
        try {
            const rows = await fetchSnippets();
            state.items = rows
                .map((row) => ({
                    id: String(row.id),
                    title: row.title || "",
                    type: row.type || "link",
                    content: row.content,
                    tags: Array.isArray(row.tags) ? row.tags : [],
                    isFavorite: Boolean(row.is_favorite ?? row.isFavorite),
                    isArchived: Boolean(row.is_archived ?? row.isArchived),
                    createdAt: row.created_at || row.createdAt,
                    updatedAt: row.updated_at || row.updatedAt
                }))
                .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
            render();
            if (el.syncStatus) {
                el.syncStatus.textContent = `Sincronizado: ${state.items.length} itens`;
            }
            showToast("Sincronizado");
        } catch (error) {
            console.error(error);
            if (el.syncStatus) {
                el.syncStatus.textContent = `Erro de sync: ${error.message}`;
            }
            showToast("Erro ao sincronizar");
        }
    }

    async function addLink() {
        if (!hasBaseConfig()) {
            showToast("Configure a API Base URL");
            return;
        }
        if (!state.config.authToken) {
            showToast("Faça login para salvar");
            return;
        }

        const url = (el.urlInput.value || "").trim();
        if (!url) {
            showToast("Informe uma URL");
            return;
        }

        try {
            new URL(url);
        } catch {
            showToast("URL inválida");
            return;
        }

        const now = new Date().toISOString();
        const snippet = {
            id: String(Date.now()),
            title: (el.titleInput.value || "").trim(),
            type: "link",
            content: url,
            tags: parseTags(el.tagsInput.value),
            isFavorite: false,
            isArchived: false,
            createdAt: now,
            updatedAt: now
        };

        try {
            await upsertSnippet(snippet);
            el.urlInput.value = "";
            el.titleInput.value = "";
            el.tagsInput.value = "";
            closeModal(el.addModal);
            await sync();
            showToast("Link salvo");
        } catch (error) {
            console.error(error);
            showToast("Erro ao salvar");
        }
    }

    function openModal(modal) {
        if (!modal) return;
        modal.classList.remove("hidden");
    }

    function closeModal(modal) {
        if (!modal) return;
        modal.classList.add("hidden");
    }

    function loadSharedUrlIntoForm() {
        const params = new URLSearchParams(window.location.search);
        const sharedUrl = params.get("url");
        const sharedTitle = params.get("title");
        if (sharedUrl) el.urlInput.value = sharedUrl;
        if (sharedTitle) el.titleInput.value = sharedTitle;
    }

    function setupPasswordToggles() {
        const passwordInputs = [el.authSignInPassword, el.authSignUpPassword, el.passwordInput];
        passwordInputs.forEach((input) => {
            if (!input || input.dataset.toggleReady === "1") return;

            const wrapper = document.createElement("div");
            wrapper.className = "password-field";
            input.parentNode.insertBefore(wrapper, input);
            wrapper.appendChild(input);

            const toggleBtn = document.createElement("button");
            toggleBtn.type = "button";
            toggleBtn.className = "password-toggle-btn";
            toggleBtn.textContent = "👁";
            toggleBtn.title = "Mostrar senha";
            toggleBtn.setAttribute("aria-label", "Mostrar senha");

            toggleBtn.addEventListener("click", () => {
                const willShow = input.type === "password";
                input.type = willShow ? "text" : "password";
                toggleBtn.textContent = willShow ? "🙈" : "👁";
                toggleBtn.classList.toggle("active", willShow);
                const label = willShow ? "Ocultar senha" : "Mostrar senha";
                toggleBtn.title = label;
                toggleBtn.setAttribute("aria-label", label);
            });

            wrapper.appendChild(toggleBtn);
            input.dataset.toggleReady = "1";
        });
    }

    function bindEvents() {
        el.toggleSettingsBtn.addEventListener("click", () => {
            fillConfigInputs();
            openModal(el.settingsModal);
        });
        if (el.closeSettingsModalBtn) {
            el.closeSettingsModalBtn.addEventListener("click", () => closeModal(el.settingsModal));
        }
        if (el.openAddModalBtn) {
            el.openAddModalBtn.addEventListener("click", () => openModal(el.addModal));
        }
        if (el.closeAddModalBtn) {
            el.closeAddModalBtn.addEventListener("click", () => closeModal(el.addModal));
        }
        if (el.sortBtn) {
            el.sortBtn.addEventListener("click", () => {
                state.sortAsc = !state.sortAsc;
                render();
                showToast(state.sortAsc ? "Ordenado: mais antigos" : "Ordenado: mais recentes");
            });
        }
        if (el.summarizeToggle) {
            el.summarizeToggle.addEventListener("change", () => updateAiProviderVisibility());
        }

        if (el.authTabSignIn) {
            el.authTabSignIn.addEventListener("click", () => switchAuthScreenMode("signin"));
        }
        if (el.authTabSignUp) {
            el.authTabSignUp.addEventListener("click", () => switchAuthScreenMode("signup"));
        }
        if (el.authSignInForm) {
            el.authSignInForm.addEventListener("submit", async (e) => {
                e.preventDefault();
                try {
                    const email = (el.authSignInEmail.value || "").trim().toLowerCase();
                    const password = el.authSignInPassword.value || "";
                    await login({ email, password });
                    await sync();
                } catch (error) {
                    setAuthScreenStatus(error.message || "Erro no login");
                }
            });
        }
        if (el.authSignUpForm) {
            el.authSignUpForm.addEventListener("submit", async (e) => {
                e.preventDefault();
                try {
                    const email = (el.authSignUpEmail.value || "").trim().toLowerCase();
                    const password = el.authSignUpPassword.value || "";
                    await register({ email, password });
                    await sync();
                } catch (error) {
                    setAuthScreenStatus(error.message || "Erro no cadastro");
                }
            });
        }

        if (el.saveConfigBtn) {
            el.saveConfigBtn.addEventListener("click", () => {
                saveConfig();
            });
        }

        if (el.registerBtn) {
            el.registerBtn.addEventListener("click", async () => {
                try {
                    await register();
                    showToast("Conta criada");
                    await sync();
                } catch (error) {
                    showToast(error.message || "Erro ao cadastrar");
                }
            });
        }

        if (el.loginBtn) {
            el.loginBtn.addEventListener("click", async () => {
                try {
                    await login();
                    showToast("Login realizado");
                    await sync();
                } catch (error) {
                    showToast(error.message || "Erro no login");
                }
            });
        }

        if (el.logoutBtn) {
            el.logoutBtn.addEventListener("click", async () => {
                await logout();
                state.items = [];
                render();
                showToast("Logout realizado");
            });
        }

        if (el.syncBtn) {
            el.syncBtn.addEventListener("click", async () => {
                await sync();
            });
        }
        if (el.saveSettingsBtn) {
            el.saveSettingsBtn.addEventListener("click", () => {
                saveConfig();
                closeModal(el.settingsModal);
            });
        }
        if (el.exportBtn) {
            el.exportBtn.addEventListener("click", () => exportSnippets());
        }
        if (el.importBtn && el.importFile) {
            el.importBtn.addEventListener("click", () => el.importFile.click());
            el.importFile.addEventListener("change", async (event) => {
                const file = event.target.files?.[0];
                await importSnippetsFromFile(file);
                event.target.value = "";
            });
        }

        el.addBtn.addEventListener("click", async () => {
            await addLink();
        });

        el.searchInput.addEventListener("input", () => {
            render();
        });

        el.listTabs.forEach((tab) => {
            tab.addEventListener("click", () => {
                el.listTabs.forEach((btn) => btn.classList.remove("active"));
                tab.classList.add("active");
                state.currentFilter = tab.dataset.filter || "all";
                render();
            });
        });

        [el.settingsModal, el.addModal].forEach((modal) => {
            if (!modal) return;
            modal.addEventListener("click", (event) => {
                if (event.target === modal) closeModal(modal);
            });
        });
    }

    async function init() {
        loadConfig();
        fillConfigInputs();
        loadSharedUrlIntoForm();
        setupPasswordToggles();
        bindEvents();
        registerServiceWorker();
        switchAuthScreenMode("signin");
        await validateSession();
        updateAuthStatus();
        updateAuthScreenVisibility();
        if (hasBaseConfig() && state.config.authToken) {
            await sync();
        } else {
            setAuthScreenStatus("Faça login para continuar.");
        }
        closeModal(el.settingsModal);
        closeModal(el.addModal);
    }

    function registerServiceWorker() {
        if (!("serviceWorker" in navigator)) return;
        window.addEventListener("load", async () => {
            try {
                await navigator.serviceWorker.register("/mobile-sw.js");
            } catch (error) {
                console.error("Falha ao registrar service worker:", error);
            }
        });
    }

    init();
})();

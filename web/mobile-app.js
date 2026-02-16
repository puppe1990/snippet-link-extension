(function () {
    const STORAGE_KEY = "snippet_pocket_mobile_config_v2";
    const DEFAULT_API_BASE = window.location.origin;
    const MOBILE_BYPASS_EMAIL = "matheus.puppe@gmail.com";
    const state = {
        items: [],
        filtered: [],
        currentFilter: "all",
        sortAsc: false,
        editingSnippetId: null,
        viewingTodoId: null,
        config: {
            apiBase: DEFAULT_API_BASE,
            email: "",
            authToken: "",
            authUserId: "",
            subscriptionStatus: "inactive",
            entitled: false,
            subscriptionCurrentPeriodEnd: "",
            language: "pt-BR",
            linkPreviewEnabled: true,
            summarizeEnabled: true,
            aiProvider: "perplexity"
        }
    };

    const el = {
        settingsPanel: document.getElementById("settingsPanel"),
        settingsModal: document.getElementById("settingsModal"),
        refreshPwaBtn: document.getElementById("refreshPwaBtn"),
        toggleSettingsBtn: document.getElementById("toggleSettingsBtn"),
        closeSettingsModalBtn: document.getElementById("closeSettingsModalBtn"),
        addModal: document.getElementById("addModal"),
        openAddModalBtn: document.getElementById("openAddModalBtn"),
        closeAddModalBtn: document.getElementById("closeAddModalBtn"),
        addModalTitle: document.getElementById("addModalTitle"),
        todoViewModal: document.getElementById("todoViewModal"),
        closeTodoViewModalBtn: document.getElementById("closeTodoViewModalBtn"),
        todoViewTitle: document.getElementById("todoViewTitle"),
        todoViewMeta: document.getElementById("todoViewMeta"),
        todoViewList: document.getElementById("todoViewList"),
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
        snippetTypeInput: document.getElementById("snippetTypeInput"),
        contentInput: document.getElementById("contentInput"),
        contentField: document.getElementById("contentField"),
        contentFieldLabel: document.getElementById("contentFieldLabel"),
        todoBuilderField: document.getElementById("todoBuilderField"),
        todoItemsContainer: document.getElementById("todoItemsContainer"),
        addTodoItemBtn: document.getElementById("addTodoItemBtn"),
        titleInput: document.getElementById("titleInput"),
        tagsInput: document.getElementById("tagsInput"),
        addBtn: document.getElementById("addBtn"),
        searchInput: document.getElementById("searchInput"),
        listTabs: document.querySelectorAll("#tabs .tab-btn"),
        authStatus: document.getElementById("authStatus"),
        syncStatus: document.getElementById("syncStatus"),
        billingCard: document.getElementById("billingCard"),
        billingHeadline: document.getElementById("billingHeadline"),
        billingSubheadline: document.getElementById("billingSubheadline"),
        billingStatusText: document.getElementById("billingStatusText"),
        billingSubscribeBtn: document.getElementById("billingSubscribeBtn"),
        billingManageBtn: document.getElementById("billingManageBtn"),
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

    async function copyToClipboard(text) {
        const value = String(text || "");
        if (!value) return false;
        try {
            await navigator.clipboard.writeText(value);
            return true;
        } catch {
            const temp = document.createElement("textarea");
            temp.value = value;
            temp.setAttribute("readonly", "");
            temp.style.position = "fixed";
            temp.style.opacity = "0";
            document.body.appendChild(temp);
            temp.select();
            const copied = document.execCommand("copy");
            temp.remove();
            return copied;
        }
    }

    function isPwaMode() {
        const standaloneMatchMedia = window.matchMedia && window.matchMedia("(display-mode: standalone)").matches;
        const standaloneNavigator = window.navigator.standalone === true;
        return standaloneMatchMedia || standaloneNavigator;
    }

    function updatePwaRefreshVisibility() {
        if (!el.refreshPwaBtn) return;
        el.refreshPwaBtn.classList.toggle("hidden", !isPwaMode());
    }

    function normalizeBase(url) {
        return (url || "").trim().replace(/\/+$/, "");
    }

    function shouldBypassSubscription() {
        return (state.config.email || "").trim().toLowerCase() === MOBILE_BYPASS_EMAIL;
    }

    function parseTags(value) {
        return (value || "")
            .split(",")
            .map((tag) => tag.trim())
            .filter(Boolean);
    }

    function parseTodoItems(content) {
        if (!content) return [];
        return String(content)
            .split(/\r?\n/)
            .map((line) => line.trim())
            .filter(Boolean)
            .map((line) => {
                const markdownMatch = line.match(/^[-*]\s*\[( |x|X)\]\s*(.+)$/);
                if (markdownMatch) {
                    return {
                        done: markdownMatch[1].toLowerCase() === "x",
                        text: markdownMatch[2].trim()
                    };
                }
                return { done: false, text: line };
            })
            .filter((item) => item.text);
    }

    function serializeTodoItems(items) {
        return items
            .filter((item) => item && item.text)
            .map((item) => `- [${item.done ? "x" : " "}] ${item.text}`)
            .join("\n");
    }

    function normalizeTodoContent(content) {
        const items = parseTodoItems(content);
        if (!items.length) return "";
        return serializeTodoItems(items);
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
            state.config.subscriptionStatus = parsed.subscriptionStatus || "inactive";
            state.config.entitled = parsed.entitled === true;
            state.config.subscriptionCurrentPeriodEnd = parsed.subscriptionCurrentPeriodEnd || "";
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
        updateBillingUI();
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
        updateBillingUI();
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

    function subscriptionLabel(status) {
        if (status === "active") return "ativa";
        if (status === "trialing") return "em teste";
        if (status === "past_due") return "pagamento pendente";
        if (status === "canceled") return "cancelada";
        return "inativa";
    }

    function updateBillingUI() {
        if (!el.billingStatusText) return;
        if (shouldBypassSubscription()) {
            el.billingStatusText.textContent = "Status: bypass ativo";
            if (el.billingCard) {
                el.billingCard.classList.add("hidden");
            }
            return;
        }
        const statusText = subscriptionLabel(state.config.subscriptionStatus || "inactive");
        el.billingStatusText.textContent = `Status: ${statusText}`;
        if (el.billingCard) {
            el.billingCard.classList.toggle("hidden", !state.config.authToken);
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
            await refreshBillingStatus();
            return true;
        } catch {
            state.config.authToken = "";
            state.config.authUserId = "";
            state.config.subscriptionStatus = "inactive";
            state.config.entitled = false;
            state.config.subscriptionCurrentPeriodEnd = "";
            localStorage.setItem(STORAGE_KEY, JSON.stringify(state.config));
            updateBillingUI();
            return false;
        }
    }

    async function refreshBillingStatus() {
        if (!state.config.authToken || !state.config.apiBase) {
            state.config.subscriptionStatus = "inactive";
            state.config.entitled = false;
            state.config.subscriptionCurrentPeriodEnd = "";
            localStorage.setItem(STORAGE_KEY, JSON.stringify(state.config));
            updateBillingUI();
            return;
        }
        try {
            const url = `${state.config.apiBase}/.netlify/functions/billing`;
            const response = await fetch(url, { method: "GET", headers: headers(true) });
            if (!response.ok) throw new Error(`billing ${response.status}`);
            const data = await response.json();
            state.config.subscriptionStatus = String(data?.subscription_status || "inactive");
            state.config.entitled = data?.entitled === true;
            state.config.subscriptionCurrentPeriodEnd = data?.subscription_current_period_end || "";
        } catch {
            state.config.subscriptionStatus = "inactive";
            state.config.entitled = false;
            state.config.subscriptionCurrentPeriodEnd = "";
        }
        localStorage.setItem(STORAGE_KEY, JSON.stringify(state.config));
        updateBillingUI();
    }

    async function createBillingSession(action) {
        const url = `${state.config.apiBase}/.netlify/functions/billing`;
        const response = await fetch(url, {
            method: "POST",
            headers: headers(true),
            body: JSON.stringify({ action })
        });
        const data = await response.json().catch(() => ({}));
        if (!response.ok) {
            throw new Error(data.error || `billing failed (${response.status})`);
        }
        return data;
    }

    function headers(authRequired = false) {
        const base = {
            "Content-Type": "application/json"
        };
        if (state.config.authToken) {
            base.Authorization = `Bearer ${state.config.authToken}`;
        }
        if (shouldBypassSubscription()) {
            base["X-Mobile-Bypass-Subscription"] = "1";
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
        await refreshBillingStatus();
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
        await refreshBillingStatus();
        updateAuthStatus();
        updateAuthScreenVisibility();
        setAuthScreenStatus("Login realizado");
    }

    async function logout() {
        if (!state.config.authToken || !hasBaseConfig()) {
            state.config.authToken = "";
            state.config.authUserId = "";
            state.config.subscriptionStatus = "inactive";
            state.config.entitled = false;
            state.config.subscriptionCurrentPeriodEnd = "";
            localStorage.setItem(STORAGE_KEY, JSON.stringify(state.config));
            updateAuthStatus();
            updateAuthScreenVisibility();
            updateBillingUI();
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
        state.config.subscriptionStatus = "inactive";
        state.config.entitled = false;
        state.config.subscriptionCurrentPeriodEnd = "";
        localStorage.setItem(STORAGE_KEY, JSON.stringify(state.config));
        updateAuthStatus();
        updateAuthScreenVisibility();
        updateBillingUI();
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
        if (response.status === 402) {
            throw new Error("subscription_required");
        }
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
        if (response.status === 402) {
            throw new Error("subscription_required");
        }
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
        if (response.status === 402) {
            throw new Error("subscription_required");
        }
        if (!response.ok) {
            const body = await response.text();
            throw new Error(`Falha no DELETE: ${response.status} ${body}`);
        }
    }

    function getDisplayTitle(item) {
        if (item.title && item.title.trim()) return item.title.trim();
        if (item.type !== "link") return "";
        try {
            return new URL(item.content).hostname.replace(/^www\./, "");
        } catch {
            return "";
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
        if (type === "todo") return "TO-DO";
        return String(type || "").toUpperCase();
    }

    function getTypeClass(type) {
        if (type === "text") return "text";
        if (type === "markdown") return "markdown";
        if (type === "todo") return "todo";
        return "link";
    }

    function createTodoListElement(item) {
        const list = document.createElement("ul");
        list.className = "todo-list";
        const entries = parseTodoItems(item.content);
        entries.forEach((entry, index) => {
            const row = document.createElement("li");
            row.className = `todo-item ${entry.done ? "done" : ""}`;

            const checkBtn = document.createElement("button");
            checkBtn.type = "button";
            checkBtn.className = `todo-checkbox ${entry.done ? "checked" : ""}`;
            checkBtn.textContent = entry.done ? "☑" : "☐";
            checkBtn.addEventListener("click", async () => {
                await toggleTodoItemDone(item, index);
            });

            const text = document.createElement("span");
            text.className = "todo-text";
            text.textContent = entry.text;

            row.appendChild(checkBtn);
            row.appendChild(text);
            list.appendChild(row);
        });
        return list;
    }

    async function toggleTodoItemDone(item, index) {
        try {
            const current = state.items.find((row) => row.id === item.id) || item;
            const entries = parseTodoItems(current.content);
            if (!entries[index]) return;
            entries[index].done = !entries[index].done;
            const updated = {
                ...current,
                content: serializeTodoItems(entries),
                updatedAt: new Date().toISOString()
            };
            await upsertSnippet(updated);
            await sync();
        } catch (error) {
            console.error(error);
            showToast("Erro ao atualizar tarefa");
        }
    }

    function closeTodoViewModal() {
        state.viewingTodoId = null;
        if (el.todoViewList) {
            el.todoViewList.innerHTML = "";
        }
        closeModal(el.todoViewModal);
    }

    function renderTodoViewModal() {
        if (!state.viewingTodoId || !el.todoViewList) return;
        const item = state.items.find((row) => row.id === state.viewingTodoId && row.type === "todo");
        if (!item) {
            closeTodoViewModal();
            return;
        }

        if (el.todoViewTitle) {
            el.todoViewTitle.textContent = getDisplayTitle(item) || "To-Do";
        }
        if (el.todoViewMeta) {
            const entries = parseTodoItems(item.content);
            const doneCount = entries.filter((entry) => entry.done).length;
            el.todoViewMeta.textContent = `${doneCount}/${entries.length} concluídas`;
        }
        el.todoViewList.innerHTML = "";
        el.todoViewList.appendChild(createTodoListElement(item));
    }

    function openTodoViewModal(item) {
        state.viewingTodoId = item.id;
        renderTodoViewModal();
        openModal(el.todoViewModal);
    }

    function createCard(item) {
        const card = document.createElement("article");
        card.className = "snippet-item";
        if (item.isFavorite) card.classList.add("favorite-snippet");
        if (item.isArchived) card.classList.add("archived-snippet");

        const header = document.createElement("div");
        header.className = "snippet-header";

        const displayTitle = getDisplayTitle(item);
        if (displayTitle) {
            const title = document.createElement("h3");
            title.className = "snippet-title";
            title.textContent = `${item.isFavorite ? "⭐ " : ""}${displayTitle}`;
            header.appendChild(title);
        }

        const type = document.createElement("span");
        type.className = `snippet-type ${getTypeClass(item.type)}`;
        type.textContent = getTypeLabel(item.type);
        header.appendChild(type);
        card.appendChild(header);

        const content = document.createElement("div");
        content.className = "snippet-content";
        if (item.type === "link" && state.config.linkPreviewEnabled === false) {
            content.textContent = "Pré-visualização desativada.";
        } else if (item.type === "todo") {
            content.classList.add("todo-content");
            content.appendChild(createTodoListElement(item));
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

        if (item.type === "todo") {
            const openTodoBtn = document.createElement("button");
            openTodoBtn.className = "btn btn-small open-btn";
            openTodoBtn.type = "button";
            openTodoBtn.textContent = "Abrir";
            openTodoBtn.addEventListener("click", () => {
                openTodoViewModal(item);
            });
            actions.appendChild(openTodoBtn);
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

        const copyBtn = document.createElement("button");
        copyBtn.className = "btn btn-small btn-secondary";
        copyBtn.type = "button";
        copyBtn.textContent = "Copiar";
        copyBtn.addEventListener("click", async () => {
            const copied = await copyToClipboard(item.content);
            showToast(copied ? "Snippet copiado" : "Erro ao copiar");
        });
        actions.appendChild(copyBtn);

        const editBtn = document.createElement("button");
        editBtn.className = "btn btn-small btn-primary";
        editBtn.type = "button";
        editBtn.textContent = "Editar";
        editBtn.addEventListener("click", () => {
            openAddModalForEdit(item);
        });
        actions.appendChild(editBtn);

        const deleteBtn = document.createElement("button");
        deleteBtn.className = "btn btn-small btn-danger";
        deleteBtn.type = "button";
        deleteBtn.textContent = "Excluir";
        deleteBtn.addEventListener("click", async () => {
            if (!window.confirm("Excluir este snippet?")) return;
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
            if (!el.todoViewModal?.classList.contains("hidden")) {
                renderTodoViewModal();
            }
            if (el.syncStatus) {
                el.syncStatus.textContent = `Sincronizado: ${state.items.length} itens`;
            }
            showToast("Sincronizado");
        } catch (error) {
            console.error(error);
            if (String(error.message || "") === "subscription_required") {
                state.config.entitled = false;
                state.config.subscriptionStatus = "inactive";
                localStorage.setItem(STORAGE_KEY, JSON.stringify(state.config));
                updateBillingUI();
                if (el.syncStatus) {
                    el.syncStatus.textContent = "Assinatura Pro necessária para sincronizar.";
                }
                showToast("Assinatura Pro necessária");
                return;
            }
            if (el.syncStatus) {
                el.syncStatus.textContent = `Erro de sync: ${error.message}`;
            }
            showToast("Erro ao sincronizar");
        }
    }

    function clearTodoBuilder() {
        if (!el.todoItemsContainer) return;
        el.todoItemsContainer.innerHTML = "";
    }

    function getTodoBuilderItems() {
        if (!el.todoItemsContainer) return [];
        return Array.from(el.todoItemsContainer.querySelectorAll(".todo-builder-item")).map((row) => ({
            done: row.querySelector(".todo-builder-check")?.checked === true,
            text: (row.querySelector(".todo-builder-input")?.value || "").trim()
        }));
    }

    function addTodoBuilderItem(item = { done: false, text: "" }, focus = true) {
        if (!el.todoItemsContainer) return;
        const row = document.createElement("div");
        row.className = "todo-builder-item";

        const check = document.createElement("input");
        check.type = "checkbox";
        check.className = "todo-builder-check";
        check.checked = item.done === true;

        const input = document.createElement("input");
        input.type = "text";
        input.className = "todo-builder-input";
        input.placeholder = "Digite uma tarefa...";
        input.value = item.text || "";

        const remove = document.createElement("button");
        remove.type = "button";
        remove.className = "btn btn-danger todo-builder-remove";
        remove.textContent = "×";
        remove.title = "Excluir tarefa";

        check.addEventListener("change", syncTodoBuilderToContent);
        input.addEventListener("input", syncTodoBuilderToContent);
        remove.addEventListener("click", () => {
            row.remove();
            if (!el.todoItemsContainer.children.length) {
                addTodoBuilderItem(undefined, false);
            }
            syncTodoBuilderToContent();
        });

        row.appendChild(check);
        row.appendChild(input);
        row.appendChild(remove);
        el.todoItemsContainer.appendChild(row);
        if (focus) input.focus();
    }

    function loadTodoBuilderFromContent(content) {
        const items = parseTodoItems(content || "");
        clearTodoBuilder();
        if (!items.length) return;
        items.forEach((item) => addTodoBuilderItem(item, false));
    }

    function syncTodoBuilderToContent() {
        if (!el.snippetTypeInput || !el.contentInput || el.snippetTypeInput.value !== "todo") {
            return;
        }
        const normalized = serializeTodoItems(getTodoBuilderItems().filter((item) => item.text));
        el.contentInput.value = normalized;
    }

    function updateAddModalByType() {
        if (!el.snippetTypeInput) return;
        const type = el.snippetTypeInput.value || "link";
        const isTodo = type === "todo";

        if (el.todoBuilderField) {
            el.todoBuilderField.classList.toggle("hidden", !isTodo);
        }
        if (el.contentField) {
            el.contentField.classList.toggle("hidden", isTodo);
        }
        if (el.contentFieldLabel) {
            el.contentFieldLabel.textContent = type === "link" ? "URL" : "Conteúdo";
        }
        if (el.contentInput) {
            el.contentInput.placeholder = type === "link" ? "https://..." : "Digite o conteúdo...";
        }

        if (isTodo) {
            if (!getTodoBuilderItems().length) {
                loadTodoBuilderFromContent(el.contentInput?.value || "");
            }
            if (!getTodoBuilderItems().length) {
                addTodoBuilderItem(undefined, false);
            }
            syncTodoBuilderToContent();
        }
    }

    function resetAddModal() {
        state.editingSnippetId = null;
        if (el.snippetTypeInput) el.snippetTypeInput.value = "link";
        if (el.contentInput) el.contentInput.value = "";
        if (el.titleInput) el.titleInput.value = "";
        if (el.tagsInput) el.tagsInput.value = "";
        if (el.addModalTitle) el.addModalTitle.textContent = "Novo Snippet";
        if (el.addBtn) el.addBtn.textContent = "Salvar Snippet";
        clearTodoBuilder();
        updateAddModalByType();
    }

    function openAddModalForEdit(item) {
        state.editingSnippetId = item.id;
        if (el.addModalTitle) el.addModalTitle.textContent = "Editar Snippet";
        if (el.addBtn) el.addBtn.textContent = "Atualizar Snippet";
        if (el.snippetTypeInput) el.snippetTypeInput.value = item.type || "link";
        if (el.contentInput) el.contentInput.value = item.content || "";
        if (el.titleInput) el.titleInput.value = item.title || "";
        if (el.tagsInput) el.tagsInput.value = Array.isArray(item.tags) ? item.tags.join(", ") : "";
        clearTodoBuilder();
        loadTodoBuilderFromContent(item.content || "");
        updateAddModalByType();
        openModal(el.addModal);
    }

    async function addSnippet() {
        if (!hasBaseConfig()) {
            showToast("Configure a API Base URL");
            return;
        }
        if (!state.config.authToken) {
            showToast("Faça login para salvar");
            return;
        }

        const type = el.snippetTypeInput?.value || "link";
        let content = (el.contentInput?.value || "").trim();

        if (type === "todo") {
            syncTodoBuilderToContent();
            content = normalizeTodoContent(el.contentInput?.value || "");
            if (!content) {
                showToast("Adicione ao menos uma tarefa");
                return;
            }
        } else if (!content) {
            showToast(type === "link" ? "Informe uma URL" : "Informe o conteúdo");
            return;
        }

        if (type === "link") {
            try {
                new URL(content);
            } catch {
                showToast("URL inválida");
                return;
            }
        }

        const now = new Date().toISOString();
        const existing = state.editingSnippetId
            ? state.items.find((item) => item.id === state.editingSnippetId)
            : null;
        const snippet = existing
            ? {
                  ...existing,
                  title: (el.titleInput.value || "").trim(),
                  type,
                  content,
                  tags: parseTags(el.tagsInput.value),
                  updatedAt: now
              }
            : {
                  id: String(Date.now()),
                  title: (el.titleInput.value || "").trim(),
                  type,
                  content,
                  tags: parseTags(el.tagsInput.value),
                  isFavorite: false,
                  isArchived: false,
                  createdAt: now,
                  updatedAt: now
              };

        try {
            await upsertSnippet(snippet);
            resetAddModal();
            closeModal(el.addModal);
            await sync();
            showToast(existing ? "Snippet atualizado" : "Snippet salvo");
        } catch (error) {
            console.error(error);
            showToast("Erro ao salvar");
        }
    }

    async function startCheckout() {
        try {
            const data = await createBillingSession("create_checkout");
            if (data?.url) {
                window.open(data.url, "_blank", "noopener,noreferrer");
            }
        } catch (error) {
            showToast(`Erro no checkout: ${error.message}`);
        }
    }

    async function openPortal() {
        try {
            const data = await createBillingSession("create_portal");
            if (data?.url) {
                window.open(data.url, "_blank", "noopener,noreferrer");
            }
        } catch (error) {
            showToast(`Erro no portal: ${error.message}`);
        }
    }

    async function refreshPwaApp() {
        try {
            if ("serviceWorker" in navigator) {
                const regs = await navigator.serviceWorker.getRegistrations();
                await Promise.all(regs.map((reg) => reg.update()));
            }
            await validateSession();
            if (state.config.authToken) {
                await refreshBillingStatus();
                await sync();
            } else {
                render();
            }
            showToast("Atualizado");
        } catch (error) {
            console.error(error);
            showToast("Erro ao atualizar");
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
        if (sharedUrl && el.contentInput) {
            el.snippetTypeInput.value = "link";
            el.contentInput.value = sharedUrl;
        }
        if (sharedTitle) el.titleInput.value = sharedTitle;
        updateAddModalByType();
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
            el.openAddModalBtn.addEventListener("click", () => {
                resetAddModal();
                openModal(el.addModal);
            });
        }
        if (el.closeAddModalBtn) {
            el.closeAddModalBtn.addEventListener("click", () => {
                closeModal(el.addModal);
                resetAddModal();
            });
        }
        if (el.closeTodoViewModalBtn) {
            el.closeTodoViewModalBtn.addEventListener("click", () => closeTodoViewModal());
        }
        if (el.sortBtn) {
            el.sortBtn.addEventListener("click", () => {
                state.sortAsc = !state.sortAsc;
                render();
                showToast(state.sortAsc ? "Ordenado: mais antigos" : "Ordenado: mais recentes");
            });
        }
        if (el.refreshPwaBtn) {
            el.refreshPwaBtn.addEventListener("click", async () => {
                await refreshPwaApp();
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
        if (el.billingSubscribeBtn) {
            el.billingSubscribeBtn.addEventListener("click", async () => {
                await startCheckout();
            });
        }
        if (el.billingManageBtn) {
            el.billingManageBtn.addEventListener("click", async () => {
                await openPortal();
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

        if (el.snippetTypeInput) {
            el.snippetTypeInput.addEventListener("change", () => updateAddModalByType());
        }
        if (el.addTodoItemBtn) {
            el.addTodoItemBtn.addEventListener("click", () => {
                addTodoBuilderItem();
                syncTodoBuilderToContent();
            });
        }

        el.addBtn.addEventListener("click", async () => {
            await addSnippet();
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

        [el.settingsModal, el.addModal, el.todoViewModal].forEach((modal) => {
            if (!modal) return;
            modal.addEventListener("click", (event) => {
                if (event.target === modal) {
                    closeModal(modal);
                    if (modal === el.addModal) {
                        resetAddModal();
                    }
                    if (modal === el.todoViewModal) {
                        closeTodoViewModal();
                    }
                }
            });
        });
    }

    async function init() {
        loadConfig();
        fillConfigInputs();
        loadSharedUrlIntoForm();
        setupPasswordToggles();
        updatePwaRefreshVisibility();
        bindEvents();
        registerServiceWorker();
        switchAuthScreenMode("signin");
        updateAddModalByType();
        await validateSession();
        updateAuthStatus();
        updateAuthScreenVisibility();
        updateBillingUI();
        if (hasBaseConfig() && state.config.authToken) {
            await sync();
        } else {
            setAuthScreenStatus("Faça login para continuar.");
        }
        closeModal(el.settingsModal);
        closeModal(el.addModal);
        closeModal(el.todoViewModal);

        const media = window.matchMedia ? window.matchMedia("(display-mode: standalone)") : null;
        if (media && media.addEventListener) {
            media.addEventListener("change", updatePwaRefreshVisibility);
        }
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

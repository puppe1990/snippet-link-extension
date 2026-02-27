(function () {
    const STORAGE_KEY = "snippet_pocket_mobile_config_v2";
    const DEFAULT_API_BASE = window.location.origin;
    const MOBILE_BYPASS_EMAIL = "matheus.puppe@gmail.com";
    const i18n = {
        "pt-BR": {
            app_title: "Snippet Pocket",
            refresh_btn: "⟳ Atualizar",
            settings_btn: "⚙️",
            new_btn: "+ Novo",
            sort_btn: "🔄 Ordenar",
            auth_screen_title: "🔐 Entrar",
            auth_screen_subtitle: "Faça login para acessar seus snippets",
            auth_tab_sign_in: "Sign in",
            auth_tab_sign_up: "Sign up",
            email_label: "Email",
            password_label: "Senha",
            email_placeholder: "seu@email.com",
            password_signin_placeholder: "sua senha",
            password_signup_placeholder: "min 6 caracteres",
            auth_sign_in_submit: "Entrar",
            auth_sign_up_submit: "Criar conta",
            auth_not_authenticated: "Não autenticado.",
            billing_headline: "Desbloqueie o Pro por US$ 1/mês",
            billing_subheadline: "Sincronização completa e recursos avançados sem complicação.",
            billing_subscribe_btn: "Assinar por US$ 1/mês",
            billing_manage_btn: "Gerenciar assinatura",
            billing_status_prefix: "Status:",
            billing_status_bypass: "bypass ativo",
            subscription_active: "ativa",
            subscription_trialing: "em teste",
            subscription_past_due: "pagamento pendente",
            subscription_canceled: "cancelada",
            subscription_inactive: "inativa",
            list_title: "Minha Lista",
            tab_all: "Todos",
            tab_link: "Links",
            tab_text: "Textos",
            tab_markdown: "Markdown",
            tab_todo: "To-Do",
            tab_favorites: "Favoritos",
            tab_archived: "Arquivados",
            search_placeholder: "Buscar por título, URL ou tag",
            sync_status_initial: "Sem sincronização ainda.",
            settings_title: "Configuração",
            language_label: "🌐 Idioma",
            link_preview_label: "🔗 Pré-visualização de Links",
            summarize_label: "📄 Resumo de Links",
            ai_provider_label: "🤖 Provedor de IA",
            settings_password_placeholder: "mínimo 6 caracteres",
            logout_btn: "Sair",
            save_settings_btn: "Salvar Configurações",
            export_btn: "📤 Exportar Snippets",
            import_btn: "📥 Importar Snippets",
            new_snippet_title: "Novo Snippet",
            edit_snippet_title: "Editar Snippet",
            snippet_type_label: "Tipo",
            type_link: "🔗 Link",
            type_text: "📝 Texto",
            type_markdown: "📄 Markdown",
            type_todo: "✅ To-Do List",
            content_label: "Conteúdo",
            content_placeholder: "Digite o conteúdo...",
            checklist_label: "Checklist",
            add_task_btn: "+ Tarefa",
            title_optional_label: "Título (opcional)",
            title_placeholder: "Título",
            tags_label: "Tags (vírgula)",
            tags_placeholder: "trabalho, leitura",
            save_snippet_btn: "Salvar Snippet",
            update_snippet_btn: "Atualizar Snippet",
            todo_view_title: "To-Do",
            quick_sync_btn: "☁ Sincronizar",
            quick_sync_loading: "☁ Sincronizando...",
            quick_sync_success: "✅ Sincronizado",
            quick_sync_locked: "🔒 Pro necessária",
            quick_sync_error: "⚠ Erro no sync",
            sync_btn: "Sincronizar",
            syncing: "Sincronizando...",
            sync_status_incomplete: "Configuração incompleta.",
            sync_status_unauthenticated: "Não autenticado.",
            sync_status_synced: "Sincronizado: {{count}} itens",
            sync_status_subscription_required: "Assinatura Pro necessária para sincronizar.",
            sync_status_error: "Erro de sync: {{error}}",
            settings_saved: "Configuração salva",
            toast_configure_api: "Configure a API Base URL",
            toast_login_to_sync: "Faça login para sincronizar",
            toast_synced: "Sincronizado",
            toast_subscription_required: "Assinatura Pro necessária",
            toast_sync_error: "Erro ao sincronizar",
            toast_login_to_save: "Faça login para salvar",
            toast_todo_update_error: "Erro ao atualizar tarefa",
            toast_favorite_error: "Erro ao favoritar",
            toast_archive_error: "Erro ao arquivar",
            toast_copy_success: "Snippet copiado",
            toast_copy_error: "Erro ao copiar",
            toast_delete_error: "Erro ao excluir",
            toast_export_done: "Export concluído",
            toast_import_done: "Import concluído",
            toast_import_error: "Erro ao importar",
            toast_add_task_required: "Adicione ao menos uma tarefa",
            toast_enter_url: "Informe uma URL",
            toast_enter_content: "Informe o conteúdo",
            toast_invalid_url: "URL inválida",
            toast_snippet_updated: "Snippet atualizado",
            toast_snippet_saved: "Snippet salvo",
            toast_save_error: "Erro ao salvar",
            toast_checkout_error: "Erro no checkout: {{error}}",
            toast_portal_error: "Erro no portal: {{error}}",
            toast_refreshed: "Atualizado",
            toast_refresh_error: "Erro ao atualizar",
            toast_sorted_oldest: "Ordenado: mais antigos",
            toast_sorted_newest: "Ordenado: mais recentes",
            toast_account_created: "Conta criada",
            toast_register_error: "Erro ao cadastrar",
            toast_login_success: "Login realizado",
            toast_login_error: "Erro no login",
            toast_logout_success: "Logout realizado",
            auth_error_login: "Erro no login",
            auth_error_register: "Erro no cadastro",
            auth_gate_continue: "Faça login para continuar.",
            auth_status_logged_in: "Autenticado.",
            auth_status_not_logged_in: "Não autenticado.",
            content_label_url: "URL",
            todo_task_placeholder: "Digite uma tarefa...",
            todo_remove_task: "Excluir tarefa",
            link_preview_disabled: "Pré-visualização desativada.",
            updated_at_prefix: "Atualizado:",
            archived_suffix: "Arquivado",
            open_btn: "Abrir",
            summarize_btn: "📄 Resumir",
            favorite_btn: "Favoritar",
            unfavorite_btn: "Desfavoritar",
            archive_btn: "Arquivar",
            unarchive_btn: "Desarquivar",
            copy_btn: "Copiar",
            show_btn: "Mostrar",
            edit_btn: "Editar",
            delete_btn: "Excluir",
            confirm_delete: "Excluir este snippet?",
            empty_title: "Nenhum item encontrado",
            empty_subtitle: "Salve seu primeiro link acima.",
            todo_done_counter: "{{done}}/{{total}} concluídas",
            content_view_title: "Conteúdo completo",
            close_btn: "Fechar",
            show_password: "Mostrar senha",
            hide_password: "Ocultar senha"
        },
        en: {
            app_title: "Snippet Pocket",
            refresh_btn: "⟳ Refresh",
            settings_btn: "⚙️",
            new_btn: "+ New",
            sort_btn: "🔄 Sort",
            auth_screen_title: "🔐 Sign in",
            auth_screen_subtitle: "Sign in to access your snippets",
            auth_tab_sign_in: "Sign in",
            auth_tab_sign_up: "Sign up",
            email_label: "Email",
            password_label: "Password",
            email_placeholder: "you@email.com",
            password_signin_placeholder: "your password",
            password_signup_placeholder: "min 6 characters",
            auth_sign_in_submit: "Sign in",
            auth_sign_up_submit: "Create account",
            auth_not_authenticated: "Not authenticated.",
            billing_headline: "Unlock Pro for US$1/month",
            billing_subheadline: "Full sync and advanced features without complexity.",
            billing_subscribe_btn: "Subscribe for US$1/month",
            billing_manage_btn: "Manage subscription",
            billing_status_prefix: "Status:",
            billing_status_bypass: "bypass active",
            subscription_active: "active",
            subscription_trialing: "trialing",
            subscription_past_due: "past due",
            subscription_canceled: "canceled",
            subscription_inactive: "inactive",
            list_title: "My List",
            tab_all: "All",
            tab_link: "Links",
            tab_text: "Texts",
            tab_markdown: "Markdown",
            tab_todo: "To-Do",
            tab_favorites: "Favorites",
            tab_archived: "Archived",
            search_placeholder: "Search by title, URL or tag",
            sync_status_initial: "No sync yet.",
            settings_title: "Settings",
            language_label: "🌐 Language",
            link_preview_label: "🔗 Link Preview",
            summarize_label: "📄 Link Summaries",
            ai_provider_label: "🤖 AI Provider",
            settings_password_placeholder: "minimum 6 characters",
            logout_btn: "Sign out",
            save_settings_btn: "Save Settings",
            export_btn: "📤 Export Snippets",
            import_btn: "📥 Import Snippets",
            new_snippet_title: "New Snippet",
            edit_snippet_title: "Edit Snippet",
            snippet_type_label: "Type",
            type_link: "🔗 Link",
            type_text: "📝 Text",
            type_markdown: "📄 Markdown",
            type_todo: "✅ To-Do List",
            content_label: "Content",
            content_placeholder: "Type the content...",
            checklist_label: "Checklist",
            add_task_btn: "+ Task",
            title_optional_label: "Title (optional)",
            title_placeholder: "Title",
            tags_label: "Tags (comma separated)",
            tags_placeholder: "work, reading",
            save_snippet_btn: "Save Snippet",
            update_snippet_btn: "Update Snippet",
            todo_view_title: "To-Do",
            quick_sync_btn: "☁ Sync",
            quick_sync_loading: "☁ Syncing...",
            quick_sync_success: "✅ Synced",
            quick_sync_locked: "🔒 Pro required",
            quick_sync_error: "⚠ Sync error",
            sync_btn: "Sync",
            syncing: "Syncing...",
            sync_status_incomplete: "Configuration incomplete.",
            sync_status_unauthenticated: "Not authenticated.",
            sync_status_synced: "Synced: {{count}} items",
            sync_status_subscription_required: "Pro subscription required to sync.",
            sync_status_error: "Sync error: {{error}}",
            settings_saved: "Settings saved",
            toast_configure_api: "Configure API Base URL",
            toast_login_to_sync: "Sign in to sync",
            toast_synced: "Synced",
            toast_subscription_required: "Pro subscription required",
            toast_sync_error: "Sync failed",
            toast_login_to_save: "Sign in to save",
            toast_todo_update_error: "Failed to update task",
            toast_favorite_error: "Failed to favorite",
            toast_archive_error: "Failed to archive",
            toast_copy_success: "Snippet copied",
            toast_copy_error: "Copy failed",
            toast_delete_error: "Failed to delete",
            toast_export_done: "Export completed",
            toast_import_done: "Import completed",
            toast_import_error: "Import failed",
            toast_add_task_required: "Add at least one task",
            toast_enter_url: "Enter a URL",
            toast_enter_content: "Enter content",
            toast_invalid_url: "Invalid URL",
            toast_snippet_updated: "Snippet updated",
            toast_snippet_saved: "Snippet saved",
            toast_save_error: "Failed to save",
            toast_checkout_error: "Checkout error: {{error}}",
            toast_portal_error: "Portal error: {{error}}",
            toast_refreshed: "Updated",
            toast_refresh_error: "Update error",
            toast_sorted_oldest: "Sorted: oldest first",
            toast_sorted_newest: "Sorted: newest first",
            toast_account_created: "Account created",
            toast_register_error: "Sign up failed",
            toast_login_success: "Signed in",
            toast_login_error: "Sign in failed",
            toast_logout_success: "Signed out",
            auth_error_login: "Sign in error",
            auth_error_register: "Sign up error",
            auth_gate_continue: "Sign in to continue.",
            auth_status_logged_in: "Authenticated.",
            auth_status_not_logged_in: "Not authenticated.",
            content_label_url: "URL",
            todo_task_placeholder: "Type a task...",
            todo_remove_task: "Remove task",
            link_preview_disabled: "Preview disabled.",
            updated_at_prefix: "Updated:",
            archived_suffix: "Archived",
            open_btn: "Open",
            summarize_btn: "📄 Summarize",
            favorite_btn: "Favorite",
            unfavorite_btn: "Unfavorite",
            archive_btn: "Archive",
            unarchive_btn: "Unarchive",
            copy_btn: "Copy",
            show_btn: "Show",
            edit_btn: "Edit",
            delete_btn: "Delete",
            confirm_delete: "Delete this snippet?",
            empty_title: "No items found",
            empty_subtitle: "Save your first link above.",
            todo_done_counter: "{{done}}/{{total}} done",
            content_view_title: "Full content",
            close_btn: "Close",
            show_password: "Show password",
            hide_password: "Hide password"
        },
        fr: {
            app_title: "Snippet Pocket",
            refresh_btn: "⟳ Actualiser",
            settings_btn: "⚙️",
            new_btn: "+ Nouveau",
            sort_btn: "🔄 Trier",
            auth_screen_title: "🔐 Se connecter",
            auth_screen_subtitle: "Connectez-vous pour accéder à vos snippets",
            auth_tab_sign_in: "Sign in",
            auth_tab_sign_up: "Sign up",
            email_label: "Email",
            password_label: "Mot de passe",
            email_placeholder: "votre@email.com",
            password_signin_placeholder: "votre mot de passe",
            password_signup_placeholder: "min 6 caractères",
            auth_sign_in_submit: "Se connecter",
            auth_sign_up_submit: "Créer un compte",
            auth_not_authenticated: "Non authentifié.",
            billing_headline: "Débloquez Pro pour 1 US$/mois",
            billing_subheadline: "Synchronisation complète et fonctionnalités avancées sans complexité.",
            billing_subscribe_btn: "S’abonner pour 1 US$/mois",
            billing_manage_btn: "Gérer l’abonnement",
            billing_status_prefix: "Statut :",
            billing_status_bypass: "bypass actif",
            subscription_active: "active",
            subscription_trialing: "essai",
            subscription_past_due: "paiement en retard",
            subscription_canceled: "annulée",
            subscription_inactive: "inactive",
            list_title: "Ma liste",
            tab_all: "Tous",
            tab_link: "Liens",
            tab_text: "Textes",
            tab_markdown: "Markdown",
            tab_todo: "To-Do",
            tab_favorites: "Favoris",
            tab_archived: "Archivés",
            search_placeholder: "Rechercher par titre, URL ou tag",
            sync_status_initial: "Aucune synchronisation pour le moment.",
            settings_title: "Configuration",
            language_label: "🌐 Langue",
            link_preview_label: "🔗 Aperçu des liens",
            summarize_label: "📄 Résumé des liens",
            ai_provider_label: "🤖 Fournisseur IA",
            settings_password_placeholder: "minimum 6 caractères",
            logout_btn: "Se déconnecter",
            save_settings_btn: "Enregistrer les paramètres",
            export_btn: "📤 Exporter les snippets",
            import_btn: "📥 Importer des snippets",
            new_snippet_title: "Nouveau snippet",
            edit_snippet_title: "Modifier le snippet",
            snippet_type_label: "Type",
            type_link: "🔗 Lien",
            type_text: "📝 Texte",
            type_markdown: "📄 Markdown",
            type_todo: "✅ To-Do List",
            content_label: "Contenu",
            content_placeholder: "Saisissez le contenu...",
            checklist_label: "Checklist",
            add_task_btn: "+ Tâche",
            title_optional_label: "Titre (optionnel)",
            title_placeholder: "Titre",
            tags_label: "Tags (séparés par des virgules)",
            tags_placeholder: "travail, lecture",
            save_snippet_btn: "Enregistrer le snippet",
            update_snippet_btn: "Mettre à jour le snippet",
            todo_view_title: "To-Do",
            quick_sync_btn: "☁ Synchroniser",
            quick_sync_loading: "☁ Synchronisation...",
            quick_sync_success: "✅ Synchronisé",
            quick_sync_locked: "🔒 Pro requis",
            quick_sync_error: "⚠ Erreur de sync",
            sync_btn: "Synchroniser",
            syncing: "Synchronisation...",
            sync_status_incomplete: "Configuration incomplète.",
            sync_status_unauthenticated: "Non authentifié.",
            sync_status_synced: "Synchronisé : {{count}} éléments",
            sync_status_subscription_required: "Abonnement Pro requis pour synchroniser.",
            sync_status_error: "Erreur de sync : {{error}}",
            settings_saved: "Configuration enregistrée",
            toast_configure_api: "Configurez l’URL API de base",
            toast_login_to_sync: "Connectez-vous pour synchroniser",
            toast_synced: "Synchronisé",
            toast_subscription_required: "Abonnement Pro requis",
            toast_sync_error: "Erreur de synchronisation",
            toast_login_to_save: "Connectez-vous pour enregistrer",
            toast_todo_update_error: "Échec de mise à jour de la tâche",
            toast_favorite_error: "Échec de mise en favori",
            toast_archive_error: "Échec d’archivage",
            toast_copy_success: "Snippet copié",
            toast_copy_error: "Échec de copie",
            toast_delete_error: "Échec de suppression",
            toast_export_done: "Export terminé",
            toast_import_done: "Import terminé",
            toast_import_error: "Échec de l’import",
            toast_add_task_required: "Ajoutez au moins une tâche",
            toast_enter_url: "Saisissez une URL",
            toast_enter_content: "Saisissez le contenu",
            toast_invalid_url: "URL invalide",
            toast_snippet_updated: "Snippet mis à jour",
            toast_snippet_saved: "Snippet enregistré",
            toast_save_error: "Échec de l’enregistrement",
            toast_checkout_error: "Erreur de checkout : {{error}}",
            toast_portal_error: "Erreur du portail : {{error}}",
            toast_refreshed: "Mis à jour",
            toast_refresh_error: "Erreur de mise à jour",
            toast_sorted_oldest: "Trié : plus anciens d’abord",
            toast_sorted_newest: "Trié : plus récents d’abord",
            toast_account_created: "Compte créé",
            toast_register_error: "Échec de l’inscription",
            toast_login_success: "Connexion réussie",
            toast_login_error: "Échec de connexion",
            toast_logout_success: "Déconnecté",
            auth_error_login: "Erreur de connexion",
            auth_error_register: "Erreur d’inscription",
            auth_gate_continue: "Connectez-vous pour continuer.",
            auth_status_logged_in: "Authentifié.",
            auth_status_not_logged_in: "Non authentifié.",
            content_label_url: "URL",
            todo_task_placeholder: "Saisissez une tâche...",
            todo_remove_task: "Supprimer la tâche",
            link_preview_disabled: "Aperçu désactivé.",
            updated_at_prefix: "Mis à jour :",
            archived_suffix: "Archivé",
            open_btn: "Ouvrir",
            summarize_btn: "📄 Résumer",
            favorite_btn: "Favoriser",
            unfavorite_btn: "Retirer favori",
            archive_btn: "Archiver",
            unarchive_btn: "Désarchiver",
            copy_btn: "Copier",
            show_btn: "Afficher",
            edit_btn: "Modifier",
            delete_btn: "Supprimer",
            confirm_delete: "Supprimer ce snippet ?",
            empty_title: "Aucun élément trouvé",
            empty_subtitle: "Enregistrez votre premier lien ci-dessus.",
            todo_done_counter: "{{done}}/{{total}} terminées",
            content_view_title: "Contenu complet",
            close_btn: "Fermer",
            show_password: "Afficher le mot de passe",
            hide_password: "Masquer le mot de passe"
        }
    };
    const state = {
        items: [],
        filtered: [],
        currentFilter: "all",
        sortAsc: false,
        editingSnippetId: null,
        viewingTodoId: null,
        viewingContentId: null,
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
        contentViewModal: document.getElementById("contentViewModal"),
        closeContentViewModalBtn: document.getElementById("closeContentViewModalBtn"),
        closeContentViewBtn: document.getElementById("closeContentViewBtn"),
        copyContentViewBtn: document.getElementById("copyContentViewBtn"),
        contentViewTitle: document.getElementById("contentViewTitle"),
        contentViewBody: document.getElementById("contentViewBody"),
        quickSyncBtn: document.getElementById("quickSyncBtn"),
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
        settingsManageSubscriptionBtn: document.getElementById("settingsManageSubscriptionBtn"),
        listContainer: document.getElementById("listContainer"),
        countBadge: document.getElementById("countBadge"),
        toast: document.getElementById("toast")
    };
    const uiCore = window.SnippetUiCore || {};

    function showToast(message) {
        el.toast.textContent = message;
        el.toast.classList.remove("hidden");
        clearTimeout(showToast._timeout);
        showToast._timeout = setTimeout(() => el.toast.classList.add("hidden"), 2500);
    }

    function getLocale() {
        const raw = String(state.config.language || "pt-BR");
        if (i18n[raw]) return raw;
        const short = raw.toLowerCase().split("-")[0];
        if (short === "pt") return "pt-BR";
        if (short === "en") return "en";
        if (short === "fr") return "fr";
        return "pt-BR";
    }

    function t(key, vars = {}) {
        const locale = getLocale();
        const dict = i18n[locale] || i18n["pt-BR"];
        const template = dict[key] || i18n["pt-BR"][key] || key;
        return String(template).replace(/\{\{(\w+)\}\}/g, (_, name) =>
            Object.prototype.hasOwnProperty.call(vars, name) ? String(vars[name]) : ""
        );
    }

    function setQuickSyncFeedback(status) {
        if (!el.quickSyncBtn) return;
        clearTimeout(setQuickSyncFeedback._timeout);
        el.quickSyncBtn.classList.remove("is-loading", "is-success", "is-error", "is-locked");

        if (status === "loading") {
            el.quickSyncBtn.classList.add("is-loading");
            el.quickSyncBtn.textContent = t("quick_sync_loading");
            return;
        }
        if (status === "success") {
            el.quickSyncBtn.classList.add("is-success");
            el.quickSyncBtn.textContent = t("quick_sync_success");
        } else if (status === "locked") {
            el.quickSyncBtn.classList.add("is-locked");
            el.quickSyncBtn.textContent = t("quick_sync_locked");
        } else if (status === "error") {
            el.quickSyncBtn.classList.add("is-error");
            el.quickSyncBtn.textContent = t("quick_sync_error");
        } else {
            el.quickSyncBtn.textContent = t("quick_sync_btn");
            return;
        }

        setQuickSyncFeedback._timeout = setTimeout(() => {
            if (!el.quickSyncBtn) return;
            el.quickSyncBtn.classList.remove("is-loading", "is-success", "is-error", "is-locked");
            el.quickSyncBtn.textContent = t("quick_sync_btn");
        }, 2300);
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
        return false;
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
        showToast(t("settings_saved"));
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
        document.title = t("app_title");
        const headerTitle = document.querySelector(".header h1");
        if (headerTitle) headerTitle.textContent = t("app_title");
        if (el.refreshPwaBtn && !el.refreshPwaBtn.disabled) el.refreshPwaBtn.textContent = t("refresh_btn");
        if (el.toggleSettingsBtn) el.toggleSettingsBtn.textContent = t("settings_btn");
        if (el.openAddModalBtn) el.openAddModalBtn.textContent = t("new_btn");
        if (el.sortBtn) el.sortBtn.textContent = t("sort_btn");

        const authTitle = document.querySelector("#authScreen h2");
        const authSubtitle = document.querySelector("#authScreen p");
        if (authTitle) authTitle.textContent = t("auth_screen_title");
        if (authSubtitle) authSubtitle.textContent = t("auth_screen_subtitle");
        if (el.authTabSignIn) el.authTabSignIn.textContent = t("auth_tab_sign_in");
        if (el.authTabSignUp) el.authTabSignUp.textContent = t("auth_tab_sign_up");
        if (el.authSignInEmail) el.authSignInEmail.placeholder = t("email_placeholder");
        if (el.authSignInPassword) el.authSignInPassword.placeholder = t("password_signin_placeholder");
        if (el.authSignUpEmail) el.authSignUpEmail.placeholder = t("email_placeholder");
        if (el.authSignUpPassword) el.authSignUpPassword.placeholder = t("password_signup_placeholder");
        const authSignInLabels = el.authSignInForm?.querySelectorAll("label span");
        const authSignUpLabels = el.authSignUpForm?.querySelectorAll("label span");
        if (authSignInLabels?.[0]) authSignInLabels[0].textContent = t("email_label");
        if (authSignInLabels?.[1]) authSignInLabels[1].textContent = t("password_label");
        if (authSignUpLabels?.[0]) authSignUpLabels[0].textContent = t("email_label");
        if (authSignUpLabels?.[1]) authSignUpLabels[1].textContent = t("password_label");
        const authSignInSubmit = el.authSignInForm?.querySelector('button[type="submit"]');
        const authSignUpSubmit = el.authSignUpForm?.querySelector('button[type="submit"]');
        if (authSignInSubmit) authSignInSubmit.textContent = t("auth_sign_in_submit");
        if (authSignUpSubmit) authSignUpSubmit.textContent = t("auth_sign_up_submit");
        if (!state.config.authToken && el.authScreenStatus) {
            el.authScreenStatus.textContent = t("auth_not_authenticated");
        }

        if (el.billingHeadline) el.billingHeadline.textContent = t("billing_headline");
        if (el.billingSubheadline) el.billingSubheadline.textContent = t("billing_subheadline");
        if (el.billingSubscribeBtn) el.billingSubscribeBtn.textContent = t("billing_subscribe_btn");
        if (el.billingManageBtn) el.billingManageBtn.textContent = t("billing_manage_btn");
        if (el.settingsManageSubscriptionBtn) el.settingsManageSubscriptionBtn.textContent = t("billing_manage_btn");

        const listTitle = document.querySelector(".modal-content .row.space-between h2");
        if (listTitle) listTitle.textContent = t("list_title");
        const tabMap = {
            all: "tab_all",
            link: "tab_link",
            text: "tab_text",
            markdown: "tab_markdown",
            todo: "tab_todo",
            favorites: "tab_favorites",
            archived: "tab_archived"
        };
        el.listTabs.forEach((tab) => {
            const key = tabMap[tab.dataset.filter || "all"];
            if (key) tab.textContent = t(key);
        });
        if (el.searchInput) el.searchInput.placeholder = t("search_placeholder");
        if (el.syncBtn && !el.syncBtn.disabled) {
            el.syncBtn.textContent = t("sync_btn");
        }
        if (el.quickSyncBtn && !el.quickSyncBtn.disabled) {
            el.quickSyncBtn.textContent = t("quick_sync_btn");
        }
        const initialSyncLabels = Object.values(i18n).map((dict) => dict.sync_status_initial);
        if (el.syncStatus && (!el.syncStatus.textContent || initialSyncLabels.includes(el.syncStatus.textContent.trim()))) {
            el.syncStatus.textContent = t("sync_status_initial");
        }

        const settingsTitle = document.querySelector("#settingsPanel .modal-header-row h2");
        if (settingsTitle) settingsTitle.textContent = t("settings_title");
        const settingsLabels = document.querySelectorAll("#settingsPanel .field > span");
        if (settingsLabels[0]) settingsLabels[0].textContent = t("language_label");
        if (settingsLabels[1]) settingsLabels[1].textContent = t("ai_provider_label");
        if (settingsLabels[2]) settingsLabels[2].textContent = t("password_label");
        const toggleTitles = document.querySelectorAll("#settingsPanel .toggle-title");
        if (toggleTitles[0]) toggleTitles[0].textContent = t("link_preview_label");
        if (toggleTitles[1]) toggleTitles[1].textContent = t("summarize_label");
        if (el.passwordInput) el.passwordInput.placeholder = t("settings_password_placeholder");
        if (el.logoutBtn) el.logoutBtn.textContent = t("logout_btn");
        if (el.saveSettingsBtn) el.saveSettingsBtn.textContent = t("save_settings_btn");
        if (el.exportBtn) el.exportBtn.textContent = t("export_btn");
        if (el.importBtn) el.importBtn.textContent = t("import_btn");

        if (el.addModalTitle && !state.editingSnippetId) el.addModalTitle.textContent = t("new_snippet_title");
        const addModalSpans = document.querySelectorAll("#addModal .field > span");
        if (addModalSpans[0]) addModalSpans[0].textContent = t("snippet_type_label");
        if (addModalSpans[1]) addModalSpans[1].textContent = t("content_label");
        if (addModalSpans[2]) addModalSpans[2].textContent = t("checklist_label");
        if (addModalSpans[3]) addModalSpans[3].textContent = t("title_optional_label");
        if (addModalSpans[4]) addModalSpans[4].textContent = t("tags_label");
        const optionLink = el.snippetTypeInput?.querySelector('option[value="link"]');
        const optionText = el.snippetTypeInput?.querySelector('option[value="text"]');
        const optionMarkdown = el.snippetTypeInput?.querySelector('option[value="markdown"]');
        const optionTodo = el.snippetTypeInput?.querySelector('option[value="todo"]');
        if (optionLink) optionLink.textContent = t("type_link");
        if (optionText) optionText.textContent = t("type_text");
        if (optionMarkdown) optionMarkdown.textContent = t("type_markdown");
        if (optionTodo) optionTodo.textContent = t("type_todo");
        if (el.contentFieldLabel) el.contentFieldLabel.textContent = t("content_label");
        if (el.contentInput && (!el.snippetTypeInput || el.snippetTypeInput.value !== "link")) el.contentInput.placeholder = t("content_placeholder");
        if (el.addTodoItemBtn) el.addTodoItemBtn.textContent = t("add_task_btn");
        if (el.titleInput) el.titleInput.placeholder = t("title_placeholder");
        if (el.tagsInput) el.tagsInput.placeholder = t("tags_placeholder");
        if (el.addBtn) el.addBtn.textContent = state.editingSnippetId ? t("update_snippet_btn") : t("save_snippet_btn");
        if (el.todoViewTitle && !state.viewingTodoId) el.todoViewTitle.textContent = t("todo_view_title");
        if (el.contentViewTitle && !state.viewingContentId) el.contentViewTitle.textContent = t("content_view_title");
        if (el.copyContentViewBtn) el.copyContentViewBtn.textContent = t("copy_btn");
        if (el.closeContentViewBtn) el.closeContentViewBtn.textContent = t("close_btn");
    }

    function hasBaseConfig() {
        return true;
    }

    function updateAuthStatus() {
        if (!el.authStatus) return;
        if (state.config.authToken) {
            el.authStatus.textContent = t("auth_status_logged_in");
        } else {
            el.authStatus.textContent = t("auth_status_not_logged_in");
        }
    }

    function subscriptionLabel(status) {
        if (status === "active") return t("subscription_active");
        if (status === "trialing") return t("subscription_trialing");
        if (status === "past_due") return t("subscription_past_due");
        if (status === "canceled") return t("subscription_canceled");
        return t("subscription_inactive");
    }

    function updateBillingUI() {
        if (!el.billingStatusText) return;
        const hasSession = Boolean(state.config.authToken);
        const isPro = state.config.entitled === true;
        document.body.classList.toggle("is-pro", hasSession && isPro);

        if (el.settingsManageSubscriptionBtn) {
            el.settingsManageSubscriptionBtn.classList.toggle("hidden", !(hasSession && isPro));
        }

        if (shouldBypassSubscription()) {
            el.billingStatusText.textContent = `${t("billing_status_prefix")} ${t("billing_status_bypass")}`;
            if (el.billingCard) {
                el.billingCard.classList.add("hidden");
            }
            return;
        }
        const statusText = subscriptionLabel(state.config.subscriptionStatus || "inactive");
        el.billingStatusText.textContent = `${t("billing_status_prefix")} ${statusText}`;
        if (el.billingCard) {
            el.billingCard.classList.toggle("hidden", !hasSession || isPro);
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
            throw new Error(t("auth_gate_continue"));
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
            showToast(t("toast_configure_api"));
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
        setAuthScreenStatus(t("toast_account_created"));
    }

    async function login(credentials = null) {
        if (!hasBaseConfig()) {
            showToast(t("toast_configure_api"));
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
        setAuthScreenStatus(t("toast_login_success"));
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
        setAuthScreenStatus(t("auth_not_authenticated"));
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
        if (typeof uiCore.getDisplayTitle === "function") {
            return uiCore.getDisplayTitle(item, { fallbackLinkHost: true });
        }
        if (item.title && item.title.trim()) return item.title.trim();
        return "";
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
        if (typeof uiCore.getTypeClass === "function") {
            return uiCore.getTypeClass(type);
        }
        return type === "text" ? "text" : type === "markdown" ? "markdown" : type === "todo" ? "todo" : "link";
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
            showToast(t("toast_todo_update_error"));
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
            el.todoViewTitle.textContent = getDisplayTitle(item) || t("todo_view_title");
        }
        if (el.todoViewMeta) {
            const entries = parseTodoItems(item.content);
            const doneCount = entries.filter((entry) => entry.done).length;
            el.todoViewMeta.textContent = t("todo_done_counter", { done: doneCount, total: entries.length });
        }
        el.todoViewList.innerHTML = "";
        el.todoViewList.appendChild(createTodoListElement(item));
    }

    function openTodoViewModal(item) {
        state.viewingTodoId = item.id;
        renderTodoViewModal();
        openModal(el.todoViewModal);
    }

    function closeContentViewModal() {
        state.viewingContentId = null;
        if (el.contentViewBody) {
            el.contentViewBody.innerHTML = "";
        }
        closeModal(el.contentViewModal);
    }

    function getContentPreview(content) {
        if (typeof uiCore.getPreviewText === "function") {
            return uiCore.getPreviewText(content, 120);
        }
        return String(content || "");
    }

    function renderContentViewModal() {
        if (!state.viewingContentId || !el.contentViewBody) return;
        const item = state.items.find((row) => row.id === state.viewingContentId && (row.type === "text" || row.type === "link"));
        if (!item) {
            closeContentViewModal();
            return;
        }

        if (el.contentViewTitle) {
            el.contentViewTitle.textContent = getDisplayTitle(item) || t("content_view_title");
        }

        el.contentViewBody.innerHTML = "";
        const content = String(item.content || "");
        if (item.type === "link") {
            const links = content
                .split("\n")
                .map((line) => line.trim())
                .filter(Boolean);
            const list = document.createElement("ul");
            list.className = "content-view-links";
            links.forEach((link) => {
                const li = document.createElement("li");
                try {
                    new URL(link);
                    const anchor = document.createElement("a");
                    anchor.className = "content-view-link";
                    anchor.href = link;
                    anchor.target = "_blank";
                    anchor.rel = "noopener noreferrer";
                    anchor.textContent = link;
                    li.appendChild(anchor);
                } catch {
                    li.textContent = link;
                }
                list.appendChild(li);
            });
            el.contentViewBody.appendChild(list);
            return;
        }

        const pre = document.createElement("pre");
        pre.className = "content-view-text";
        pre.textContent = content;
        el.contentViewBody.appendChild(pre);
    }

    function openContentViewModal(item) {
        state.viewingContentId = item.id;
        renderContentViewModal();
        openModal(el.contentViewModal);
    }

    function createCard(item) {
        const card = document.createElement("article");
        card.className = "snippet-item";
        if (item.isFavorite) card.classList.add("favorite-snippet");
        if (item.isArchived) card.classList.add("archived-snippet");

        const header = typeof uiCore.createSnippetHeaderElement === "function"
            ? uiCore.createSnippetHeaderElement(item, {
                document,
                getTypeLabel,
                fallbackLinkHost: true,
                favoriteTitlePrefix: "⭐ "
            })
            : null;
        if (header) {
            card.appendChild(header);
        }

        const content = document.createElement("div");
        content.className = "snippet-content";
        if (item.type === "todo") {
            content.classList.add("todo-content");
            content.appendChild(createTodoListElement(item));
        } else if (item.type === "text" || item.type === "link") {
            content.classList.add("snippet-content-preview");
            content.textContent = getContentPreview(item.content);
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
        meta.textContent = typeof uiCore.getSnippetMetaText === "function"
            ? uiCore.getSnippetMetaText(item, {
                formatDate,
                updatedAtPrefix: t("updated_at_prefix"),
                archivedSuffix: t("archived_suffix")
            })
            : `${t("updated_at_prefix")} ${formatDate(item.updatedAt)}${item.isArchived ? ` • ${t("archived_suffix")}` : ""}`;
        card.appendChild(meta);

        const actions = document.createElement("div");
        actions.className = "snippet-actions";
        const descriptorResult = typeof uiCore.getSnippetActionDescriptors === "function"
            ? uiCore.getSnippetActionDescriptors(item, {
                summarizeEnabled: state.config.summarizeEnabled !== false,
                includeOpenAll: false,
                includeSummarize: true,
                includeEdit: true,
                includeDelete: true
            })
            : null;
        const actionState = descriptorResult?.actionState || (typeof uiCore.getSnippetActionState === "function"
            ? uiCore.getSnippetActionState(item, { summarizeEnabled: state.config.summarizeEnabled !== false })
            : {
                canOpenSingleLink: item.type === "link",
                canSummarizeLink: item.type === "link" && state.config.summarizeEnabled !== false,
                canOpenTodo: item.type === "todo",
                canShowFullContent: item.type === "text" || item.type === "link",
                primaryLink: item.content
            });
        const actionDescriptors = descriptorResult?.descriptors || [];

        actionDescriptors.forEach((descriptor) => {
            let btn = null;

            switch (descriptor.id) {
                case "open_link":
                    btn = document.createElement("button");
                    btn.className = "btn btn-small open-btn";
                    btn.type = "button";
                    btn.textContent = t("open_btn");
                    btn.addEventListener("click", () => window.open(descriptor.url || actionState.primaryLink, "_blank", "noopener,noreferrer"));
                    break;
                case "open_todo":
                    btn = document.createElement("button");
                    btn.className = "btn btn-small open-btn";
                    btn.type = "button";
                    btn.textContent = t("open_btn");
                    btn.addEventListener("click", () => openTodoViewModal(item));
                    break;
                case "show_content":
                    btn = document.createElement("button");
                    btn.className = "btn btn-small btn-primary";
                    btn.type = "button";
                    btn.textContent = t("show_btn");
                    btn.addEventListener("click", () => openContentViewModal(item));
                    break;
                case "favorite_toggle":
                    btn = document.createElement("button");
                    btn.className = `btn btn-small ${item.isFavorite ? "btn-favorite-active" : "btn-favorite"}`;
                    btn.type = "button";
                    btn.textContent = item.isFavorite ? t("unfavorite_btn") : t("favorite_btn");
                    btn.addEventListener("click", async () => {
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
                            showToast(t("toast_favorite_error"));
                        }
                    });
                    break;
                case "summarize_link":
                    btn = document.createElement("button");
                    btn.className = "btn btn-small btn-secondary";
                    btn.type = "button";
                    btn.textContent = t("summarize_btn");
                    btn.addEventListener("click", () => summarizeLink(descriptor.url || actionState.primaryLink));
                    break;
                case "archive_toggle":
                    btn = document.createElement("button");
                    btn.className = `btn btn-small ${item.isArchived ? "btn-archive-active" : "btn-archive"}`;
                    btn.type = "button";
                    btn.textContent = item.isArchived ? t("unarchive_btn") : t("archive_btn");
                    btn.addEventListener("click", async () => {
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
                            showToast(t("toast_archive_error"));
                        }
                    });
                    break;
                case "copy_content":
                    btn = document.createElement("button");
                    btn.className = "btn btn-small btn-secondary";
                    btn.type = "button";
                    btn.textContent = t("copy_btn");
                    btn.addEventListener("click", async () => {
                        const copied = await copyToClipboard(item.content);
                        showToast(copied ? t("toast_copy_success") : t("toast_copy_error"));
                    });
                    break;
                case "edit_snippet":
                    btn = document.createElement("button");
                    btn.className = "btn btn-small btn-primary";
                    btn.type = "button";
                    btn.textContent = t("edit_btn");
                    btn.addEventListener("click", () => openAddModalForEdit(item));
                    break;
                case "delete_snippet":
                    btn = document.createElement("button");
                    btn.className = "btn btn-small btn-danger";
                    btn.type = "button";
                    btn.textContent = t("delete_btn");
                    btn.addEventListener("click", async () => {
                        if (!window.confirm(t("confirm_delete"))) return;
                        try {
                            await removeSnippet(item.id);
                            await sync();
                        } catch (error) {
                            console.error(error);
                            showToast(t("toast_delete_error"));
                        }
                    });
                    break;
                default:
                    break;
            }

            if (btn) actions.appendChild(btn);
        });

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
        showToast(t("toast_export_done"));
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
            showToast(t("toast_import_done"));
        } catch (error) {
            console.error(error);
            showToast(t("toast_import_error"));
        }
    }

    function render() {
        applyFilter();
        el.countBadge.textContent = String(state.filtered.length);
        el.listContainer.innerHTML = "";

        if (!state.filtered.length) {
            const empty = document.createElement("div");
            empty.className = "empty-state";
            const emptyTitle = document.createElement("p");
            emptyTitle.textContent = t("empty_title");
            const emptySubtitle = document.createElement("p");
            emptySubtitle.textContent = t("empty_subtitle");
            empty.appendChild(emptyTitle);
            empty.appendChild(emptySubtitle);
            el.listContainer.appendChild(empty);
            return;
        }

        state.filtered.forEach((item) => {
            el.listContainer.appendChild(createCard(item));
        });
    }

    async function sync() {
        const setSyncButtonsLoading = (isLoading) => {
            if (el.syncBtn) {
                el.syncBtn.disabled = isLoading;
                el.syncBtn.textContent = isLoading ? t("syncing") : t("sync_btn");
            }
            if (el.quickSyncBtn) {
                el.quickSyncBtn.disabled = isLoading;
            }
        };

        let quickSyncResult = "error";
        setSyncButtonsLoading(true);
        setQuickSyncFeedback("loading");
        if (!hasBaseConfig()) {
            showToast(t("toast_configure_api"));
            if (el.syncStatus) {
                el.syncStatus.textContent = t("sync_status_incomplete");
            }
            quickSyncResult = "error";
            setSyncButtonsLoading(false);
            setQuickSyncFeedback(quickSyncResult);
            return;
        }
        if (!state.config.authToken) {
            showToast(t("toast_login_to_sync"));
            if (el.syncStatus) {
                el.syncStatus.textContent = t("sync_status_unauthenticated");
            }
            quickSyncResult = "error";
            setSyncButtonsLoading(false);
            setQuickSyncFeedback(quickSyncResult);
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
                el.syncStatus.textContent = t("sync_status_synced", { count: state.items.length });
            }
            showToast(t("toast_synced"));
            quickSyncResult = "success";
        } catch (error) {
            console.error(error);
            if (String(error.message || "") === "subscription_required") {
                state.config.entitled = false;
                state.config.subscriptionStatus = "inactive";
                localStorage.setItem(STORAGE_KEY, JSON.stringify(state.config));
                updateBillingUI();
                if (el.syncStatus) {
                    el.syncStatus.textContent = t("sync_status_subscription_required");
                }
                showToast(t("toast_subscription_required"));
                quickSyncResult = "locked";
                return;
            }
            if (el.syncStatus) {
                el.syncStatus.textContent = t("sync_status_error", { error: error.message });
            }
            showToast(t("toast_sync_error"));
            quickSyncResult = "error";
        } finally {
            setSyncButtonsLoading(false);
            setQuickSyncFeedback(quickSyncResult);
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
        input.placeholder = t("todo_task_placeholder");
        input.value = item.text || "";

        const remove = document.createElement("button");
        remove.type = "button";
        remove.className = "btn btn-danger todo-builder-remove";
        remove.textContent = "×";
        remove.title = t("todo_remove_task");

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
            el.contentFieldLabel.textContent = type === "link" ? t("content_label_url") : t("content_label");
        }
        if (el.contentInput) {
            el.contentInput.placeholder = type === "link" ? "https://..." : t("content_placeholder");
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
        if (el.addModalTitle) el.addModalTitle.textContent = t("new_snippet_title");
        if (el.addBtn) el.addBtn.textContent = t("save_snippet_btn");
        clearTodoBuilder();
        updateAddModalByType();
    }

    function openAddModalForEdit(item) {
        state.editingSnippetId = item.id;
        if (el.addModalTitle) el.addModalTitle.textContent = t("edit_snippet_title");
        if (el.addBtn) el.addBtn.textContent = t("update_snippet_btn");
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
            showToast(t("toast_configure_api"));
            return;
        }
        if (!state.config.authToken) {
            showToast(t("toast_login_to_save"));
            return;
        }

        const type = el.snippetTypeInput?.value || "link";
        let content = (el.contentInput?.value || "").trim();

        if (type === "todo") {
            syncTodoBuilderToContent();
            content = normalizeTodoContent(el.contentInput?.value || "");
            if (!content) {
                showToast(t("toast_add_task_required"));
                return;
            }
        } else if (!content) {
            showToast(type === "link" ? t("toast_enter_url") : t("toast_enter_content"));
            return;
        }

        if (type === "link") {
            try {
                new URL(content);
            } catch {
                showToast(t("toast_invalid_url"));
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
            showToast(existing ? t("toast_snippet_updated") : t("toast_snippet_saved"));
        } catch (error) {
            console.error(error);
            showToast(t("toast_save_error"));
        }
    }

    async function startCheckout() {
        try {
            const data = await createBillingSession("create_checkout");
            if (data?.url) {
                window.open(data.url, "_blank", "noopener,noreferrer");
            }
        } catch (error) {
            showToast(t("toast_checkout_error", { error: error.message }));
        }
    }

    async function openPortal() {
        try {
            const data = await createBillingSession("create_portal");
            if (data?.url) {
                window.open(data.url, "_blank", "noopener,noreferrer");
            }
        } catch (error) {
            showToast(t("toast_portal_error", { error: error.message }));
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
            showToast(t("toast_refreshed"));
        } catch (error) {
            console.error(error);
            showToast(t("toast_refresh_error"));
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
            toggleBtn.title = t("show_password");
            toggleBtn.setAttribute("aria-label", t("show_password"));

            toggleBtn.addEventListener("click", () => {
                const willShow = input.type === "password";
                input.type = willShow ? "text" : "password";
                toggleBtn.textContent = willShow ? "🙈" : "👁";
                toggleBtn.classList.toggle("active", willShow);
                const label = willShow ? t("hide_password") : t("show_password");
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
        if (el.closeContentViewModalBtn) {
            el.closeContentViewModalBtn.addEventListener("click", () => closeContentViewModal());
        }
        if (el.closeContentViewBtn) {
            el.closeContentViewBtn.addEventListener("click", () => closeContentViewModal());
        }
        if (el.copyContentViewBtn) {
            el.copyContentViewBtn.addEventListener("click", async () => {
                if (!state.viewingContentId) return;
                const item = state.items.find((row) => row.id === state.viewingContentId);
                if (!item) return;
                const copied = await copyToClipboard(item.content || "");
                showToast(copied ? t("toast_copy_success") : t("toast_copy_error"));
            });
        }
        if (el.sortBtn) {
            el.sortBtn.addEventListener("click", () => {
                state.sortAsc = !state.sortAsc;
                render();
                showToast(state.sortAsc ? t("toast_sorted_oldest") : t("toast_sorted_newest"));
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
                    setAuthScreenStatus(error.message || t("auth_error_login"));
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
                    setAuthScreenStatus(error.message || t("auth_error_register"));
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
                    showToast(t("toast_account_created"));
                    await sync();
                } catch (error) {
                    showToast(error.message || t("toast_register_error"));
                }
            });
        }

        if (el.loginBtn) {
            el.loginBtn.addEventListener("click", async () => {
                try {
                    await login();
                    showToast(t("toast_login_success"));
                    await sync();
                } catch (error) {
                    showToast(error.message || t("toast_login_error"));
                }
            });
        }

        if (el.logoutBtn) {
            el.logoutBtn.addEventListener("click", async () => {
                await logout();
                state.items = [];
                render();
                showToast(t("toast_logout_success"));
            });
        }

        if (el.syncBtn) {
            el.syncBtn.addEventListener("click", async () => {
                await sync();
            });
        }
        if (el.quickSyncBtn) {
            el.quickSyncBtn.addEventListener("click", async () => {
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
        if (el.settingsManageSubscriptionBtn) {
            el.settingsManageSubscriptionBtn.addEventListener("click", async () => {
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

        [el.settingsModal, el.addModal, el.todoViewModal, el.contentViewModal].forEach((modal) => {
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
                    if (modal === el.contentViewModal) {
                        closeContentViewModal();
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
            setAuthScreenStatus(t("auth_gate_continue"));
        }
        closeModal(el.settingsModal);
        closeModal(el.addModal);
        closeModal(el.todoViewModal);
        closeModal(el.contentViewModal);

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

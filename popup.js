
// Classe principal para gerenciar snippets
class SnippetManager {
    constructor() {
        this.snippets = [];
        this.currentFilter = 'all';
        this.currentSearch = '';
        this.currentTagFilter = null;
        this.editingId = null;
        this.deletingId = null;
        this.draggedElement = null;
        this.draggedIndex = -1;
        this.translationManager = new TranslationManager();
        this.summarizeEnabled = false;
        this.aiProvider = 'perplexity';
        
        this.init();
    }

    async init() {
        await this.loadSnippets();
        await this.loadSettings();
        this.setupEventListeners();
        this.updateLanguage();
        await this.renderTagFilters();
        await this.renderSnippets();
    }

    // Event Listeners
    setupEventListeners() {
        // Botões principais
        document.getElementById('addBtn').addEventListener('click', () => this.openModal());
        document.getElementById('sortBtn').addEventListener('click', async () => await this.sortSnippets());
        document.getElementById('settingsBtn').addEventListener('click', () => this.openSettingsModal());
        
        // Botão para abrir em nova aba
        const openInTabBtn = document.getElementById('openInTabBtn');
        if (openInTabBtn) {
            openInTabBtn.addEventListener('click', () => this.openInNewTab());
        }
        
        // Busca
        document.getElementById('searchInput').addEventListener('input', async (e) => {
            this.currentSearch = e.target.value.toLowerCase();
            await this.renderSnippets();
        });

        // Tag filter
        const clearTagFilterBtn = document.getElementById('clearTagFilter');
        if (clearTagFilterBtn) {
            clearTagFilterBtn.addEventListener('click', async () => {
                this.clearTagFilter();
                await this.renderSnippets();
            });
        }

        // Tabs
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.addEventListener('click', async (e) => {
                document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');
                this.currentFilter = e.target.dataset.type;
                await this.renderSnippets();
            });
        });

        // Modal
        document.getElementById('closeModal').addEventListener('click', () => this.closeModal());
        document.getElementById('cancelBtn').addEventListener('click', () => this.closeModal());
        document.getElementById('snippetForm').addEventListener('submit', (e) => this.handleSubmit(e));

        // Modal de exclusão
        document.getElementById('closeDeleteModal').addEventListener('click', () => this.closeDeleteModal());
        document.getElementById('cancelDeleteBtn').addEventListener('click', () => this.closeDeleteModal());
        document.getElementById('confirmDeleteBtn').addEventListener('click', () => this.confirmDelete());

        // Modal de configurações
        document.getElementById('closeSettingsModal').addEventListener('click', () => this.closeSettingsModal());
        document.getElementById('cancelSettingsBtn').addEventListener('click', () => this.closeSettingsModal());
        document.getElementById('saveSettingsBtn').addEventListener('click', () => this.saveSettings());
        
        // Toggle de resumo para mostrar/ocultar seletor de IA
        const summarizeToggle = document.getElementById('summarizeToggle');
        if (summarizeToggle) {
            summarizeToggle.addEventListener('change', () => this.toggleAiProviderVisibility());
        }
        
        // Import/Export buttons
        const exportBtn = document.getElementById('exportBtn');
        const importBtn = document.getElementById('importBtn');
        const importFile = document.getElementById('importFile');
        
        if (exportBtn) {
            exportBtn.addEventListener('click', () => {
                console.log('Botão de exportar clicado!');
                this.exportSnippets();
            });
        } else {
            console.error('Botão de exportar não encontrado!');
        }
        
        if (importBtn) {
            importBtn.addEventListener('click', () => {
                console.log('Botão de importar clicado!');
                this.triggerImport();
            });
        } else {
            console.error('Botão de importar não encontrado!');
        }
        
        if (importFile) {
            importFile.addEventListener('change', (e) => this.handleImport(e));
        } else {
            console.error('Input de arquivo não encontrado!');
        }

        // Fechar modal clicando fora
        window.addEventListener('click', (e) => {
            if (e.target.classList.contains('modal')) {
                this.closeModal();
                this.closeDeleteModal();
                this.closeSettingsModal();
            }
        });
    }

    // Gerenciamento de dados
    async loadSnippets() {
        try {
            const result = await chrome.storage.local.get(['snippets']);
            this.snippets = result.snippets || [];
            
            // Garantir que todos os snippets tenham a propriedade isArchived
            this.snippets.forEach(snippet => {
                if (snippet.isArchived === undefined) {
                    snippet.isArchived = false;
                }
            });
            
            // Salvar se houve alguma atualização
            if (this.snippets.some(snippet => snippet.isArchived === false && snippet.isArchived !== undefined)) {
                await this.saveSnippets();
            }
        } catch (error) {
            console.error('Erro ao carregar snippets:', error);
            this.snippets = [];
        }
    }

    async saveSnippets() {
        try {
            await chrome.storage.local.set({ snippets: this.snippets });
        } catch (error) {
            console.error('Erro ao salvar snippets:', error);
        }
    }

    // Gerenciamento de configurações
    async loadSettings() {
        try {
            const result = await chrome.storage.local.get(['language', 'linkPreviewEnabled', 'summarizeEnabled', 'aiProvider']);
            const language = result.language || 'pt';
            const linkPreviewEnabled = result.linkPreviewEnabled !== undefined ? result.linkPreviewEnabled : true;
            const summarizeEnabled = result.summarizeEnabled !== undefined ? result.summarizeEnabled : false;
            const aiProvider = result.aiProvider || 'perplexity';
            
            this.translationManager.setLanguage(language);
            this.linkPreviewEnabled = linkPreviewEnabled;
            this.summarizeEnabled = summarizeEnabled;
            this.aiProvider = aiProvider;
        } catch (error) {
            console.error('Erro ao carregar configurações:', error);
            this.translationManager.setLanguage('pt');
            this.linkPreviewEnabled = true; // Default habilitado
            this.summarizeEnabled = false; // Default desabilitado
            this.aiProvider = 'perplexity'; // Default Perplexity
        }
    }


    // Sistema de tradução
    t(key) {
        return this.translationManager.t(key);
    }

    toggleAiProviderVisibility() {
        const summarizeToggle = document.getElementById('summarizeToggle');
        const aiProviderGroup = document.getElementById('aiProviderGroup');
        
        if (summarizeToggle && aiProviderGroup) {
            aiProviderGroup.style.display = summarizeToggle.checked ? 'block' : 'none';
        }
    }

    updateLanguage() {
        // Atualizar atributo lang do HTML
        document.documentElement.lang = this.translationManager.getLocale();
        
        // Atualizar elementos da interface
        document.querySelector('h1').textContent = this.t('app_title');
        document.getElementById('addBtn').textContent = this.t('new_button');
        document.getElementById('sortBtn').textContent = this.t('sort_button');
        document.getElementById('searchInput').placeholder = this.t('search_placeholder');
        
        // Atualizar tabs
        const tabs = document.querySelectorAll('.tab-btn');
        const tabKeys = ['all_tab', 'links_tab', 'text_tab', 'favorites_tab', 'archived_tab'];
        const tabIcons = ['📋', '🔗', '📝', '⭐', '📁'];
        tabs.forEach((tab, index) => {
            // Limpar qualquer ícone existente e adicionar apenas um
            const cleanText = this.t(tabKeys[index]).replace(/^[^\w\s]*\s*/, '');
            tab.textContent = `${tabIcons[index]} ${cleanText}`;
        });
        
        // Atualizar estado vazio
        const emptyState = document.getElementById('emptyState');
        emptyState.innerHTML = `
            <p>${this.t('empty_state_title')}</p>
            <p>${this.t('empty_state_subtitle')}</p>
        `;
        
        // Atualizar modal de snippet
        document.getElementById('snippetTitle').placeholder = this.t('title_placeholder');
        document.getElementById('snippetContent').placeholder = this.t('content_placeholder');
        document.getElementById('snippetTags').placeholder = this.t('tags_placeholder');
        
        // Atualizar opções do select de tipo
        const typeSelect = document.getElementById('snippetType');
        typeSelect.innerHTML = `
            <option value="link">${this.t('link_type')}</option>
            <option value="text">${this.t('text_type')}</option>
        `;
        
        // Atualizar labels do formulário
        document.querySelector('label[for="snippetTitle"]').textContent = this.t('title_label');
        document.querySelector('label[for="snippetType"]').textContent = this.t('type_label');
        document.querySelector('label[for="snippetContent"]').textContent = this.t('content_label');
        document.querySelector('label[for="snippetTags"]').textContent = this.t('tags_label');
        
        // Atualizar botões do modal
        document.getElementById('cancelBtn').textContent = this.t('cancel_button');
        document.querySelector('#snippetForm button[type="submit"]').textContent = this.t('save_button');
        
        // Atualizar modal de exclusão
        document.querySelector('#deleteModal .modal-header h2').textContent = this.t('confirm_delete_title');
        document.querySelector('#deleteModal .modal-body p').textContent = this.t('confirm_delete_text');
        document.querySelector('#deleteModal .delete-warning').textContent = this.t('delete_warning');
        document.getElementById('cancelDeleteBtn').textContent = this.t('cancel_button');
        document.getElementById('confirmDeleteBtn').textContent = this.t('delete_button');
        
        // Atualizar modal de configurações
        document.querySelector('#settingsModal .modal-header h2').textContent = this.t('settings_title');
        document.querySelector('#settingsModal label[for="languageSelect"]').textContent = this.t('language_label');
        document.getElementById('linkPreviewLabel').textContent = this.t('link_preview_label');
        document.getElementById('linkPreviewDescription').textContent = this.t('link_preview_description');
        
        const summarizeLabel = document.getElementById('summarizeLabel');
        const summarizeDescription = document.getElementById('summarizeDescription');
        if (summarizeLabel) summarizeLabel.textContent = this.t('summarize_label');
        if (summarizeDescription) summarizeDescription.textContent = this.t('summarize_description');
        
        const aiProviderLabel = document.getElementById('aiProviderLabel');
        const aiProviderDescription = document.getElementById('aiProviderDescription');
        if (aiProviderLabel) aiProviderLabel.textContent = this.t('ai_provider_label');
        if (aiProviderDescription) aiProviderDescription.textContent = this.t('ai_provider_description');
        
        // Atualizar opções do select de IA
        const aiProviderSelect = document.getElementById('aiProviderSelect');
        if (aiProviderSelect) {
            aiProviderSelect.innerHTML = `
                <option value="perplexity">${this.t('perplexity_ai')}</option>
                <option value="chatgpt">${this.t('chatgpt')}</option>
            `;
            aiProviderSelect.value = this.aiProvider;
        }
        document.getElementById('dataLabel').textContent = this.t('data_label');
        document.getElementById('exportBtn').textContent = this.t('export_button');
        document.getElementById('importBtn').textContent = this.t('import_button');
        document.getElementById('dataDescription').textContent = this.t('data_description');
        document.getElementById('saveSettingsBtn').textContent = this.t('save_button');
        document.getElementById('cancelSettingsBtn').textContent = this.t('cancel_button');
        
        // Atualizar elementos do filtro de tags
        const tagsFilterTitle = document.getElementById('tagsFilterTitle');
        if (tagsFilterTitle) {
            tagsFilterTitle.textContent = this.t('tags_filter_title');
        }
        
        const clearTagFilterBtn = document.getElementById('clearTagFilter');
        if (clearTagFilterBtn) {
            clearTagFilterBtn.textContent = this.t('clear_tag_filter');
        }
        
        // Atualizar opções do select de idioma
        const languageSelect = document.getElementById('languageSelect');
        languageSelect.innerHTML = `
            <option value="pt">${this.t('portuguese')}</option>
            <option value="en">${this.t('english')}</option>
            <option value="fr">${this.t('french')}</option>
        `;
        languageSelect.value = this.translationManager.getCurrentLanguage();
    }

    // Renderização
    async renderSnippets() {
        const container = document.getElementById('snippetsList');
        const emptyState = document.getElementById('emptyState');
        
        const filteredSnippets = this.getFilteredSnippets();
        
        if (filteredSnippets.length === 0) {
            container.style.display = 'none';
            emptyState.style.display = 'block';
            return;
        }

        container.style.display = 'block';
        emptyState.style.display = 'none';
        
        // Renderizar snippets com previews de forma assíncrona
        const snippetsHTML = await Promise.all(
            filteredSnippets.map(snippet => this.createSnippetHTML(snippet))
        );
        
        container.innerHTML = snippetsHTML.join('');
        
        // Adicionar event listeners aos snippets
        this.attachSnippetListeners();
    }

    getFilteredSnippets() {
        let filtered = this.snippets;

        // Filtrar por tipo
        if (this.currentFilter !== 'all' && this.currentFilter !== 'favorites' && this.currentFilter !== 'archived') {
            filtered = filtered.filter(snippet => snippet.type === this.currentFilter);
        }

        // Filtrar por favoritos
        if (this.currentFilter === 'favorites') {
            filtered = filtered.filter(snippet => snippet.isFavorite === true);
        }

        // Filtrar por arquivados
        if (this.currentFilter === 'archived') {
            filtered = filtered.filter(snippet => snippet.isArchived === true);
        }

        // Para outros filtros, excluir arquivados por padrão
        if (this.currentFilter !== 'archived') {
            filtered = filtered.filter(snippet => !snippet.isArchived);
        }

        // Filtrar por tag
        if (this.currentTagFilter) {
            filtered = filtered.filter(snippet => 
                snippet.tags && snippet.tags.includes(this.currentTagFilter)
            );
        }

        // Filtrar por busca
        if (this.currentSearch) {
            filtered = filtered.filter(snippet => {
                const title = snippet.title ? snippet.title.toLowerCase() : '';
                return title.includes(this.currentSearch) ||
                       snippet.content.toLowerCase().includes(this.currentSearch) ||
                       (snippet.tags && snippet.tags.some(tag => tag.toLowerCase().includes(this.currentSearch)));
            });
        }

        return filtered;
    }

    async createSnippetHTML(snippet) {
        const tags = snippet.tags ? snippet.tags.map(tag => `<span class="tag">${tag}</span>`).join('') : '';
        const date = new Date(snippet.createdAt).toLocaleDateString(this.translationManager.getLocale());
        const hasTitle = snippet.title && snippet.title.trim();
        const displayTitle = hasTitle ? this.escapeHtml(snippet.title.trim()) : '';
        const favoriteIcon = snippet.isFavorite ? '⭐' : '☆';
        const favoriteClass = snippet.isFavorite ? 'btn-favorite-active' : 'btn-favorite';
        const favoriteText = snippet.isFavorite ? this.t('favorite_active_button') : this.t('favorite_button');
        const favoriteTooltip = snippet.isFavorite ? this.t('remove_favorite_tooltip') : this.t('add_favorite_tooltip');
        
        const archiveIcon = snippet.isArchived ? '📂' : '📁';
        const archiveClass = snippet.isArchived ? 'btn-archive-active' : 'btn-archive';
        const archiveText = snippet.isArchived ? this.t('unarchive_button') : this.t('archive_button');
        const archiveTooltip = snippet.isArchived ? this.t('unarchive_tooltip') : this.t('archive_tooltip');
        
        
        
        // Gerar preview para links (apenas se habilitado)
        let linkPreview = '';
        if (this.linkPreviewEnabled && snippet.type === 'link' && this.isValidUrl(snippet.content)) {
            // Mostrar loading inicial
            linkPreview = `
                <div class="link-preview preview-loading">
                    <div class="preview-image preview-placeholder">⏳</div>
                    <div class="preview-content">
                        <div class="preview-title">Carregando preview...</div>
                        <div class="preview-description">Buscando informações do link</div>
                        <div class="preview-url">${this.escapeHtml(snippet.content)}</div>
                    </div>
                </div>
            `;
            
            // Buscar preview em background
            this.generateLinkPreview(snippet.content).then(preview => {
                if (preview) {
                    const previewImage = preview.image ? 
                        `<div class="preview-image" style="background-image: url('${preview.image}'); background-size: cover; background-position: center;"></div>` :
                        `<div class="preview-image preview-placeholder">🔗</div>`;
                    
                    const snippetElement = document.querySelector(`[data-id="${snippet.id}"] .link-preview`);
                    if (snippetElement) {
                        snippetElement.outerHTML = `
                            <div class="link-preview">
                                ${previewImage}
                                <div class="preview-content">
                                    <div class="preview-title">${this.escapeHtml(preview.title)}</div>
                                    ${preview.description ? `<div class="preview-description">${this.escapeHtml(preview.description)}</div>` : ''}
                                    <div class="preview-url">${this.escapeHtml(preview.url)}</div>
                                </div>
                            </div>
                        `;
                        
                        // Re-attach event listeners apenas para o preview específico
                        this.attachLinkPreviewListener(snippetElement);
                    }
                }
            }).catch(error => {
                console.error('Erro ao gerar preview:', error);
                // Remover loading em caso de erro
                const snippetElement = document.querySelector(`[data-id="${snippet.id}"] .link-preview`);
                if (snippetElement) {
                    snippetElement.remove();
                }
            });
        }
        
        return `
            <div class="snippet-item ${snippet.isFavorite ? 'favorite-snippet' : ''} ${snippet.isArchived ? 'archived-snippet' : ''}" data-id="${snippet.id}" draggable="true">
                <div class="drag-handle">⋮⋮</div>
                <div class="snippet-header">
                    ${hasTitle ? `<h3 class="snippet-title">${displayTitle}</h3>` : ''}
                    <span class="snippet-type ${snippet.type}">${snippet.type === 'link' ? this.t('link_type') : this.t('text_type')}</span>
                </div>
                <div class="snippet-content">${this.escapeHtml(snippet.content)}</div>
                ${linkPreview}
                ${tags ? `<div class="snippet-tags">${tags}</div>` : ''}
                <div class="snippet-actions">
                    ${snippet.type === 'link' ? `<button class="btn btn-small open-btn" data-url="${snippet.content}">${this.t('open_button')}</button>` : ''}
                    <button class="btn btn-small ${favoriteClass} favorite-btn" data-id="${snippet.id}" title="${favoriteTooltip}">${favoriteIcon} ${favoriteText}</button>
                    ${snippet.type === 'link' && this.summarizeEnabled ? `<button class="btn btn-small summarize-btn" data-url="${snippet.content}">${this.t('summarize_button')}</button>` : ''}
                    <button class="btn btn-small ${archiveClass} archive-btn" data-id="${snippet.id}" title="${archiveTooltip}">${archiveIcon} ${archiveText}</button>
                    <button class="btn btn-small copy-btn" data-id="${snippet.id}">${this.t('copy_button')}</button>
                    <button class="btn btn-small btn-primary edit-btn" data-id="${snippet.id}">${this.t('edit_button')}</button>
                    <button class="btn btn-small btn-danger delete-btn" data-id="${snippet.id}">${this.t('delete_button')}</button>
                </div>
                <div class="snippet-date">${this.t('created_at')} ${date}</div>
            </div>
        `;
    }

    attachSnippetListeners() {
        // Limpar event listeners existentes para evitar duplicação
        this.removeSnippetListeners();
        
        // Botões de favorito
        document.querySelectorAll('.favorite-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const id = e.target.dataset.id;
                this.toggleFavorite(id);
            });
        });

        // Botões de arquivar
        document.querySelectorAll('.archive-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                const id = e.target.dataset.id;
                this.toggleArchive(id);
            });
        });

        // Botões de editar
        document.querySelectorAll('.edit-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const id = e.target.dataset.id;
                this.editSnippet(id);
            });
        });

        // Botões de copiar
        document.querySelectorAll('.copy-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const id = e.target.dataset.id;
                this.copySnippet(id);
            });
        });

        // Botões de excluir
        document.querySelectorAll('.delete-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const id = e.target.dataset.id;
                this.deleteSnippet(id);
            });
        });

        // Botões de abrir link
        document.querySelectorAll('.open-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const url = e.target.dataset.url;
                this.openLink(url);
            });
        });

        // Botões de resumir
        document.querySelectorAll('.summarize-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const url = e.target.dataset.url;
                this.summarizeLink(url);
            });
        });

        // Clique no snippet para copiar
        document.querySelectorAll('.snippet-item').forEach(item => {
            item.addEventListener('click', (e) => {
                if (!e.target.closest('.snippet-actions') && !e.target.closest('.drag-handle') && !e.target.closest('.link-preview')) {
                    const id = item.dataset.id;
                    this.copySnippet(id);
                }
            });
        });

        // Clique na preview para abrir o link
        document.querySelectorAll('.link-preview').forEach(preview => {
            preview.addEventListener('click', (e) => {
                e.stopPropagation();
                const snippetItem = preview.closest('.snippet-item');
                const snippetId = snippetItem.dataset.id;
                const snippet = this.snippets.find(s => s.id === snippetId);
                if (snippet && snippet.type === 'link') {
                    this.openLink(snippet.content);
                }
            });
        });

        // Drag and Drop listeners
        document.querySelectorAll('.snippet-item').forEach(item => {
            this.attachDragListeners(item);
        });
    }

    // Função para anexar listener apenas ao preview específico
    attachLinkPreviewListener(previewElement) {
        if (previewElement) {
            previewElement.addEventListener('click', (e) => {
                e.stopPropagation();
                const snippetItem = previewElement.closest('.snippet-item');
                const snippetId = snippetItem.dataset.id;
                const snippet = this.snippets.find(s => s.id === snippetId);
                if (snippet && snippet.type === 'link') {
                    this.openLink(snippet.content);
                }
            });
        }
    }

    // Função para remover event listeners existentes
    removeSnippetListeners() {
        // Remover todos os event listeners clonando os elementos
        const snippetsList = document.getElementById('snippetsList');
        if (snippetsList) {
            const newSnippetsList = snippetsList.cloneNode(true);
            snippetsList.parentNode.replaceChild(newSnippetsList, snippetsList);
        }
    }

    // Drag and Drop functionality
    attachDragListeners(element) {
        element.addEventListener('dragstart', (e) => this.handleDragStart(e));
        element.addEventListener('dragend', (e) => this.handleDragEnd(e));
        element.addEventListener('dragover', (e) => this.handleDragOver(e));
        element.addEventListener('drop', (e) => this.handleDrop(e));
        element.addEventListener('dragenter', (e) => this.handleDragEnter(e));
        element.addEventListener('dragleave', (e) => this.handleDragLeave(e));
    }

    handleDragStart(e) {
        this.draggedElement = e.target;
        this.draggedElement.classList.add('dragging');
        
        const snippetId = e.target.dataset.id;
        const filteredSnippets = this.getFilteredSnippets();
        this.draggedIndex = filteredSnippets.findIndex(snippet => snippet.id === snippetId);
        
        e.dataTransfer.effectAllowed = 'move';
        e.dataTransfer.setData('text/html', e.target.outerHTML);
    }

    handleDragEnd(e) {
        this.draggedElement.classList.remove('dragging');
        
        // Remove drag-over classes from all elements
        document.querySelectorAll('.snippet-item').forEach(item => {
            item.classList.remove('drag-over');
        });
        
        // Remove reorder indicators
        document.querySelectorAll('.reorder-indicator').forEach(indicator => {
            indicator.remove();
        });
        
        this.draggedElement = null;
        this.draggedIndex = -1;
    }

    handleDragOver(e) {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
    }

    handleDragEnter(e) {
        e.preventDefault();
        if (e.target.classList.contains('snippet-item') && e.target !== this.draggedElement) {
            e.target.classList.add('drag-over');
        }
    }

    handleDragLeave(e) {
        if (e.target.classList.contains('snippet-item')) {
            e.target.classList.remove('drag-over');
        }
    }

    async handleDrop(e) {
        e.preventDefault();
        
        if (!this.draggedElement || this.draggedElement === e.target) {
            return;
        }

        const dropTarget = e.target.closest('.snippet-item');
        if (!dropTarget) return;

        const dropTargetId = dropTarget.dataset.id;
        const filteredSnippets = this.getFilteredSnippets();
        const dropTargetIndex = filteredSnippets.findIndex(snippet => snippet.id === dropTargetId);

        if (this.draggedIndex === -1 || dropTargetIndex === -1) return;

        // Remove dragged snippet from original position
        const draggedSnippet = filteredSnippets.splice(this.draggedIndex, 1)[0];
        
        // Insert at new position
        const newIndex = this.draggedIndex < dropTargetIndex ? dropTargetIndex - 1 : dropTargetIndex;
        filteredSnippets.splice(newIndex, 0, draggedSnippet);

        // Update the main snippets array with the new order
        await this.updateSnippetsOrder(filteredSnippets);
        
        // Re-render to show new order
        this.renderSnippets();
        
        this.showNotification(this.t('order_updated'));
    }

    async updateSnippetsOrder(filteredSnippets) {
        // If we're filtering, we need to update the order in the main array
        if (this.currentFilter !== 'all' || this.currentSearch) {
            // Create a map of the new order
            const orderMap = {};
            filteredSnippets.forEach((snippet, index) => {
                orderMap[snippet.id] = index;
            });

            // Sort the main snippets array based on the new order
            this.snippets.sort((a, b) => {
                const orderA = orderMap[a.id] !== undefined ? orderMap[a.id] : this.snippets.length;
                const orderB = orderMap[b.id] !== undefined ? orderMap[b.id] : this.snippets.length;
                return orderA - orderB;
            });
        } else {
            // If no filtering, directly update the main array
            this.snippets = [...filteredSnippets];
        }

        await this.saveSnippets();
    }

    // Tag filtering functionality
    async renderTagFilters() {
        const tagsContainer = document.getElementById('tagsFilter');
        if (!tagsContainer) return;

        // Extract unique tags from all snippets
        const uniqueTags = this.getUniqueTags();
        
        if (uniqueTags.length === 0) {
            tagsContainer.innerHTML = `<span style="color: #6c757d; font-size: 12px; font-style: italic;">${this.t('no_tags_found')}</span>`;
            return;
        }

        // Create tag filter buttons
        const tagButtonsHTML = uniqueTags.map(tag => {
            const count = this.getTagCount(tag);
            const isActive = this.currentTagFilter === tag;
            return `
                <button class="tag-filter-btn ${isActive ? 'active' : ''}" data-tag="${this.escapeHtml(tag)}">
                    ${this.escapeHtml(tag)}
                    <span class="tag-count">${count}</span>
                </button>
            `;
        }).join('');

        tagsContainer.innerHTML = tagButtonsHTML;

        // Show/hide clear button based on active tag filter
        const clearBtn = document.getElementById('clearTagFilter');
        if (clearBtn) {
            clearBtn.style.display = this.currentTagFilter ? 'block' : 'none';
        }

        // Add event listeners to tag buttons
        this.attachTagFilterListeners();
    }

    getUniqueTags() {
        const allTags = new Set();
        this.snippets.forEach(snippet => {
            if (snippet.tags && Array.isArray(snippet.tags)) {
                snippet.tags.forEach(tag => {
                    if (tag && tag.trim()) {
                        allTags.add(tag.trim());
                    }
                });
            }
        });
        return Array.from(allTags).sort();
    }

    getTagCount(tag) {
        return this.snippets.filter(snippet => 
            snippet.tags && snippet.tags.includes(tag)
        ).length;
    }

    attachTagFilterListeners() {
        document.querySelectorAll('.tag-filter-btn').forEach(btn => {
            btn.addEventListener('click', async (e) => {
                e.stopPropagation();
                const tag = e.target.dataset.tag;
                await this.toggleTagFilter(tag);
            });
        });
    }

    async toggleTagFilter(tag) {
        if (this.currentTagFilter === tag) {
            this.currentTagFilter = null;
        } else {
            this.currentTagFilter = tag;
        }
        
        await this.renderTagFilters();
        await this.renderSnippets();
    }

    clearTagFilter() {
        this.currentTagFilter = null;
        this.renderTagFilters();
    }

    // Funcionalidades dos snippets
    async addSnippet(snippetData) {
        const snippet = {
            id: Date.now().toString(),
            title: snippetData.title,
            type: snippetData.type,
            content: snippetData.content,
            tags: snippetData.tags ? snippetData.tags.split(',').map(tag => tag.trim()).filter(tag => tag) : [],
            isFavorite: false,
            isArchived: false,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };

        this.snippets.unshift(snippet);
        await this.saveSnippets();
        await this.renderTagFilters();
        await this.renderSnippets();
    }

    async updateSnippet(id, snippetData) {
        const index = this.snippets.findIndex(s => s.id === id);
        if (index !== -1) {
            this.snippets[index] = {
                ...this.snippets[index],
                title: snippetData.title,
                type: snippetData.type,
                content: snippetData.content,
                tags: snippetData.tags ? snippetData.tags.split(',').map(tag => tag.trim()).filter(tag => tag) : [],
                updatedAt: new Date().toISOString()
            };
            await this.saveSnippets();
            await this.renderTagFilters();
            await this.renderSnippets();
        }
    }

    async toggleFavorite(id) {
        const index = this.snippets.findIndex(s => s.id === id);
        if (index !== -1) {
            this.snippets[index].isFavorite = !this.snippets[index].isFavorite;
            this.snippets[index].updatedAt = new Date().toISOString();
            await this.saveSnippets();
            await this.renderSnippets();
            
            const favoriteStatus = this.snippets[index].isFavorite ? this.t('snippet_favorited') : this.t('snippet_unfavorited');
            this.showNotification(`Snippet ${favoriteStatus}!`);
        }
    }

    async toggleArchive(id) {
        const index = this.snippets.findIndex(s => s.id === id);
        if (index !== -1) {
            this.snippets[index].isArchived = !this.snippets[index].isArchived;
            this.snippets[index].updatedAt = new Date().toISOString();
            await this.saveSnippets();
            await this.renderSnippets();
            
            const archiveStatus = this.snippets[index].isArchived ? this.t('snippet_archived') : this.t('snippet_unarchived');
            this.showNotification(`Snippet ${archiveStatus}!`);
        }
    }

    async deleteSnippetById(id) {
        this.snippets = this.snippets.filter(s => s.id !== id);
        await this.saveSnippets();
        await this.renderTagFilters();
        await this.renderSnippets();
    }

    editSnippet(id) {
        const snippet = this.snippets.find(s => s.id === id);
        if (snippet) {
            this.editingId = id;
            this.openModal(snippet);
        }
    }

    deleteSnippet(id) {
        this.deletingId = id;
        document.getElementById('deleteModal').style.display = 'block';
    }

    async confirmDelete() {
        if (this.deletingId) {
            await this.deleteSnippetById(this.deletingId);
            this.closeDeleteModal();
        }
    }

    copySnippet(id) {
        const snippet = this.snippets.find(s => s.id === id);
        if (snippet) {
            navigator.clipboard.writeText(snippet.content).then(() => {
                this.showNotification(this.t('snippet_copied'));
            }).catch(() => {
                this.showNotification(this.t('copy_error'));
            });
        }
    }

    openLink(url) {
        chrome.tabs.create({ url: url });
    }

    summarizeLink(url) {
        let summarizeUrl;
        
        if (this.aiProvider === 'chatgpt') {
            // ChatGPT URL format with hints=search and temporary-chat parameters
            const prompt = `Resuma o conteúdo deste link: ${url}`;
            summarizeUrl = `https://chat.openai.com/?q=${encodeURIComponent(prompt)}&hints=search&temporary-chat=true`;
        } else {
            // Perplexity AI URL format (default)
            summarizeUrl = `https://www.perplexity.ai/search?q=resuma+${encodeURIComponent(url)}&copilot=true`;
        }
        
        chrome.tabs.create({ url: summarizeUrl });
    }

    openInNewTab() {
        chrome.tabs.create({ url: chrome.runtime.getURL('fullpage.html') });
    }

    async sortSnippets() {
        this.snippets.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
        await this.saveSnippets();
        await this.renderSnippets();
        this.showNotification(this.t('snippets_sorted'));
    }

    // Modal
    openModal(snippet = null) {
        const modal = document.getElementById('snippetModal');
        const form = document.getElementById('snippetForm');
        const title = document.getElementById('modalTitle');
        
        if (snippet) {
            title.textContent = this.t('edit_snippet');
            document.getElementById('snippetTitle').value = snippet.title;
            document.getElementById('snippetType').value = snippet.type;
            document.getElementById('snippetContent').value = snippet.content;
            document.getElementById('snippetTags').value = snippet.tags ? snippet.tags.join(', ') : '';
        } else {
            title.textContent = this.t('new_snippet');
            form.reset();
            this.editingId = null;
        }
        
        modal.style.display = 'block';
        document.getElementById('snippetTitle').focus();
    }

    closeModal() {
        document.getElementById('snippetModal').style.display = 'none';
        this.editingId = null;
    }

    closeDeleteModal() {
        document.getElementById('deleteModal').style.display = 'none';
        this.deletingId = null;
    }

    async handleSubmit(e) {
        e.preventDefault();
        
        const formData = {
            title: document.getElementById('snippetTitle').value,
            type: document.getElementById('snippetType').value,
            content: document.getElementById('snippetContent').value,
            tags: document.getElementById('snippetTags').value
        };

        // Validação básica
        if (!formData.content.trim()) {
            this.showNotification(this.t('content_required'));
            return;
        }

        // Validação de URL para links
        if (formData.type === 'link') {
            try {
                new URL(formData.content);
            } catch {
                this.showNotification(this.t('invalid_url'));
                return;
            }
        }

        if (this.editingId) {
            await this.updateSnippet(this.editingId, formData);
            this.showNotification(this.t('snippet_updated'));
        } else {
            await this.addSnippet(formData);
            this.showNotification(this.t('snippet_added'));
        }

        this.closeModal();
    }

    // Modal de configurações
    openSettingsModal() {
        const modal = document.getElementById('settingsModal');
        const languageSelect = document.getElementById('languageSelect');
        const linkPreviewToggle = document.getElementById('linkPreviewToggle');
        const summarizeToggle = document.getElementById('summarizeToggle');
        const aiProviderSelect = document.getElementById('aiProviderSelect');
        
        languageSelect.value = this.translationManager.getCurrentLanguage();
        linkPreviewToggle.checked = this.linkPreviewEnabled;
        if (summarizeToggle) summarizeToggle.checked = this.summarizeEnabled;
        if (aiProviderSelect) aiProviderSelect.value = this.aiProvider;
        
        // Mostrar/ocultar seletor de IA baseado no toggle de resumo
        this.toggleAiProviderVisibility();
        
        modal.style.display = 'block';
    }

    closeSettingsModal() {
        document.getElementById('settingsModal').style.display = 'none';
    }

    async saveSettings() {
        const languageSelect = document.getElementById('languageSelect');
        const linkPreviewToggle = document.getElementById('linkPreviewToggle');
        const summarizeToggle = document.getElementById('summarizeToggle');
        const aiProviderSelect = document.getElementById('aiProviderSelect');
        
        const language = languageSelect.value;
        const linkPreviewEnabled = linkPreviewToggle.checked;
        const summarizeEnabled = summarizeToggle ? summarizeToggle.checked : false;
        const aiProvider = aiProviderSelect ? aiProviderSelect.value : 'perplexity';
        
        this.translationManager.setLanguage(language);
        this.linkPreviewEnabled = linkPreviewEnabled;
        this.summarizeEnabled = summarizeEnabled;
        this.aiProvider = aiProvider;
        
        await this.saveSettingsToStorage(language, linkPreviewEnabled, summarizeEnabled, aiProvider);
        this.updateLanguage();
        await this.renderSnippets();
        this.closeSettingsModal();
        this.showNotification(this.t('settings_saved'));
    }

    async saveSettingsToStorage(language, linkPreviewEnabled, summarizeEnabled, aiProvider) {
        try {
            await chrome.storage.local.set({ 
                language: language,
                linkPreviewEnabled: linkPreviewEnabled,
                summarizeEnabled: summarizeEnabled,
                aiProvider: aiProvider
            });
        } catch (error) {
            console.error('Erro ao salvar configurações:', error);
        }
    }

    // Import/Export functionality
    exportSnippets() {
        try {
            console.log('Iniciando exportação...', this.snippets.length, 'snippets');
            
            const exportData = {
                snippets: this.snippets,
                exportDate: new Date().toISOString(),
                version: '1.0'
            };
            
            const dataStr = JSON.stringify(exportData, null, 2);
            const dataBlob = new Blob([dataStr], { type: 'application/json' });
            
            const link = document.createElement('a');
            link.href = URL.createObjectURL(dataBlob);
            link.download = `snippets-export-${new Date().toISOString().split('T')[0]}.json`;
            
            // Adicionar link ao DOM temporariamente
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            
            URL.revokeObjectURL(link.href);
            
            console.log('Exportação concluída, mostrando notificação...');
            this.showNotification(this.t('export_success'));
        } catch (error) {
            console.error('Erro ao exportar snippets:', error);
            this.showNotification(this.t('export_error'));
        }
    }

    triggerImport() {
        document.getElementById('importFile').click();
    }

    async handleImport(event) {
        const file = event.target.files[0];
        
        if (!file) {
            this.showNotification(this.t('import_no_file'));
            return;
        }

        if (!file.name.toLowerCase().endsWith('.json')) {
            this.showNotification(this.t('import_invalid_file'));
            return;
        }

        try {
            const text = await file.text();
            const importData = JSON.parse(text);
            
            // Validate the imported data structure
            if (!importData.snippets || !Array.isArray(importData.snippets)) {
                throw new Error('Invalid file format');
            }

            // Validate each snippet has required fields
            const validSnippets = importData.snippets.filter(snippet => {
                return snippet.id && snippet.type && snippet.content && snippet.createdAt;
            });

            if (validSnippets.length === 0) {
                throw new Error('No valid snippets found in file');
            }

            // Merge with existing snippets (avoid duplicates by ID)
            const existingIds = new Set(this.snippets.map(s => s.id));
            const newSnippets = validSnippets.filter(snippet => !existingIds.has(snippet.id));
            
            // Add new snippets to the beginning of the array
            this.snippets = [...newSnippets, ...this.snippets];
            
            await this.saveSnippets();
            await this.renderTagFilters();
            await this.renderSnippets();
            
            // Reset file input
            event.target.value = '';
            
            this.showNotification(`${this.t('import_success')} (${newSnippets.length} snippets)`);
        } catch (error) {
            console.error('Erro ao importar snippets:', error);
            this.showNotification(this.t('import_error'));
        }
    }

    // Funcionalidade de pré-visualização de links
    async fetchLinkPreview(url) {
        try {
            // Usar o background script para fazer a requisição
            return new Promise((resolve, reject) => {
                chrome.runtime.sendMessage(
                    { action: 'fetchPreview', url: url },
                    (response) => {
                        if (chrome.runtime.lastError) {
                            console.error('Erro de runtime:', chrome.runtime.lastError);
                            reject(new Error(chrome.runtime.lastError.message));
                            return;
                        }
                        
                        if (response && response.success) {
                            resolve(response.preview);
                        } else {
                            reject(new Error(response?.error || 'Erro desconhecido'));
                        }
                    }
                );
            });
        } catch (error) {
            console.error('Erro ao buscar preview do link:', error);
            throw error;
        }
    }

    async generateLinkPreview(url) {
        // Verificar se já temos o preview em cache
        const cacheKey = `preview_${url}`;
        const cached = await this.getCachedPreview(cacheKey);
        if (cached) {
            return cached;
        }
        
        try {
            // Buscar novo preview
            const preview = await this.fetchLinkPreview(url);
            if (preview) {
                // Salvar no cache
                await this.cachePreview(cacheKey, preview);
                return preview;
            }
        } catch (error) {
            console.error('Erro ao gerar preview:', error);
            
            // Fallback: criar preview básico baseado na URL
            const fallbackPreview = this.createFallbackPreview(url);
            if (fallbackPreview) {
                await this.cachePreview(cacheKey, fallbackPreview);
                return fallbackPreview;
            }
        }
        
        return null;
    }

    createFallbackPreview(url) {
        try {
            const urlObj = new URL(url);
            let title = urlObj.hostname.replace('www.', '');
            let description = '';

            // Mapear domínios conhecidos para títulos mais amigáveis
            const domainMap = {
                'youtube.com': 'YouTube',
                'youtu.be': 'YouTube',
                'github.com': 'GitHub',
                'stackoverflow.com': 'Stack Overflow',
                'medium.com': 'Medium',
                'linkedin.com': 'LinkedIn',
                'twitter.com': 'Twitter',
                'instagram.com': 'Instagram',
                'facebook.com': 'Facebook',
                'netflix.com': 'Netflix',
                'amazon.com': 'Amazon',
                'google.com': 'Google',
                'docs.google.com': 'Google Docs',
                'drive.google.com': 'Google Drive',
                'sheets.google.com': 'Google Sheets',
                'chrome.google.com': 'Chrome Web Store'
            };

            if (domainMap[urlObj.hostname]) {
                title = domainMap[urlObj.hostname];
                description = `Link para ${title}`;
            } else {
                description = `Link para ${title}`;
            }

            return {
                title: title,
                description: description,
                image: '',
                url: url
            };
        } catch (error) {
            console.error('Erro ao criar fallback preview:', error);
            return null;
        }
    }

    async getCachedPreview(key) {
        try {
            const result = await chrome.storage.local.get([key]);
            const cached = result[key];
            
            // Verificar se o cache não expirou (24 horas)
            if (cached && Date.now() - cached.timestamp < 24 * 60 * 60 * 1000) {
                return cached.data;
            }
        } catch (error) {
            console.error('Erro ao buscar cache do preview:', error);
        }
        
        return null;
    }

    async cachePreview(key, data) {
        try {
            await chrome.storage.local.set({
                [key]: {
                    data: data,
                    timestamp: Date.now()
                }
            });
        } catch (error) {
            console.error('Erro ao salvar cache do preview:', error);
        }
    }

    isValidUrl(string) {
        try {
            new URL(string);
            return true;
        } catch (_) {
            return false;
        }
    }

    // Utilitários
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    showNotification(message) {
        console.log('Mostrando notificação:', message);
        
        // Remover notificações existentes
        const existingNotifications = document.querySelectorAll('.snippet-notification');
        existingNotifications.forEach(notif => notif.remove());
        
        // Criar notificação temporária
        const notification = document.createElement('div');
        notification.className = 'snippet-notification';
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #4CAF50;
            color: white;
            padding: 15px 25px;
            border-radius: 8px;
            font-size: 14px;
            font-weight: 600;
            z-index: 10000;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
            animation: slideIn 0.3s ease;
            max-width: 300px;
            word-wrap: break-word;
        `;
        notification.textContent = message;
        
        document.body.appendChild(notification);
        console.log('Notificação adicionada ao DOM');
        
        setTimeout(() => {
            notification.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => {
                if (notification.parentNode) {
                    document.body.removeChild(notification);
                }
            }, 300);
        }, 3000);
    }
}

// CSS para animações das notificações
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// Inicializar quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', () => {
    try {
        console.log('Inicializando SnippetManager...');
        new SnippetManager();
        console.log('SnippetManager inicializado com sucesso!');
    } catch (error) {
        console.error('Erro ao inicializar SnippetManager:', error);
    }
});


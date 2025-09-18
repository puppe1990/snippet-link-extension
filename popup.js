// Classe principal para gerenciar snippets
class SnippetManager {
    constructor() {
        this.snippets = [];
        this.currentFilter = 'all';
        this.currentSearch = '';
        this.editingId = null;
        this.deletingId = null;
        this.draggedElement = null;
        this.draggedIndex = -1;
        
        this.init();
    }

    async init() {
        await this.loadSnippets();
        this.setupEventListeners();
        this.renderSnippets();
    }

    // Event Listeners
    setupEventListeners() {
        // Botões principais
        document.getElementById('addBtn').addEventListener('click', () => this.openModal());
        document.getElementById('sortBtn').addEventListener('click', () => this.sortSnippets());
        
        // Busca
        document.getElementById('searchInput').addEventListener('input', (e) => {
            this.currentSearch = e.target.value.toLowerCase();
            this.renderSnippets();
        });

        // Tabs
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');
                this.currentFilter = e.target.dataset.type;
                this.renderSnippets();
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

        // Fechar modal clicando fora
        window.addEventListener('click', (e) => {
            if (e.target.classList.contains('modal')) {
                this.closeModal();
                this.closeDeleteModal();
            }
        });
    }

    // Gerenciamento de dados
    async loadSnippets() {
        try {
            const result = await chrome.storage.local.get(['snippets']);
            this.snippets = result.snippets || [];
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

    // Renderização
    renderSnippets() {
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
        
        container.innerHTML = filteredSnippets.map(snippet => this.createSnippetHTML(snippet)).join('');
        
        // Adicionar event listeners aos snippets
        this.attachSnippetListeners();
    }

    getFilteredSnippets() {
        let filtered = this.snippets;

        // Filtrar por tipo
        if (this.currentFilter !== 'all' && this.currentFilter !== 'favorites') {
            filtered = filtered.filter(snippet => snippet.type === this.currentFilter);
        }

        // Filtrar por favoritos
        if (this.currentFilter === 'favorites') {
            filtered = filtered.filter(snippet => snippet.isFavorite === true);
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

    createSnippetHTML(snippet) {
        const tags = snippet.tags ? snippet.tags.map(tag => `<span class="tag">${tag}</span>`).join('') : '';
        const date = new Date(snippet.createdAt).toLocaleDateString('pt-BR');
        const displayTitle = snippet.title.trim() || 'Sem título';
        const favoriteIcon = snippet.isFavorite ? '⭐' : '☆';
        const favoriteClass = snippet.isFavorite ? 'btn-favorite-active' : 'btn-favorite';
        
        return `
            <div class="snippet-item ${snippet.isFavorite ? 'favorite-snippet' : ''}" data-id="${snippet.id}" draggable="true">
                <div class="drag-handle">⋮⋮</div>
                <div class="snippet-header">
                    <h3 class="snippet-title">${this.escapeHtml(displayTitle)}</h3>
                    <span class="snippet-type ${snippet.type}">${snippet.type === 'link' ? '🔗 Link' : '📝 Texto'}</span>
                </div>
                <div class="snippet-content">${this.escapeHtml(snippet.content)}</div>
                ${tags ? `<div class="snippet-tags">${tags}</div>` : ''}
                <div class="snippet-actions">
                    <button class="btn btn-small ${favoriteClass} favorite-btn" data-id="${snippet.id}" title="${snippet.isFavorite ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}">${favoriteIcon} ${snippet.isFavorite ? 'Favorito' : 'Favoritar'}</button>
                    <button class="btn btn-small btn-primary edit-btn" data-id="${snippet.id}">✏️ Editar</button>
                    <button class="btn btn-small btn-secondary copy-btn" data-id="${snippet.id}">📋 Copiar</button>
                    <button class="btn btn-small btn-danger delete-btn" data-id="${snippet.id}">🗑️ Excluir</button>
                    ${snippet.type === 'link' ? `<button class="btn btn-small btn-secondary open-btn" data-url="${snippet.content}">🔗 Abrir</button>` : ''}
                </div>
                <div class="snippet-date">Criado em: ${date}</div>
            </div>
        `;
    }

    attachSnippetListeners() {
        // Botões de favorito
        document.querySelectorAll('.favorite-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const id = e.target.dataset.id;
                this.toggleFavorite(id);
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

        // Clique no snippet para copiar
        document.querySelectorAll('.snippet-item').forEach(item => {
            item.addEventListener('click', (e) => {
                if (!e.target.closest('.snippet-actions') && !e.target.closest('.drag-handle')) {
                    const id = item.dataset.id;
                    this.copySnippet(id);
                }
            });
        });

        // Drag and Drop listeners
        document.querySelectorAll('.snippet-item').forEach(item => {
            this.attachDragListeners(item);
        });
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
        
        this.showNotification('Ordem atualizada!');
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

    // Funcionalidades dos snippets
    async addSnippet(snippetData) {
        const snippet = {
            id: Date.now().toString(),
            title: snippetData.title,
            type: snippetData.type,
            content: snippetData.content,
            tags: snippetData.tags ? snippetData.tags.split(',').map(tag => tag.trim()).filter(tag => tag) : [],
            isFavorite: false,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };

        this.snippets.unshift(snippet);
        await this.saveSnippets();
        this.renderSnippets();
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
            this.renderSnippets();
        }
    }

    async toggleFavorite(id) {
        const index = this.snippets.findIndex(s => s.id === id);
        if (index !== -1) {
            this.snippets[index].isFavorite = !this.snippets[index].isFavorite;
            this.snippets[index].updatedAt = new Date().toISOString();
            await this.saveSnippets();
            this.renderSnippets();
            
            const favoriteStatus = this.snippets[index].isFavorite ? 'favoritado' : 'removido dos favoritos';
            this.showNotification(`Snippet ${favoriteStatus}!`);
        }
    }

    async deleteSnippetById(id) {
        this.snippets = this.snippets.filter(s => s.id !== id);
        await this.saveSnippets();
        this.renderSnippets();
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
                this.showNotification('Snippet copiado!');
            }).catch(() => {
                this.showNotification('Erro ao copiar snippet');
            });
        }
    }

    openLink(url) {
        chrome.tabs.create({ url: url });
    }

    sortSnippets() {
        this.snippets.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
        this.saveSnippets();
        this.renderSnippets();
        this.showNotification('Snippets ordenados por data de atualização');
    }

    // Modal
    openModal(snippet = null) {
        const modal = document.getElementById('snippetModal');
        const form = document.getElementById('snippetForm');
        const title = document.getElementById('modalTitle');
        
        if (snippet) {
            title.textContent = 'Editar Snippet';
            document.getElementById('snippetTitle').value = snippet.title;
            document.getElementById('snippetType').value = snippet.type;
            document.getElementById('snippetContent').value = snippet.content;
            document.getElementById('snippetTags').value = snippet.tags ? snippet.tags.join(', ') : '';
        } else {
            title.textContent = 'Novo Snippet';
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
            this.showNotification('Conteúdo é obrigatório');
            return;
        }

        // Validação de URL para links
        if (formData.type === 'link') {
            try {
                new URL(formData.content);
            } catch {
                this.showNotification('Por favor, insira uma URL válida');
                return;
            }
        }

        if (this.editingId) {
            await this.updateSnippet(this.editingId, formData);
            this.showNotification('Snippet atualizado!');
        } else {
            await this.addSnippet(formData);
            this.showNotification('Snippet adicionado!');
        }

        this.closeModal();
    }

    // Utilitários
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    showNotification(message) {
        // Criar notificação temporária
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #4CAF50;
            color: white;
            padding: 12px 20px;
            border-radius: 6px;
            font-size: 14px;
            font-weight: 500;
            z-index: 10000;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
            animation: slideIn 0.3s ease;
        `;
        notification.textContent = message;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 2000);
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


// Classe principal para gerenciar snippets
class SnippetManager {
    constructor() {
        this.snippets = [];
        this.currentFilter = 'all';
        this.currentSearch = '';
        this.editingId = null;
        this.deletingId = null;
        
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
        if (this.currentFilter !== 'all') {
            filtered = filtered.filter(snippet => snippet.type === this.currentFilter);
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
        
        return `
            <div class="snippet-item" data-id="${snippet.id}">
                <div class="snippet-header">
                    <h3 class="snippet-title">${this.escapeHtml(displayTitle)}</h3>
                    <span class="snippet-type ${snippet.type}">${snippet.type === 'link' ? '🔗 Link' : '📝 Texto'}</span>
                </div>
                <div class="snippet-content">${this.escapeHtml(snippet.content)}</div>
                ${tags ? `<div class="snippet-tags">${tags}</div>` : ''}
                <div class="snippet-actions">
                    <button class="btn btn-small btn-primary edit-btn" data-id="${snippet.id}">✏️ Editar</button>
                    <button class="btn btn-small btn-danger delete-btn" data-id="${snippet.id}">🗑️ Excluir</button>
                    ${snippet.type === 'link' ? `<button class="btn btn-small btn-secondary open-btn" data-url="${snippet.content}">🔗 Abrir</button>` : ''}
                </div>
                <div class="snippet-date">Criado em: ${date}</div>
            </div>
        `;
    }

    attachSnippetListeners() {
        // Botões de editar
        document.querySelectorAll('.edit-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const id = e.target.dataset.id;
                this.editSnippet(id);
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
                if (!e.target.closest('.snippet-actions')) {
                    const id = item.dataset.id;
                    this.copySnippet(id);
                }
            });
        });
    }

    // Funcionalidades dos snippets
    async addSnippet(snippetData) {
        const snippet = {
            id: Date.now().toString(),
            title: snippetData.title,
            type: snippetData.type,
            content: snippetData.content,
            tags: snippetData.tags ? snippetData.tags.split(',').map(tag => tag.trim()).filter(tag => tag) : [],
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


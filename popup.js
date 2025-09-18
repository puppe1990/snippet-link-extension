// Link Manager Extension - Main JavaScript File

class LinkManager {
    constructor() {
        this.links = [];
        this.currentSort = 'date';
        this.init();
    }

    async init() {
        try {
            console.log('Initializing LinkManager...');
            
            // Show loading state initially
            const loadingState = document.getElementById('loadingState');
            if (loadingState) {
                loadingState.classList.remove('hidden');
            }
            
            await this.loadLinks();
            this.bindEvents();
            this.renderLinks();
            console.log('LinkManager initialized successfully');
        } catch (error) {
            console.error('Error initializing LinkManager:', error);
            this.showNotification('Erro ao inicializar aplicação', 'error');
            
            // Hide loading state on error
            const loadingState = document.getElementById('loadingState');
            if (loadingState) {
                loadingState.classList.add('hidden');
            }
        }
    }

    // Event bindings
    bindEvents() {
        try {
            // Add link form
            const addForm = document.getElementById('addLinkForm');
            if (addForm) {
                addForm.addEventListener('submit', (e) => {
                    e.preventDefault();
                    this.addLink();
                });
            }

            // Sort select
            const sortSelect = document.getElementById('sortSelect');
            if (sortSelect) {
                sortSelect.addEventListener('change', (e) => {
                    this.currentSort = e.target.value;
                    this.renderLinks();
                });
            }

            // Edit modal
            const editForm = document.getElementById('editLinkForm');
            if (editForm) {
                editForm.addEventListener('submit', (e) => {
                    e.preventDefault();
                    this.saveEdit();
                });
            }

            const cancelBtn = document.getElementById('cancelEdit');
            if (cancelBtn) {
                cancelBtn.addEventListener('click', () => {
                    this.closeEditModal();
                });
            }

            // Close modal on outside click
            const editModal = document.getElementById('editModal');
            if (editModal) {
                editModal.addEventListener('click', (e) => {
                    if (e.target.id === 'editModal') {
                        this.closeEditModal();
                    }
                });
            }
        } catch (error) {
            console.error('Error binding events:', error);
        }
    }

    // Storage methods
    async loadLinks() {
        try {
            console.log('Loading links from storage...');
            
            // Check if chrome.storage is available
            if (typeof chrome === 'undefined' || !chrome.storage) {
                console.warn('Chrome storage API not available, using localStorage fallback');
                const stored = localStorage.getItem('snippet-links');
                this.links = stored ? JSON.parse(stored) : [];
                console.log('Loaded links from localStorage:', this.links);
                return;
            }
            
            const result = await chrome.storage.local.get(['links']);
            this.links = result.links || [];
            console.log('Loaded links from chrome.storage:', this.links);
        } catch (error) {
            console.error('Error loading links:', error);
            this.links = [];
        }
    }

    async saveLinks() {
        try {
            if (typeof chrome === 'undefined' || !chrome.storage) {
                console.warn('Chrome storage API not available, using localStorage fallback');
                localStorage.setItem('snippet-links', JSON.stringify(this.links));
                console.log('Saved links to localStorage');
                return;
            }
            
            await chrome.storage.local.set({ links: this.links });
            console.log('Saved links to chrome.storage');
        } catch (error) {
            console.error('Error saving links:', error);
        }
    }

    // CRUD operations
    async addLink() {
        const submitButton = document.querySelector('#addLinkForm button[type="submit"]');
        const originalText = submitButton.innerHTML;
        
        try {
            const url = document.getElementById('linkUrl').value.trim();

            if (!url) {
                this.showNotification('Por favor, preencha a URL', 'error');
                return;
            }

            // Validate URL
            try {
                new URL(url);
            } catch {
                this.showNotification('Por favor, insira uma URL válida', 'error');
                return;
            }

            // Check for duplicate URLs
            const existingLink = this.links.find(link => link.url === url);
            if (existingLink) {
                this.showNotification('Este link já foi adicionado anteriormente', 'error');
                return;
            }

            // Show loading state
            submitButton.innerHTML = '<div class="loading-spinner mr-2"></div>Adicionando...';
            submitButton.disabled = true;

            const newLink = {
                id: Date.now().toString(),
                url: url,
                date: new Date().toISOString()
            };

            this.links.unshift(newLink);
            console.log('Added new link:', newLink);
            console.log('Total links now:', this.links.length);
            await this.saveLinks();
            this.renderLinks();
            this.clearForm();
            this.showNotification('Link adicionado com sucesso!', 'success');
        } catch (error) {
            console.error('Error adding link:', error);
            this.showNotification('Erro ao adicionar link', 'error');
        } finally {
            // Restore button state
            submitButton.innerHTML = originalText;
            submitButton.disabled = false;
        }
    }

    editLink(id) {
        const link = this.links.find(l => l.id === id);
        if (!link) {
            this.showNotification('Link não encontrado', 'error');
            return;
        }

        try {
            document.getElementById('editLinkId').value = link.id;
            document.getElementById('editLinkUrl').value = link.url;
            
            const modal = document.getElementById('editModal');
            modal.classList.remove('hidden');
            
            // Focus no primeiro campo
            setTimeout(() => {
                document.getElementById('editLinkUrl').focus();
            }, 100);
        } catch (error) {
            console.error('Error opening edit modal:', error);
            this.showNotification('Erro ao abrir edição', 'error');
        }
    }

    async saveEdit() {
        try {
            const id = document.getElementById('editLinkId').value;
            const url = document.getElementById('editLinkUrl').value.trim();

            if (!url) {
                this.showNotification('Por favor, preencha a URL', 'error');
                return;
            }

            // Validate URL
            try {
                new URL(url);
            } catch {
                this.showNotification('Por favor, insira uma URL válida', 'error');
                return;
            }

            // Check for duplicate URLs (excluding current link)
            const existingLink = this.links.find(link => link.url === url && link.id !== id);
            if (existingLink) {
                this.showNotification('Este link já foi adicionado anteriormente', 'error');
                return;
            }

            const linkIndex = this.links.findIndex(l => l.id === id);
            if (linkIndex !== -1) {
                this.links[linkIndex].url = url;
                await this.saveLinks();
                this.renderLinks();
                this.closeEditModal();
                this.showNotification('Link editado com sucesso!', 'success');
            } else {
                this.showNotification('Link não encontrado', 'error');
            }
        } catch (error) {
            console.error('Error saving edit:', error);
            this.showNotification('Erro ao salvar edição', 'error');
        }
    }

    async deleteLink(id) {
        try {
            if (confirm('Tem certeza que deseja excluir este link?')) {
                this.links = this.links.filter(l => l.id !== id);
                await this.saveLinks();
                this.renderLinks();
                this.showNotification('Link excluído com sucesso!', 'success');
            }
        } catch (error) {
            console.error('Error deleting link:', error);
            this.showNotification('Erro ao excluir link', 'error');
        }
    }

    async copyLink(url) {
        try {
            if (navigator.clipboard && window.isSecureContext) {
                await navigator.clipboard.writeText(url);
                this.showNotification('Link copiado para a área de transferência!', 'success');
            } else {
                // Fallback for older browsers or non-secure contexts
                const textArea = document.createElement('textarea');
                textArea.value = url;
                textArea.style.position = 'fixed';
                textArea.style.left = '-999999px';
                textArea.style.top = '-999999px';
                document.body.appendChild(textArea);
                textArea.focus();
                textArea.select();
                
                try {
                    document.execCommand('copy');
                    this.showNotification('Link copiado para a área de transferência!', 'success');
                } catch (err) {
                    this.showNotification('Erro ao copiar link', 'error');
                } finally {
                    document.body.removeChild(textArea);
                }
            }
        } catch (error) {
            console.error('Error copying link:', error);
            this.showNotification('Erro ao copiar link', 'error');
        }
    }

    // UI methods
    renderLinks() {
        console.log('Rendering links, count:', this.links.length);
        console.log('Links array:', this.links);
        
        const linksList = document.getElementById('linksList');
        const emptyState = document.getElementById('emptyState');
        const loadingState = document.getElementById('loadingState');

        console.log('DOM elements found:', {
            linksList: !!linksList,
            emptyState: !!emptyState,
            loadingState: !!loadingState
        });

        // Always hide loading state when rendering
        if (loadingState) {
            loadingState.classList.add('hidden');
        }

        // Hide all states first
        if (linksList) linksList.classList.add('hidden');
        if (emptyState) emptyState.classList.add('hidden');

        if (!this.links || this.links.length === 0) {
            console.log('No links found, showing empty state');
            if (emptyState) {
                emptyState.classList.remove('hidden');
            }
            return;
        }

        console.log('Links found, showing list');
        if (linksList) {
            const sortedLinks = this.sortLinks([...this.links]);
            console.log('Sorted links count:', sortedLinks.length);
            console.log('Sorted links:', sortedLinks);
            
            const linksHTML = sortedLinks.map((link, index) => {
                console.log(`Creating HTML for link ${index}:`, link);
                return this.createLinkHTML(link);
            }).join('');
            
            console.log('Generated HTML length:', linksHTML.length);
            console.log('Links HTML preview:', linksHTML.substring(0, 500));
            
            linksList.innerHTML = linksHTML;
            linksList.classList.remove('hidden');
            
            // Additional debugging
            console.log('linksList children count after insert:', linksList.children.length);
            console.log('linksList scrollHeight:', linksList.scrollHeight);

            // Bind events for dynamically created elements
            this.bindLinkEvents();
        } else {
            console.error('linksList element not found!');
        }
    }

    createLinkHTML(link) {
        const date = new Date(link.date).toLocaleDateString('pt-BR');
        const displayTitle = link.url.length > 60 ? link.url.substring(0, 60) + '...' : link.url;
        return `
            <div class="link-card" data-link-id="${link.id}">
                <div class="flex items-start justify-between">
                    <div class="flex-1 min-w-0">
                        <div class="link-url" title="${this.escapeHtml(link.url)}">${this.escapeHtml(displayTitle)}</div>
                        <div class="link-date">Adicionado em ${date}</div>
                    </div>
                    <div class="flex items-center space-x-2 ml-3">
                        <button 
                            class="action-btn btn-open"
                            data-action="open"
                            data-url="${this.escapeHtml(link.url)}"
                            title="Abrir link"
                        >
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path>
                            </svg>
                        </button>
                        <button 
                            class="action-btn btn-copy"
                            data-action="copy"
                            data-url="${this.escapeHtml(link.url)}"
                            title="Copiar link"
                        >
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"></path>
                            </svg>
                        </button>
                        <button 
                            class="action-btn btn-edit"
                            data-action="edit"
                            data-link-id="${link.id}"
                            title="Editar link"
                        >
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                            </svg>
                        </button>
                        <button 
                            class="action-btn btn-delete"
                            data-action="delete"
                            data-link-id="${link.id}"
                            title="Excluir link"
                        >
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                            </svg>
                        </button>
                    </div>
                </div>
            </div>
        `;
    }

    bindLinkEvents() {
        const linksList = document.getElementById('linksList');
        if (!linksList) return;

        // Remove existing event listeners to prevent duplicates
        linksList.removeEventListener('click', this.handleLinkClick);
        
        // Add event delegation for all link actions
        this.handleLinkClick = (event) => {
            const button = event.target.closest('button[data-action]');
            if (!button) return;

            const action = button.getAttribute('data-action');
            const url = button.getAttribute('data-url');
            const linkId = button.getAttribute('data-link-id');

            console.log('Button clicked:', { action, url, linkId });

            switch (action) {
                case 'open':
                    if (url) this.openLink(url);
                    break;
                case 'copy':
                    if (url) this.copyLink(url);
                    break;
                case 'edit':
                    if (linkId) this.editLink(linkId);
                    break;
                case 'delete':
                    if (linkId) this.deleteLink(linkId);
                    break;
                default:
                    console.warn('Unknown action:', action);
            }
        };

        linksList.addEventListener('click', this.handleLinkClick);
    }

    sortLinks(links) {
        switch (this.currentSort) {
            case 'url':
                return links.sort((a, b) => a.url.localeCompare(b.url));
            case 'date':
            default:
                return links.sort((a, b) => new Date(b.date) - new Date(a.date));
        }
    }

    openLink(url) {
        try {
            chrome.tabs.create({ url: url });
        } catch (error) {
            console.error('Error opening link:', error);
            this.showNotification('Erro ao abrir link', 'error');
        }
    }

    closeEditModal() {
        try {
            const modal = document.getElementById('editModal');
            modal.classList.add('hidden');
            document.getElementById('editLinkForm').reset();
        } catch (error) {
            console.error('Error closing modal:', error);
        }
    }

    clearForm() {
        document.getElementById('addLinkForm').reset();
    }

    showNotification(message, type = 'success') {
        try {
            // Remove existing notifications
            const existingNotifications = document.querySelectorAll('.notification');
            existingNotifications.forEach(notification => {
                if (notification.parentNode) {
                    notification.remove();
                }
            });

            const notification = document.createElement('div');
            notification.className = `notification ${type === 'error' ? 'error' : ''}`;
            notification.textContent = message;

            // Ensure the notification is added to the popup container
            const container = document.querySelector('.w-96') || document.body;
            container.appendChild(notification);

            // Auto remove after 3 seconds
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.style.animation = 'slideOut 0.3s ease-in forwards';
                    setTimeout(() => {
                        if (notification.parentNode) {
                            notification.remove();
                        }
                    }, 300);
                }
            }, 3000);
        } catch (error) {
            console.error('Error showing notification:', error);
            // Fallback to alert for critical errors
            if (type === 'error') {
                alert(message);
            }
        }
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    // Debug utility function
    debugListVisibility() {
        console.log('=== DEBUG LIST VISIBILITY ===');
        const linksList = document.getElementById('linksList');
        const emptyState = document.getElementById('emptyState');
        const loadingState = document.getElementById('loadingState');
        
        console.log('Elements found:', {
            linksList: !!linksList,
            emptyState: !!emptyState,
            loadingState: !!loadingState
        });
        
        if (linksList) {
            const styles = window.getComputedStyle(linksList);
            console.log('linksList computed styles:', {
                display: styles.display,
                visibility: styles.visibility,
                opacity: styles.opacity,
                height: styles.height,
                width: styles.width,
                overflow: styles.overflow,
                position: styles.position,
                zIndex: styles.zIndex
            });
            console.log('linksList innerHTML:', linksList.innerHTML.substring(0, 300));
        }
        
        console.log('Current links:', this.links);
        console.log('=== END DEBUG ===');
    }

    // Force render utility
    forceRender() {
        console.log('Force rendering...');
        this.renderLinks();
    }
}

// Initialize the Link Manager when the popup loads
let linkManager;
document.addEventListener('DOMContentLoaded', () => {
    linkManager = new LinkManager();
    // Make linkManager globally accessible for onclick handlers
    window.linkManager = linkManager;
});

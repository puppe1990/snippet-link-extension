// Sistema de traduções para Snippet Link Manager
const translations = {
    pt: {
        // Interface principal
        'app_title': 'Snippet Manager',
        'new_button': '+ Novo',
        'sort_button': '🔄 Ordenar',
        'settings_button': '⚙️',
        'search_placeholder': '🔍 Buscar snippets...',
        'all_tab': 'Todos',
        'favorites_tab': '⭐ Favoritos',
        'links_tab': 'Links',
        'text_tab': 'Textos',
        'empty_state_title': '📋 Nenhum snippet encontrado',
        'empty_state_subtitle': 'Clique em "Novo" para adicionar seu primeiro snippet!',
        
        // Tag filter
        'tags_filter_title': '🏷️ Filtrar por Tags:',
        'clear_tag_filter': 'Limpar',
        'no_tags_found': 'Nenhuma tag encontrada',
        
        // Modal de snippet
        'new_snippet': 'Novo Snippet',
        'edit_snippet': 'Editar Snippet',
        'title_label': 'Título (opcional):',
        'title_placeholder': 'Digite um título...',
        'type_label': 'Tipo:',
        'link_type': '🔗 Link',
        'text_type': '📝 Texto',
        'content_label': 'Conteúdo:',
        'content_placeholder': 'Digite o link ou texto...',
        'tags_label': 'Tags (opcional):',
        'tags_placeholder': 'Ex: trabalho, estudo, importante',
        'cancel_button': 'Cancelar',
        'save_button': 'Salvar',
        
        // Modal de exclusão
        'confirm_delete_title': 'Confirmar Exclusão',
        'confirm_delete_text': 'Tem certeza que deseja excluir este snippet?',
        'delete_warning': 'Esta ação não pode ser desfeita.',
        'delete_button': 'Excluir',
        
        // Modal de configurações
        'settings_title': 'Configurações',
        'language_label': 'Idioma:',
        'portuguese': '🇧🇷 Português',
        'english': '🇺🇸 English',
        'french': '🇫🇷 Français',
        'link_preview_label': '🔗 Pré-visualização de Links:',
        'link_preview_description': 'Ativar preview automático para links salvos',
        'data_label': '📁 Backup e Restauração:',
        'export_button': '📤 Exportar Snippets',
        'import_button': '📥 Importar Snippets',
        'data_description': 'Exporte seus snippets para backup ou importe de outro dispositivo',
        
        // Ações dos snippets
        'copy_button': '📋 Copiar',
        'favorite_button': 'Favoritar',
        'favorite_active_button': 'Favorito',
        'edit_button': '✏️ Editar',
        'delete_button': '🗑️ Excluir',
        'open_button': '🔗 Abrir',
        'no_title': 'Sem título',
        'created_at': 'Criado em:',
        
        // Notificações
        'snippet_copied': 'Snippet copiado!',
        'copy_error': 'Erro ao copiar snippet',
        'snippet_added': 'Snippet adicionado!',
        'snippet_updated': 'Snippet atualizado!',
        'snippet_favorited': 'favoritado',
        'snippet_unfavorited': 'removido dos favoritos',
        'order_updated': 'Ordem atualizada!',
        'snippets_sorted': 'Snippets ordenados por data de atualização',
        'settings_saved': 'Configurações salvas!',
        'content_required': 'Conteúdo é obrigatório',
        'invalid_url': 'Por favor, insira uma URL válida',
        'add_favorite_tooltip': 'Adicionar aos favoritos',
        'remove_favorite_tooltip': 'Remover dos favoritos',
        'export_success': 'Snippets exportados com sucesso!',
        'export_error': 'Erro ao exportar snippets',
        'import_success': 'Snippets importados com sucesso!',
        'import_error': 'Erro ao importar snippets',
        'import_invalid_file': 'Arquivo inválido. Por favor, selecione um arquivo JSON válido.',
        'import_no_file': 'Nenhum arquivo selecionado',
        
        // Resumo
        'summarize_button': '📄 Resumir',
        'summarize_label': '📄 Resumo de Links:',
        'summarize_description': 'Ativar opção de resumir links com IA'
    },
    en: {
        // Main interface
        'app_title': 'Snippet Manager',
        'new_button': '+ New',
        'sort_button': '🔄 Sort',
        'settings_button': '⚙️',
        'search_placeholder': '🔍 Search snippets...',
        'all_tab': 'All',
        'favorites_tab': '⭐ Favorites',
        'links_tab': 'Links',
        'text_tab': 'Texts',
        'empty_state_title': '📋 No snippets found',
        'empty_state_subtitle': 'Click "New" to add your first snippet!',
        
        // Tag filter
        'tags_filter_title': '🏷️ Filter by Tags:',
        'clear_tag_filter': 'Clear',
        'no_tags_found': 'No tags found',
        
        // Snippet modal
        'new_snippet': 'New Snippet',
        'edit_snippet': 'Edit Snippet',
        'title_label': 'Title (optional):',
        'title_placeholder': 'Enter a title...',
        'type_label': 'Type:',
        'link_type': '🔗 Link',
        'text_type': '📝 Text',
        'content_label': 'Content:',
        'content_placeholder': 'Enter the link or text...',
        'tags_label': 'Tags (optional):',
        'tags_placeholder': 'Ex: work, study, important',
        'cancel_button': 'Cancel',
        'save_button': 'Save',
        
        // Delete modal
        'confirm_delete_title': 'Confirm Deletion',
        'confirm_delete_text': 'Are you sure you want to delete this snippet?',
        'delete_warning': 'This action cannot be undone.',
        'delete_button': 'Delete',
        
        // Settings modal
        'settings_title': 'Settings',
        'language_label': 'Language:',
        'portuguese': '🇧🇷 Português',
        'english': '🇺🇸 English',
        'french': '🇫🇷 Français',
        'link_preview_label': '🔗 Link Preview:',
        'link_preview_description': 'Enable automatic preview for saved links',
        'data_label': '📁 Backup and Restore:',
        'export_button': '📤 Export Snippets',
        'import_button': '📥 Import Snippets',
        'data_description': 'Export your snippets for backup or import from another device',
        
        // Snippet actions
        'copy_button': '📋 Copy',
        'favorite_button': 'Favorite',
        'favorite_active_button': 'Favorited',
        'edit_button': '✏️ Edit',
        'delete_button': '🗑️ Delete',
        'open_button': '🔗 Open',
        'no_title': 'No title',
        'created_at': 'Created at:',
        
        // Notifications
        'snippet_copied': 'Snippet copied!',
        'copy_error': 'Error copying snippet',
        'snippet_added': 'Snippet added!',
        'snippet_updated': 'Snippet updated!',
        'snippet_favorited': 'favorited',
        'snippet_unfavorited': 'removed from favorites',
        'order_updated': 'Order updated!',
        'snippets_sorted': 'Snippets sorted by update date',
        'settings_saved': 'Settings saved!',
        'content_required': 'Content is required',
        'invalid_url': 'Please enter a valid URL',
        'add_favorite_tooltip': 'Add to favorites',
        'remove_favorite_tooltip': 'Remove from favorites',
        'export_success': 'Snippets exported successfully!',
        'export_error': 'Error exporting snippets',
        'import_success': 'Snippets imported successfully!',
        'import_error': 'Error importing snippets',
        'import_invalid_file': 'Invalid file. Please select a valid JSON file.',
        'import_no_file': 'No file selected',
        
        // Summarize
        'summarize_button': '📄 Summarize',
        'summarize_label': '📄 Link Summarization:',
        'summarize_description': 'Enable option to summarize links with AI'
    },
    fr: {
        // Interface principale
        'app_title': 'Gestionnaire de Snippets',
        'new_button': '+ Nouveau',
        'sort_button': '🔄 Trier',
        'settings_button': '⚙️',
        'search_placeholder': '🔍 Rechercher des snippets...',
        'all_tab': 'Tous',
        'favorites_tab': '⭐ Favoris',
        'links_tab': 'Liens',
        'text_tab': 'Textes',
        'empty_state_title': '📋 Aucun snippet trouvé',
        'empty_state_subtitle': 'Cliquez sur "Nouveau" pour ajouter votre premier snippet !',
        
        // Tag filter
        'tags_filter_title': '🏷️ Filtrer par Tags :',
        'clear_tag_filter': 'Effacer',
        'no_tags_found': 'Aucune tag trouvée',
        
        // Modal de snippet
        'new_snippet': 'Nouveau Snippet',
        'edit_snippet': 'Modifier le Snippet',
        'title_label': 'Titre (optionnel) :',
        'title_placeholder': 'Entrez un titre...',
        'type_label': 'Type :',
        'link_type': '🔗 Lien',
        'text_type': '📝 Texte',
        'content_label': 'Contenu :',
        'content_placeholder': 'Entrez le lien ou le texte...',
        'tags_label': 'Tags (optionnel) :',
        'tags_placeholder': 'Ex: travail, étude, important',
        'cancel_button': 'Annuler',
        'save_button': 'Sauvegarder',
        
        // Modal de suppression
        'confirm_delete_title': 'Confirmer la Suppression',
        'confirm_delete_text': 'Êtes-vous sûr de vouloir supprimer ce snippet ?',
        'delete_warning': 'Cette action ne peut pas être annulée.',
        'delete_button': 'Supprimer',
        
        // Modal de paramètres
        'settings_title': 'Paramètres',
        'language_label': 'Langue :',
        'portuguese': '🇧🇷 Português',
        'english': '🇺🇸 English',
        'french': '🇫🇷 Français',
        'link_preview_label': '🔗 Aperçu des Liens :',
        'link_preview_description': 'Activer l\'aperçu automatique pour les liens sauvegardés',
        'data_label': '📁 Sauvegarde et Restauration :',
        'export_button': '📤 Exporter les Snippets',
        'import_button': '📥 Importer les Snippets',
        'data_description': 'Exportez vos snippets pour sauvegarde ou importez depuis un autre appareil',
        
        // Actions des snippets
        'copy_button': '📋 Copier',
        'favorite_button': 'Favoris',
        'favorite_active_button': 'Favorisé',
        'edit_button': '✏️ Modifier',
        'delete_button': '🗑️ Supprimer',
        'open_button': '🔗 Ouvrir',
        'no_title': 'Sans titre',
        'created_at': 'Créé le :',
        
        // Notifications
        'snippet_copied': 'Snippet copié !',
        'copy_error': 'Erreur lors de la copie du snippet',
        'snippet_added': 'Snippet ajouté !',
        'snippet_updated': 'Snippet mis à jour !',
        'snippet_favorited': 'ajouté aux favoris',
        'snippet_unfavorited': 'retiré des favoris',
        'order_updated': 'Ordre mis à jour !',
        'snippets_sorted': 'Snippets triés par date de mise à jour',
        'settings_saved': 'Paramètres sauvegardés !',
        'content_required': 'Le contenu est obligatoire',
        'invalid_url': 'Veuillez entrer une URL valide',
        'add_favorite_tooltip': 'Ajouter aux favoris',
        'remove_favorite_tooltip': 'Retirer des favoris',
        'export_success': 'Snippets exportés avec succès !',
        'export_error': 'Erreur lors de l\'exportation des snippets',
        'import_success': 'Snippets importés avec succès !',
        'import_error': 'Erreur lors de l\'importation des snippets',
        'import_invalid_file': 'Fichier invalide. Veuillez sélectionner un fichier JSON valide.',
        'import_no_file': 'Aucun fichier sélectionné',
        
        // Résumé
        'summarize_button': '📄 Résumer',
        'summarize_label': '📄 Résumé des Liens :',
        'summarize_description': 'Activer l\'option de résumer les liens avec IA'
    }
};

// Classe para gerenciar traduções
class TranslationManager {
    constructor() {
        this.currentLanguage = 'pt';
    }

    // Método para obter tradução
    t(key) {
        return translations[this.currentLanguage][key] || key;
    }

    // Método para definir idioma
    setLanguage(language) {
        this.currentLanguage = language;
    }

    // Método para obter idioma atual
    getCurrentLanguage() {
        return this.currentLanguage;
    }

    // Método para obter lista de idiomas disponíveis
    getAvailableLanguages() {
        return Object.keys(translations);
    }

    // Método para obter configurações de localização
    getLocale() {
        const localeMap = {
            'pt': 'pt-BR',
            'en': 'en-US',
            'fr': 'fr-FR'
        };
        return localeMap[this.currentLanguage] || 'pt-BR';
    }
}

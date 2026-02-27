(function attachSnippetUiCore(globalScope) {
    const uiCore = {
        escapeHtml(value) {
            const text = String(value ?? "");
            return text
                .replace(/&/g, "&amp;")
                .replace(/</g, "&lt;")
                .replace(/>/g, "&gt;")
                .replace(/"/g, "&quot;")
                .replace(/'/g, "&#39;");
        },

        getPreviewText(content, maxLength = 120) {
            const raw = String(content || "").replace(/\r/g, "");
            const lines = raw
                .split("\n")
                .map((line) => line.trim())
                .filter((line) => line.length > 0);
            if (!lines.length) return "";

            const firstLine = lines[0];
            if (firstLine.length > maxLength) {
                return `${firstLine.slice(0, maxLength).trimEnd()}...`;
            }
            if (lines.length > 1) {
                return `${firstLine}...`;
            }
            return firstLine;
        },

        getDisplayTitle(item, options) {
            const config = {
                fallbackLinkHost: true,
                ...(options || {})
            };
            const title = String(item?.title || "").trim();
            if (title) return title;
            if (!config.fallbackLinkHost) return "";
            if (item?.type !== "link") return "";

            const links = this.getLinkItems(item?.content || "");
            if (!links.length) return "";
            try {
                return new URL(links[0]).hostname.replace(/^www\./, "");
            } catch {
                return "";
            }
        },

        getTypeClass(type) {
            if (type === "text") return "text";
            if (type === "markdown") return "markdown";
            if (type === "todo") return "todo";
            return "link";
        },

        getLinkItems(content) {
            return String(content || "")
                .split("\n")
                .map((line) => line.trim())
                .filter(Boolean);
        },

        analyzeLinkContent(content) {
            const links = this.getLinkItems(content);
            const validLinks = links.filter((candidate) => {
                try {
                    const parsed = new URL(candidate);
                    return parsed.protocol === "http:" || parsed.protocol === "https:";
                } catch {
                    return false;
                }
            });
            return {
                links,
                validLinks,
                hasSingleLink: validLinks.length === 1 && links.length === 1,
                hasMultipleLinks: validLinks.length > 1 && links.length === validLinks.length,
                primaryLink: validLinks[0] || ""
            };
        },

        getSnippetActionState(item, options) {
            const config = {
                summarizeEnabled: true,
                ...(options || {})
            };
            const type = String(item?.type || "");
            const linkInfo = type === "link"
                ? this.analyzeLinkContent(item?.content || "")
                : {
                    links: [],
                    validLinks: [],
                    hasSingleLink: false,
                    hasMultipleLinks: false,
                    primaryLink: ""
                };

            return {
                type,
                canShowFullContent: type === "link" || type === "text",
                canOpenTodo: type === "todo",
                canOpenSingleLink: linkInfo.hasSingleLink,
                canOpenAllLinks: linkInfo.hasMultipleLinks,
                canSummarizeLink: type === "link" && linkInfo.hasSingleLink && config.summarizeEnabled !== false,
                primaryLink: linkInfo.primaryLink,
                validLinks: linkInfo.validLinks
            };
        },

        getSnippetActionDescriptors(item, options) {
            const config = {
                summarizeEnabled: true,
                includeOpenAll: true,
                includeSummarize: true,
                includeEdit: true,
                includeDelete: true,
                ...(options || {})
            };
            const actionState = this.getSnippetActionState(item, config);
            const descriptors = [];

            if (actionState.canOpenSingleLink) {
                descriptors.push({ id: "open_link", url: actionState.primaryLink });
            }
            if (actionState.canOpenTodo) {
                descriptors.push({ id: "open_todo", snippetId: item?.id });
            }
            if (config.includeOpenAll && actionState.canOpenAllLinks) {
                descriptors.push({ id: "open_all_links", urls: actionState.validLinks });
            }
            if (actionState.canShowFullContent) {
                descriptors.push({ id: "show_content", snippetId: item?.id });
            }

            descriptors.push({ id: "favorite_toggle", snippetId: item?.id, active: Boolean(item?.isFavorite) });

            if (config.includeSummarize && actionState.canSummarizeLink) {
                descriptors.push({ id: "summarize_link", url: actionState.primaryLink });
            }

            descriptors.push({ id: "archive_toggle", snippetId: item?.id, active: Boolean(item?.isArchived) });
            descriptors.push({ id: "copy_content", snippetId: item?.id });

            if (config.includeEdit) {
                descriptors.push({ id: "edit_snippet", snippetId: item?.id });
            }
            if (config.includeDelete) {
                descriptors.push({ id: "delete_snippet", snippetId: item?.id });
            }

            return { actionState, descriptors };
        },

        createSnippetHeaderElement(item, options) {
            const config = {
                document: typeof document !== "undefined" ? document : null,
                getTypeLabel: null,
                fallbackLinkHost: true,
                favoriteTitlePrefix: "",
                ...(options || {})
            };
            if (!config.document || typeof config.document.createElement !== "function") {
                return null;
            }

            const header = config.document.createElement("div");
            header.className = "snippet-header";

            const titleText = this.getDisplayTitle(item, { fallbackLinkHost: config.fallbackLinkHost });
            if (titleText) {
                const title = config.document.createElement("h3");
                title.className = "snippet-title";
                title.textContent = `${item?.isFavorite ? config.favoriteTitlePrefix : ""}${titleText}`;
                header.appendChild(title);
            }

            const type = config.document.createElement("span");
            const typeClass = this.getTypeClass(item?.type);
            type.className = `snippet-type ${typeClass}`;
            type.textContent = typeof config.getTypeLabel === "function"
                ? config.getTypeLabel(item?.type)
                : String(item?.type || "").toUpperCase();
            header.appendChild(type);

            return header;
        },

        getSnippetMetaText(item, options) {
            const config = {
                formatDate: null,
                updatedAtPrefix: "Atualizado:",
                archivedSuffix: "Arquivado",
                ...(options || {})
            };
            const dateText = typeof config.formatDate === "function"
                ? config.formatDate(item?.updatedAt || item?.createdAt || "")
                : String(item?.updatedAt || item?.createdAt || "-");
            const archivedText = item?.isArchived ? ` • ${config.archivedSuffix}` : "";
            return `${config.updatedAtPrefix} ${dateText}${archivedText}`;
        }
    };

    globalScope.SnippetUiCore = uiCore;
})(typeof window !== "undefined" ? window : globalThis);

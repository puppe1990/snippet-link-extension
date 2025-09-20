// Background script para lidar com requisições de preview de links
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'fetchPreview') {
        fetchLinkPreview(request.url)
            .then(preview => sendResponse({ success: true, preview }))
            .catch(error => sendResponse({ success: false, error: error.message }));
        return true; // Mantém o canal de mensagem aberto para resposta assíncrona
    }
});

async function fetchLinkPreview(url) {
    try {
        // Usar diferentes serviços de proxy como fallback
        const proxies = [
            {
                url: `https://api.allorigins.win/get?url=${encodeURIComponent(url)}`,
                parser: (data) => data.contents
            },
            {
                url: `https://api.codetabs.com/v1/proxy?quest=${encodeURIComponent(url)}`,
                parser: (data) => data.content || data
            }
        ];

        for (const proxy of proxies) {
            try {
                console.log(`Tentando proxy: ${proxy.url}`);
                
                const controller = new AbortController();
                const timeoutId = setTimeout(() => controller.abort(), 8000); // 8 segundos timeout

                const response = await fetch(proxy.url, {
                    method: 'GET',
                    headers: {
                        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
                        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
                    },
                    signal: controller.signal
                });

                clearTimeout(timeoutId);

                if (!response.ok) {
                    console.log(`Proxy retornou status ${response.status}`);
                    continue;
                }

                const data = await response.json();
                const htmlContent = proxy.parser(data);

                if (htmlContent && htmlContent.length > 100) {
                    console.log(`Preview obtido com sucesso via ${proxy.url}`);
                    return parseHTMLForPreview(htmlContent, url);
                }
            } catch (error) {
                if (error.name === 'AbortError') {
                    console.log(`Timeout no proxy ${proxy.url}`);
                } else {
                    console.log(`Proxy ${proxy.url} falhou:`, error.message);
                }
                continue;
            }
        }

        console.log('Todos os proxies falharam, usando fallback');
        // Se todos os proxies falharam, tentar extrair metadados básicos da URL
        return extractBasicPreview(url);

    } catch (error) {
        console.error('Erro ao buscar preview:', error);
        return extractBasicPreview(url);
    }
}

function parseHTMLForPreview(htmlContent, url) {
    // Criar um parser simples para extrair metadados
    const titleMatch = htmlContent.match(/<title[^>]*>([^<]+)<\/title>/i);
    const ogTitleMatch = htmlContent.match(/<meta[^>]*property=["']og:title["'][^>]*content=["']([^"']+)["'][^>]*>/i);
    const ogDescriptionMatch = htmlContent.match(/<meta[^>]*property=["']og:description["'][^>]*content=["']([^"']+)["'][^>]*>/i);
    const ogImageMatch = htmlContent.match(/<meta[^>]*property=["']og:image["'][^>]*content=["']([^"']+)["'][^>]*>/i);
    const descriptionMatch = htmlContent.match(/<meta[^>]*name=["']description["'][^>]*content=["']([^"']+)["'][^>]*>/i);

    const title = ogTitleMatch ? ogTitleMatch[1] : (titleMatch ? titleMatch[1] : 'Sem título');
    const description = ogDescriptionMatch ? ogDescriptionMatch[1] : (descriptionMatch ? descriptionMatch[1] : '');
    const image = ogImageMatch ? ogImageMatch[1] : '';

    return {
        title: cleanText(title),
        description: cleanText(description),
        image: cleanUrl(image, url),
        url: url
    };
}

function extractBasicPreview(url) {
    // Extrair informações básicas da URL quando não conseguimos acessar o conteúdo
    const urlObj = new URL(url);
    let title = urlObj.hostname;
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
        'sheets.google.com': 'Google Sheets'
    };

    if (domainMap[urlObj.hostname]) {
        title = domainMap[urlObj.hostname];
        description = `Link para ${title}`;
    } else {
        title = urlObj.hostname.replace('www.', '');
        description = `Link para ${title}`;
    }

    return {
        title: title,
        description: description,
        image: '',
        url: url
    };
}

function cleanText(text) {
    if (!text) return '';
    return text
        .replace(/&amp;/g, '&')
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&quot;/g, '"')
        .replace(/&#39;/g, "'")
        .trim()
        .substring(0, 200); // Limitar tamanho
}

function cleanUrl(imageUrl, baseUrl) {
    if (!imageUrl) return '';
    
    try {
        // Se é uma URL relativa, converter para absoluta
        if (imageUrl.startsWith('/')) {
            const base = new URL(baseUrl);
            return `${base.protocol}//${base.hostname}${imageUrl}`;
        }
        
        // Se é uma URL relativa sem barra inicial
        if (!imageUrl.startsWith('http')) {
            const base = new URL(baseUrl);
            return `${base.protocol}//${base.hostname}/${imageUrl}`;
        }
        
        return imageUrl;
    } catch (error) {
        return '';
    }
}

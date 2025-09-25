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
        // Verificar se é uma URL do YouTube e usar método específico
        if (isYouTubeUrl(url)) {
            console.log('Detectada URL do YouTube, usando método específico');
            return await fetchYouTubePreview(url);
        }

        // Usar diferentes serviços de proxy como fallback para outros sites
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

// Funções específicas para YouTube
function isYouTubeUrl(url) {
    try {
        const urlObj = new URL(url);
        return urlObj.hostname === 'youtube.com' || 
               urlObj.hostname === 'www.youtube.com' || 
               urlObj.hostname === 'youtu.be' ||
               urlObj.hostname === 'm.youtube.com';
    } catch (error) {
        return false;
    }
}

function extractVideoId(url) {
    try {
        const urlObj = new URL(url);
        
        // youtube.com/watch?v=VIDEO_ID
        if (urlObj.hostname.includes('youtube.com') && urlObj.searchParams.has('v')) {
            return urlObj.searchParams.get('v');
        }
        
        // youtu.be/VIDEO_ID
        if (urlObj.hostname === 'youtu.be') {
            return urlObj.pathname.substring(1);
        }
        
        // m.youtube.com/watch?v=VIDEO_ID
        if (urlObj.hostname === 'm.youtube.com' && urlObj.searchParams.has('v')) {
            return urlObj.searchParams.get('v');
        }
        
        return null;
    } catch (error) {
        return null;
    }
}

async function fetchYouTubePreview(url) {
    try {
        const videoId = extractVideoId(url);
        if (!videoId) {
            console.log('Não foi possível extrair ID do vídeo do YouTube');
            return extractBasicPreview(url);
        }

        console.log(`Buscando metadados do vídeo YouTube ID: ${videoId}`);

        // Primeiro, tentar uma abordagem mais simples usando apenas o videoId
        // Isso evita problemas de CORS e ainda fornece informações úteis
        try {
            const simplePreview = await fetchYouTubeSimplePreview(url, videoId);
            if (simplePreview) {
                console.log('Preview simples obtido com sucesso');
                return simplePreview;
            }
        } catch (simpleError) {
            console.log('Preview simples falhou:', simpleError.message);
        }

        // Primeiro, tentar usar o YouTube oEmbed API (mais confiável)
        try {
            const oEmbedUrl = `https://www.youtube.com/oembed?url=${encodeURIComponent(url)}&format=json`;
            console.log('Tentando oEmbed URL:', oEmbedUrl);
            
            const oEmbedResponse = await fetch(oEmbedUrl, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
                }
            });

            if (oEmbedResponse.ok) {
                const oEmbedData = await oEmbedResponse.json();
                console.log('Dados oEmbed obtidos com sucesso:', oEmbedData);
                
                return {
                    title: cleanText(oEmbedData.title),
                    description: `Vídeo do canal ${oEmbedData.author_name}`,
                    image: oEmbedData.thumbnail_url,
                    url: url,
                    channel: cleanText(oEmbedData.author_name),
                    videoId: videoId
                };
            } else {
                console.log('oEmbed falhou com status:', oEmbedResponse.status, oEmbedResponse.statusText);
            }
        } catch (oEmbedError) {
            console.log('oEmbed falhou com erro:', oEmbedError.name, oEmbedError.message);
            // Se for erro de CORS ou DOMException, pular direto para o fallback
            if (oEmbedError.name === 'TypeError' || oEmbedError.name === 'DOMException') {
                console.log('Erro de CORS detectado, pulando para fallback');
                return extractYouTubeFallback(url, videoId);
            }
        }

        // Se oEmbed falhar, tentar usar proxy para acessar a página do YouTube
        console.log('Tentando proxy para YouTube...');
        
        try {
            const proxyUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(url)}`;
            console.log('Proxy URL:', proxyUrl);
            
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 segundos para YouTube

            const response = await fetch(proxyUrl, {
                method: 'GET',
                headers: {
                    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
                },
                signal: controller.signal
            });

            clearTimeout(timeoutId);

            if (!response.ok) {
                console.log(`Proxy retornou status ${response.status} para YouTube`);
                return extractYouTubeFallback(url, videoId);
            }

            const data = await response.json();
            const htmlContent = data.contents;

            if (htmlContent && htmlContent.length > 100) {
                console.log('Preview do YouTube obtido com sucesso via proxy');
                return parseYouTubeHTML(htmlContent, url, videoId);
            } else {
                console.log('Conteúdo HTML muito pequeno ou vazio');
                return extractYouTubeFallback(url, videoId);
            }
        } catch (proxyError) {
            console.log('Erro no proxy:', proxyError.name, proxyError.message);
            return extractYouTubeFallback(url, videoId);
        }

    } catch (error) {
        console.error('Erro ao buscar preview do YouTube:', error);
        const videoId = extractVideoId(url);
        return extractYouTubeFallback(url, videoId);
    }
}

function parseYouTubeHTML(htmlContent, url, videoId) {
    // Extrair título do YouTube - tentar múltiplas estratégias
    const titleMatch = htmlContent.match(/<title[^>]*>([^<]+)<\/title>/i);
    const ogTitleMatch = htmlContent.match(/<meta[^>]*property=["']og:title["'][^>]*content=["']([^"']+)["'][^>]*>/i);
    const twitterTitleMatch = htmlContent.match(/<meta[^>]*name=["']twitter:title["'][^>]*content=["']([^"']+)["'][^>]*>/i);
    
    // Tentar extrair do JSON-LD (estruturado)
    const jsonLdMatch = htmlContent.match(/<script[^>]*type=["']application\/ld\+json["'][^>]*>(.*?)<\/script>/is);
    let jsonLdTitle = '';
    let jsonLdDescription = '';
    let jsonLdChannel = '';
    
    if (jsonLdMatch) {
        try {
            const jsonLdData = JSON.parse(jsonLdMatch[1]);
            if (jsonLdData.name) jsonLdTitle = jsonLdData.name;
            if (jsonLdData.description) jsonLdDescription = jsonLdData.description;
            if (jsonLdData.author && jsonLdData.author.name) jsonLdChannel = jsonLdData.author.name;
        } catch (e) {
            console.log('Erro ao parsear JSON-LD:', e.message);
        }
    }
    
    // Extrair descrição
    const ogDescriptionMatch = htmlContent.match(/<meta[^>]*property=["']og:description["'][^>]*content=["']([^"']+)["'][^>]*>/i);
    const twitterDescriptionMatch = htmlContent.match(/<meta[^>]*name=["']twitter:description["'][^>]*content=["']([^"']+)["'][^>]*>/i);
    const descriptionMatch = htmlContent.match(/<meta[^>]*name=["']description["'][^>]*content=["']([^"']+)["'][^>]*>/i);
    
    // Extrair thumbnail
    const ogImageMatch = htmlContent.match(/<meta[^>]*property=["']og:image["'][^>]*content=["']([^"']+)["'][^>]*>/i);
    const twitterImageMatch = htmlContent.match(/<meta[^>]*name=["']twitter:image["'][^>]*content=["']([^"']+)["'][^>]*>/i);
    
    // Extrair canal
    const channelMatch = htmlContent.match(/<meta[^>]*property=["']og:video:author["'][^>]*content=["']([^"']+)["'][^>]*>/i);
    const channelNameMatch = htmlContent.match(/<meta[^>]*name=["']twitter:creator["'][^>]*content=["']([^"']+)["'][^>]*>/i);

    // Priorizar JSON-LD, depois Open Graph, depois Twitter Cards, depois meta tags padrão
    const title = jsonLdTitle || 
                  (ogTitleMatch ? ogTitleMatch[1] : 
                   (twitterTitleMatch ? twitterTitleMatch[1] : 
                    (titleMatch ? titleMatch[1] : `Vídeo do YouTube (${videoId})`)));
    
    const description = jsonLdDescription || 
                       (ogDescriptionMatch ? ogDescriptionMatch[1] : 
                        (twitterDescriptionMatch ? twitterDescriptionMatch[1] : 
                         (descriptionMatch ? descriptionMatch[1] : 'Assista no YouTube')));
    
    const image = ogImageMatch ? ogImageMatch[1] : 
                 (twitterImageMatch ? twitterImageMatch[1] : 
                  `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`);
    
    const channel = jsonLdChannel || 
                   (channelMatch ? channelMatch[1] : 
                    (channelNameMatch ? channelNameMatch[1] : 'YouTube'));

    // Limpar título removendo " - YouTube" se presente
    const cleanTitle = title.replace(/\s*-\s*YouTube\s*$/, '').trim();

    return {
        title: cleanText(cleanTitle),
        description: cleanText(description),
        image: cleanUrl(image, url),
        url: url,
        channel: cleanText(channel),
        videoId: videoId
    };
}

async function fetchYouTubeSimplePreview(url, videoId) {
    // Tentar usar uma API pública que não requer CORS
    try {
        // Usar uma API alternativa que funciona melhor com extensões
        const apiUrl = `https://noembed.com/embed?url=${encodeURIComponent(url)}`;
        console.log('Tentando API noembed:', apiUrl);
        
        const response = await fetch(apiUrl, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
            }
        });

        if (response.ok) {
            const data = await response.json();
            console.log('Dados noembed obtidos:', data);
            
            if (data.title && data.title !== 'undefined') {
                return {
                    title: cleanText(data.title),
                    description: data.author_name ? `Canal: ${data.author_name}` : 'Vídeo do YouTube',
                    image: data.thumbnail_url || `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`,
                    url: url,
                    channel: cleanText(data.author_name || 'YouTube'),
                    videoId: videoId
                };
            }
        }
    } catch (error) {
        console.log('API noembed falhou:', error.message);
    }
    
    return null;
}

function extractYouTubeFallback(url, videoId) {
    if (!videoId) {
        return extractBasicPreview(url);
    }

    // Usar thumbnail padrão do YouTube
    const thumbnailUrl = `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
    
    // Tentar extrair informações básicas da URL
    let title = `Vídeo do YouTube`;
    let description = 'Clique para assistir no YouTube';
    
    // Se conseguimos extrair o videoId, mostrar informações mais específicas
    if (videoId) {
        title = `🎥 Vídeo do YouTube`;
        description = `ID: ${videoId} - Clique para assistir`;
    }
    
    return {
        title: title,
        description: description,
        image: thumbnailUrl,
        url: url,
        channel: 'YouTube',
        videoId: videoId
    };
}

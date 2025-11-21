// ==================== INICIALIZAÇÃO ==================== //
document.addEventListener('DOMContentLoaded', () => {
    initNavigation();
    initScrollEffects();
    initParticles();
    initIntersectionObserver();
    initSmoothScrolling();
});

// ==================== NAVEGAÇÃO ==================== //
function initNavigation() {
    const navItems = document.querySelectorAll('.nav-item');
    const sections = document.querySelectorAll('.section');
    
    navItems.forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            
            // Remove active de todos
            navItems.forEach(nav => nav.classList.remove('active'));
            sections.forEach(section => section.classList.remove('active'));
            
            // Adiciona active no clicado
            item.classList.add('active');
            
            // Mostra seção correspondente
            const targetId = item.getAttribute('href').substring(1);
            const targetSection = document.getElementById(targetId);
            
            if (targetSection) {
                targetSection.scrollIntoView({ behavior: 'smooth' });
                setTimeout(() => {
                    targetSection.classList.add('active');
                }, 100);
            }
        });
    });
}

// ==================== EFEITOS DE SCROLL ==================== //
function initScrollEffects() {
    const bgImage = document.getElementById('bgImage');
    const bgOverlay = document.getElementById('bgOverlay');
    let lastScrollPosition = 0;
    
    window.addEventListener('scroll', () => {
        const scrollPosition = window.scrollY;
        const windowHeight = window.innerHeight;
        const documentHeight = document.documentElement.scrollHeight;
        
        // Calcula a porcentagem do scroll
        const scrollPercentage = scrollPosition / (documentHeight - windowHeight);
        
        // ===== EFEITO DE BLUR PROGRESSIVO ===== //
        // Começa o blur quando rola para a seção de resumo (aproximadamente 20% da página)
        // Remove o blur quando chega na última seção de links (aproximadamente 80% da página)
        let blurAmount = 0;
        
        if (scrollPercentage > 0.15 && scrollPercentage < 0.75) {
            // Calcula o blur entre 0px e 15px
            const blurRange = scrollPercentage - 0.15;
            const maxBlurRange = 0.75 - 0.15; // 0.6
            blurAmount = Math.min((blurRange / maxBlurRange) * 15, 15);
        } else if (scrollPercentage >= 0.75) {
            // Reduz o blur gradualmente quando chega perto da última seção
            const fadeOutRange = scrollPercentage - 0.75;
            const maxFadeRange = 1 - 0.75; // 0.25
            blurAmount = Math.max(15 - (fadeOutRange / maxFadeRange) * 15, 0);
        }
        
        // Aplica o blur
        document.documentElement.style.setProperty('--blur-amount', `${blurAmount}px`);
        
        // Ajusta opacidade do overlay baseado no blur
        const overlayOpacity = 0.8 - (blurAmount / 15) * 0.3;
        bgOverlay.style.opacity = overlayOpacity;
        
        // ===== PARALLAX DESATIVADO - FUNDO ESTÁTICO ===== //
        // const parallaxSpeed = 0.5;
        // bgImage.style.transform = `translateY(${scrollPosition * parallaxSpeed}px) scale(1.1)`;
        
        // ===== ATUALIZA NAVEGAÇÃO ATIVA BASEADO NA POSIÇÃO ===== //
        updateActiveNavigation();
        
        lastScrollPosition = scrollPosition;
    });
}

// ==================== ATUALIZA NAVEGAÇÃO ATIVA ==================== //
function updateActiveNavigation() {
    const sections = document.querySelectorAll('.section');
    const navItems = document.querySelectorAll('.nav-item');
    
    let currentSection = '';
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;
        const scrollPosition = window.scrollY + window.innerHeight / 2;
        
        if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
            currentSection = section.getAttribute('id');
        }
    });
    
    navItems.forEach(item => {
        item.classList.remove('active');
        if (item.getAttribute('href') === `#${currentSection}`) {
            item.classList.add('active');
        }
    });
}

// ==================== INTERSECTION OBSERVER ==================== //
function initIntersectionObserver() {
    const observerOptions = {
        threshold: 0.2,
        rootMargin: '0px 0px -100px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                
                // Anima elementos filhos com delay
                const animatedElements = entry.target.querySelectorAll('.skill-card, .link-card, .timeline-item, .highlight-item');
                animatedElements.forEach((el, index) => {
                    setTimeout(() => {
                        el.style.opacity = '1';
                        el.style.transform = 'translateY(0)';
                    }, index * 100);
                });
            }
        });
    }, observerOptions);
    
    // Observa todas as seções
    const sections = document.querySelectorAll('.section');
    sections.forEach(section => observer.observe(section));
}

// ==================== SMOOTH SCROLLING ==================== //
function initSmoothScrolling() {
    // Previne comportamento padrão de links de âncora
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// ==================== PARTÍCULAS DECORATIVAS ==================== //
function initParticles() {
    const particlesContainer = document.getElementById('particles');
    const particleCount = 30;
    
    for (let i = 0; i < particleCount; i++) {
        createParticle(particlesContainer);
    }
}

function createParticle(container) {
    const particle = document.createElement('div');
    const size = Math.random() * 4 + 2;
    const startX = Math.random() * window.innerWidth;
    const startY = Math.random() * window.innerHeight;
    const duration = Math.random() * 20 + 10;
    const delay = Math.random() * 5;
    const opacity = Math.random() * 0.3 + 0.1;
    
    particle.style.cssText = `
        position: absolute;
        width: ${size}px;
        height: ${size}px;
        background: radial-gradient(circle, rgba(255,255,255,${opacity}) 0%, transparent 70%);
        border-radius: 50%;
        left: ${startX}px;
        top: ${startY}px;
        pointer-events: none;
        animation: float ${duration}s ease-in-out ${delay}s infinite;
    `;
    
    container.appendChild(particle);
}

// Adiciona animação de flutuação no CSS via JavaScript
const style = document.createElement('style');
style.textContent = `
    @keyframes float {
        0%, 100% {
            transform: translate(0, 0) rotate(0deg);
            opacity: 0;
        }
        10% {
            opacity: 0.3;
        }
        50% {
            transform: translate(${Math.random() * 100 - 50}px, ${Math.random() * 100 - 50}px) rotate(180deg);
            opacity: 0.5;
        }
        90% {
            opacity: 0.3;
        }
    }
`;
document.head.appendChild(style);

// ==================== ANIMAÇÕES DE HOVER PREMIUM ==================== //
document.addEventListener('mousemove', (e) => {
    const cards = document.querySelectorAll('.skill-card, .link-card, .resume-card, .timeline-content');
    
    cards.forEach(card => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        const percentX = (x - centerX) / centerX;
        const percentY = (y - centerY) / centerY;
        
        // Aplica transformação 3D sutil
        if (x >= 0 && x <= rect.width && y >= 0 && y <= rect.height) {
            card.style.transform = `
                perspective(1000px) 
                rotateY(${percentX * 5}deg) 
                rotateX(${-percentY * 5}deg) 
                translateZ(10px)
            `;
        }
    });
});

// Remove transformação quando o mouse sai
document.querySelectorAll('.skill-card, .link-card, .resume-card, .timeline-content').forEach(card => {
    card.addEventListener('mouseleave', () => {
        card.style.transform = 'perspective(1000px) rotateY(0) rotateX(0) translateZ(0)';
    });
});

// ==================== EFEITO DE DIGITAÇÃO NO TÍTULO ==================== //
function typeWriter() {
    const title = document.querySelector('.main-title');
    if (!title) return;
    
    const text = title.textContent;
    title.textContent = '';
    title.style.display = 'block';
    
    let i = 0;
    const speed = 100;
    
    function type() {
        if (i < text.length) {
            title.textContent += text.charAt(i);
            i++;
            setTimeout(type, speed);
        }
    }
    
    // Descomente para ativar efeito de digitação
    // type();
}

// ==================== CONTADOR DE SCROLL PARA DEBUG ==================== //
if (window.location.search.includes('debug')) {
    const debugDiv = document.createElement('div');
    debugDiv.style.cssText = `
        position: fixed;
        top: 10px;
        right: 10px;
        background: rgba(0,0,0,0.8);
        color: white;
        padding: 10px;
        border-radius: 8px;
        font-family: monospace;
        font-size: 12px;
        z-index: 10000;
    `;
    document.body.appendChild(debugDiv);
    
    window.addEventListener('scroll', () => {
        const scrollPosition = window.scrollY;
        const windowHeight = window.innerHeight;
        const documentHeight = document.documentElement.scrollHeight;
        const scrollPercentage = (scrollPosition / (documentHeight - windowHeight) * 100).toFixed(2);
        const blurAmount = getComputedStyle(document.documentElement).getPropertyValue('--blur-amount');
        
        debugDiv.innerHTML = `
            Scroll: ${scrollPosition.toFixed(0)}px<br>
            Percentage: ${scrollPercentage}%<br>
            Blur: ${blurAmount}
        `;
    });
}

// ==================== PERFORMANCE: THROTTLE SCROLL ==================== //
function throttle(func, delay) {
    let lastCall = 0;
    return function(...args) {
        const now = new Date().getTime();
        if (now - lastCall < delay) {
            return;
        }
        lastCall = now;
        return func(...args);
    };
}

// Aplica throttle nos eventos de scroll para melhor performance
window.addEventListener('scroll', throttle(() => {
    // Eventos de scroll já estão otimizados acima
}, 16)); // ~60fps

// ==================== ANIMAÇÕES AO CARREGAR ==================== //
window.addEventListener('load', () => {
    // Marca a primeira seção como ativa
    const firstSection = document.querySelector('.section');
    if (firstSection) {
        firstSection.classList.add('active');
    }
    
    // Adiciona classe loaded ao body para animações de entrada
    document.body.classList.add('loaded');
});

// ==================== CURSOR PERSONALIZADO (OPCIONAL) ==================== //
function initCustomCursor() {
    const cursor = document.createElement('div');
    cursor.className = 'custom-cursor';
    cursor.style.cssText = `
        position: fixed;
        width: 20px;
        height: 20px;
        border: 2px solid #FF6B35;
        border-radius: 50%;
        pointer-events: none;
        z-index: 10000;
        transition: all 0.1s ease;
        display: none;
    `;
    document.body.appendChild(cursor);
    
    document.addEventListener('mousemove', (e) => {
        cursor.style.left = e.clientX - 10 + 'px';
        cursor.style.top = e.clientY - 10 + 'px';
        cursor.style.display = 'block';
    });
    
    // Descomente para ativar cursor personalizado
    // initCustomCursor();
}

// ==================== TEMAS (FUTURO) ==================== //
function toggleTheme() {
    document.body.classList.toggle('dark-theme');
    document.body.classList.toggle('light-theme');
    localStorage.setItem('theme', document.body.classList.contains('dark-theme') ? 'dark' : 'light');
}

// ==================== EXPORTAR PARA CONSOLE (DEBUG) ==================== //
window.portfolioDebug = {
    updateBlur: (amount) => {
        document.documentElement.style.setProperty('--blur-amount', `${amount}px`);
    },
    resetAnimations: () => {
        document.querySelectorAll('.section').forEach(section => {
            section.classList.remove('active');
        });
        document.querySelector('.section').classList.add('active');
    },
    showScrollInfo: () => {
        console.log({
            scrollY: window.scrollY,
            windowHeight: window.innerHeight,
            documentHeight: document.documentElement.scrollHeight,
            percentage: (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight) * 100).toFixed(2) + '%',
            blur: getComputedStyle(document.documentElement).getPropertyValue('--blur-amount')
        });
    }
};

console.log('%c🚀 Portfolio Sydney Sudário', 'color: #FF6B35; font-size: 20px; font-weight: bold;');
console.log('%cDebug tools available: window.portfolioDebug', 'color: #F7931E; font-size: 12px;');

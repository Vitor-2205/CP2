import { products } from './products';

// --- Utility Functions ---
function createWineCard(wine) {
    const card = document.createElement('div');
    card.classList.add('wine-card');

    const imagePath = wine.image ? `/${wine.image}` : '/placeholder-wine.png'; 

    const image = document.createElement('img');
    image.src = imagePath;
    image.alt = wine.name;
    image.onerror = () => {
        image.src = '/placeholder-wine.png'; 
        image.alt = "Imagem de vinho indisponível";
    };
    card.appendChild(image);

    const content = document.createElement('div');
    content.classList.add('wine-card-content');
    card.appendChild(content);

    const name = document.createElement('h3');
    name.textContent = wine.name;
    content.appendChild(name);

    const type = document.createElement('p');
    type.classList.add('wine-type');
    type.textContent = wine.type;
    content.appendChild(type);

    const description = document.createElement('p');
    description.classList.add('wine-description');
    description.textContent = wine.description.length > 100 ? wine.description.substring(0, 97) + "..." : wine.description;
    content.appendChild(description);

    const price = document.createElement('p');
    price.classList.add('wine-price');
    const priceString = typeof wine.price === 'number' ? wine.price.toFixed(2) : String(wine.price).replace(',', '.');
    price.textContent = `R$ ${parseFloat(priceString).toFixed(2).replace('.', ',')}`;
    content.appendChild(price);


    const button = document.createElement('button');
    button.classList.add('btn', 'btn-primary'); 
    button.textContent = 'Adicionar ao Carrinho';
    button.addEventListener('click', () => {
        alert(`${wine.name} adicionado ao carrinho! (Simulação)`);
    });
    content.appendChild(button);

    return card;
}

function handleActiveNavLinks() {
    const navLinks = document.querySelectorAll('header nav ul li a');
    const currentPath = window.location.pathname.split('/').pop() || 'index.html'; 

    navLinks.forEach((link) => {
        const linkPath = link.getAttribute('href').split('/').pop();
        if (linkPath === currentPath) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });
}

// --- Page Specific Initializers ---

function initFeaturedWinesSection() {
    const featuredWinesGrid = document.getElementById('featured-wines-grid');
    if (!featuredWinesGrid) return;

    const featuredWines = products.filter((product) => product.featured);
    featuredWines.slice(0, 3).forEach((wine) => { 
        const card = createWineCard(wine);
        featuredWinesGrid.appendChild(card);
    });
}

function initAllWinesPage() {
    const tintosGrid = document.getElementById('tintos-grid');
    if (!tintosGrid) return; // We are not on the vinhos.html page

    const brancosGrid = document.getElementById('brancos-grid');
    const rosesGrid = document.getElementById('roses-grid');
    const espumantesGrid = document.getElementById('espumantes-grid');

    if (!products || products.length === 0) {
        const noWinesMsg = '<p>Nenhum vinho encontrado nesta categoria no momento.</p>';
        if (tintosGrid) tintosGrid.innerHTML = noWinesMsg;
        if (brancosGrid) brancosGrid.innerHTML = noWinesMsg;
        if (rosesGrid) rosesGrid.innerHTML = noWinesMsg;
        if (espumantesGrid) espumantesGrid.innerHTML = noWinesMsg;
        return;
    }

    // Specific curated wine IDs for "Nossos Vinhos" page
    const curatedTintoIds = [28, 29, 30, 31];
    const curatedBrancoIds = [32, 33, 34, 35];
    const curatedRoseIds = [23, 21, 20, 36];
    const curatedEspumanteIds = [37, 27, 38, 25];

    const getWinesByIds = (ids) => {
        return ids.map(id => products.find(wine => wine.id === id)).filter(wine => wine !== undefined);
    };

    const winesByType = {
        tintos: getWinesByIds(curatedTintoIds),
        brancos: getWinesByIds(curatedBrancoIds),
        roses: getWinesByIds(curatedRoseIds),
        espumantes: getWinesByIds(curatedEspumanteIds),
    };

    const populateGrid = (gridElement, wineList, categoryNameForMsg) => {
        if (gridElement) {
            if (wineList.length > 0) {
                gridElement.innerHTML = ''; 
                wineList.forEach((wine) => {
                    const card = createWineCard(wine);
                    gridElement.appendChild(card);
                });
            } else {
                gridElement.innerHTML = `<p>Nenhum vinho ${categoryNameForMsg} selecionado para esta categoria no momento.</p>`;
            }
        }
    };

    populateGrid(tintosGrid, winesByType.tintos, 'tinto');
    populateGrid(brancosGrid, winesByType.brancos, 'branco');
    populateGrid(rosesGrid, winesByType.roses, 'rosé');
    populateGrid(espumantesGrid, winesByType.espumantes, 'espumante');
}

function initContactFormPage() {
    const contactForm = document.getElementById('contactForm');
    if (!contactForm) return;

    contactForm.addEventListener('submit', (event) => {
        event.preventDefault();
        const nameInput = document.getElementById('name');
        const emailInput = document.getElementById('email');
        const messageInput = document.getElementById('message');

        if (!nameInput || !emailInput || !messageInput) {
            console.error("Form elements not found");
            alert('Ocorreu um erro. Tente novamente.');
            return;
        }

        const name = nameInput.value;
        const email = emailInput.value;
        const message = messageInput.value;

        if (name.trim() === '' || email.trim() === '' || message.trim() === '') {
            alert('Por favor, preencha todos os campos obrigatórios.');
            return;
        }
        
        if (!email.includes('@') || !email.includes('.')) {
            alert('Por favor, insira um endereço de e-mail válido.');
            return;
        }

        alert('Mensagem enviada com sucesso! (Simulação)');
        contactForm.reset();
    });
}

// --- Quiz Logic Functions ---

// Helper to check wine properties (name or type) against keywords
const wineMatchesGeneral = (wine, keywords) => {
    const wineNameLower = wine.name.toLowerCase();
    const wineTypeLower = wine.type.toLowerCase();
    return keywords.some(kw => wineNameLower.includes(kw) || wineTypeLower.includes(kw));
};

// Helper to check wine type specifically against keywords
const wineIsType = (wine, typeKeywords) => {
     const wineTypeLower = wine.type.toLowerCase();
     return typeKeywords.some(kw => wineTypeLower.includes(kw.toLowerCase()));
};

function filterRecommendationsByOccasion(currentRecommendations, occasion) {
    if (occasion === 'celebration') {
        return currentRecommendations.filter(wine => wineIsType(wine, ['espumante']));
    } else if (occasion === 'relax') {
        return currentRecommendations.filter(wine => wineIsType(wine, ['tinto leve', 'rosé', 'suave']));
    }
    return currentRecommendations; // No change for 'any', 'dinner_party', 'gift' at this stage
}

function filterRecommendationsByTaste(currentRecommendations, taste) {
    if (taste === 'any' || currentRecommendations.length === 0) return currentRecommendations;

    let tasteFiltered = [];
    if (taste === 'sweet') {
        tasteFiltered = currentRecommendations.filter(wine => wineIsType(wine, ['suave','doce','moscatel']));
    } else if (taste === 'dry') {
        tasteFiltered = currentRecommendations.filter(wine => wineIsType(wine, ['seco', 'brut']));
    } else if (taste === 'bold') {
        tasteFiltered = currentRecommendations.filter(wine => 
            wineIsType(wine, ['tinto encorpado']) || 
            wineMatchesGeneral(wine, ['cabernet sauvignon', 'malbec', 'primitivo']) ||
            (wineIsType(wine, ['tinto seco']) && !wineIsType(wine, ['tinto leve']))
        );
    } else if (taste === 'fruity') {
        tasteFiltered = currentRecommendations.filter(wine => 
            wineIsType(wine, ['rosé', 'tinto leve', 'espumante']) || 
            wineMatchesGeneral(wine, ['sauvignon blanc', 'pinot noir', 'tempranillo'])
        );
    }
    
    // Only update if filter yielded results or if it was a specific choice (to allow empty if no match for specific taste)
    if (tasteFiltered.length > 0 || (taste !== 'any' && tasteFiltered.length === 0)) {
        return tasteFiltered;
    }
    return currentRecommendations;
}

function filterRecommendationsByFood(currentRecommendations, food) {
    if (food === 'any' || currentRecommendations.length === 0) return currentRecommendations;

    let foodFiltered = [];
    switch (food) {
        case 'red_meat':
            foodFiltered = currentRecommendations.filter(wine =>
                wineIsType(wine, ['tinto encorpado']) ||
                wineMatchesGeneral(wine, ['cabernet sauvignon', 'malbec', 'primitivo']) ||
                (wineIsType(wine, ['tinto seco']) && !wineIsType(wine, ['tinto leve']))
            );
            break;
        case 'pasta':
            foodFiltered = currentRecommendations.filter(wine =>
                wineIsType(wine, ['tinto leve', 'rosé']) || 
                wineMatchesGeneral(wine, ['gamay', 'pinot noir', 'tempranillo']) ||
                (wineIsType(wine, ['tinto seco']) && !wineIsType(wine, ['tinto encorpado'])) ||
                wineMatchesGeneral(wine, ['chardonnay'])
            );
            break;
        case 'fish_chicken':
            foodFiltered = currentRecommendations.filter(wine =>
                wineIsType(wine, ['branco leve', 'branco seco', 'rosé', 'tinto leve']) ||
                wineMatchesGeneral(wine, ['sauvignon blanc', 'pinot grigio', 'chardonnay', 'pinot noir', 'vinho verde'])
            );
            break;
        case 'cheese_snacks':
             foodFiltered = currentRecommendations.filter(wine =>
                wineIsType(wine, ['rosé', 'espumante', 'tinto leve']) ||
                wineMatchesGeneral(wine, ['sauvignon blanc']) ||
                ((wineIsType(wine, ['tinto encorpado']) || (wineIsType(wine, ['tinto seco']) && !wineIsType(wine, ['tinto leve']))) && !wineIsType(wine,['suave']))
            );
            break;
        case 'vegetarian':
            foodFiltered = currentRecommendations.filter(wine =>
                wineIsType(wine, ['rosé', 'branco leve', 'tinto leve']) ||
                wineMatchesGeneral(wine, ['sauvignon blanc', 'pinot noir', 'vinho verde'])
            );
            break;
        case 'dessert':
            foodFiltered = currentRecommendations.filter(wine =>
                wineIsType(wine, ['suave', 'espumante doce', 'moscatel']) 
            );
            break;
    }
    
    if (foodFiltered.length > 0) return foodFiltered;
    if (food !== 'any') return []; // If specific food chosen and no match, return empty.
    return currentRecommendations;
}

function applyGiftLogicAndSort(currentRecommendations, occasion) {
    if (occasion !== 'gift' || currentRecommendations.length === 0) return currentRecommendations;

    let giftPreferred = currentRecommendations.filter(wine => 
        wine.name.toLowerCase().includes('reserva') || 
        wine.type.toLowerCase().includes('espumante') ||
        parseFloat(String(wine.price).replace(',', '.')) > 80
    );
    
    if (giftPreferred.length > 0) {
         giftPreferred.sort((a, b) => parseFloat(String(b.price).replace(',', '.')) - parseFloat(String(a.price).replace(',', '.')));
         return giftPreferred;
    }
    // If no "premium" gift options, just sort current by price
    return [...currentRecommendations].sort((a, b) => parseFloat(String(b.price).replace(',', '.')) - parseFloat(String(a.price).replace(',', '.')));
}

function getFallbackRecommendations(taste, food) {
    let fallbackOptions = [];
    if (food !== 'any' && food !== 'dessert') { 
        fallbackOptions = products.filter(wine => wineIsType(wine, ['rosé seco', 'espumante brut', 'chardonnay']));
    }
    if (fallbackOptions.length === 0 && taste === 'sweet') {
        fallbackOptions = products.filter(wine => wineIsType(wine, ['suave', 'doce', 'moscatel']));
    }
    if (fallbackOptions.length === 0 && taste === 'dry') {
        fallbackOptions = products.filter(wine => wineIsType(wine, ['seco', 'brut']) && !wineIsType(wine, ['suave']));
    }
    if (fallbackOptions.length === 0) {
        fallbackOptions = products.filter(p => 
            p.name.toLowerCase().includes("agnello rosé de verão") || 
            p.name.toLowerCase().includes("agnello espumante brut") || 
            p.name.toLowerCase().includes("casillero del diablo chardonnay")
        ).slice(0,2);
    }
    if (fallbackOptions.length === 0 && products.length > 0) { 
        fallbackOptions.push(products[Math.floor(Math.random() * products.length)]);
    }
    return fallbackOptions.slice(0, 2); // Max 2 fallbacks
}

function displayQuizResults(recommendations, taste, food, resultsContainer) {
    resultsContainer.innerHTML = `<h3>Recomendação para você:</h3>`;
    if (recommendations.length > 0) {
        const randomRecommendation = recommendations[Math.floor(Math.random() * recommendations.length)];
        const card = createWineCard(randomRecommendation);
        resultsContainer.appendChild(card);
    } else {
        resultsContainer.innerHTML += `<p>Não encontramos uma combinação exata para suas preferências. Que tal experimentar uma destas opções versáteis ou <a href="vinhos.html">explorar nossa coleção completa</a>?</p>`;
        
        const fallbackWines = getFallbackRecommendations(taste, food);

        if (fallbackWines.length > 0) {
             fallbackWines.forEach(fallbackWine => {
                if (fallbackWine) { 
                    const card = createWineCard(fallbackWine);
                    resultsContainer.appendChild(card);
                }
            });
        } else {
             resultsContainer.innerHTML += `<p>Nenhum vinho disponível no momento. Por favor, verifique novamente mais tarde ou <a href="contato.html">fale conosco</a>.</p>`;
        }
    }
    resultsContainer.style.display = 'block';
    resultsContainer.scrollIntoView({ behavior: 'smooth' });
}


function initQuizPage() {
    const quizForm = document.getElementById('wineQuiz');
    if (!quizForm) return;

    quizForm.addEventListener('submit', function(event) {
        event.preventDefault();
        const occasion = document.getElementById('occasion').value;
        const taste = document.getElementById('taste').value;
        const food = document.getElementById('food').value;
        const resultsContainer = document.getElementById('quiz-results');
        
        let recommendations = [...products];
        recommendations = filterRecommendationsByOccasion(recommendations, occasion);
        recommendations = filterRecommendationsByTaste(recommendations, taste);
        recommendations = filterRecommendationsByFood(recommendations, food);
        recommendations = applyGiftLogicAndSort(recommendations, occasion); // Must be after other filters

        displayQuizResults(recommendations, taste, food, resultsContainer);
    });
}

// --- Main DOMContentLoaded ---
document.addEventListener('DOMContentLoaded', () => {
    handleActiveNavLinks();
    
    initFeaturedWinesSection();

    initAllWinesPage();

    initContactFormPage();

    initQuizPage();
});
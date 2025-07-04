// --- Sydney Student Rental Hub - Details Page JavaScript (Final Corrected Version) ---

document.addEventListener('DOMContentLoaded', () => {

    // --- 1. DOM Element Selectors ---
    const imageCarouselEl = document.getElementById('image-carousel');
    const propertyPriceEl = document.getElementById('property-price');
    const propertyAddressEl = document.getElementById('property-address');
    const propertySuburbPostcodeEl = document.getElementById('property-suburb-postcode');
    const propertySpecsEl = document.getElementById('property-specs');
    const propertyTypeEl = document.getElementById('property-type');
    const propertyAvailabilityEl = document.getElementById('property-availability');
    const propertyBondEl = document.getElementById('property-bond');
    const propertyDescriptionEl = document.getElementById('property-description');
    const readMoreBtn = document.getElementById('read-more-btn');
    const inspectionTimesContainer = document.getElementById('inspection-times-container');
    const mainContent = document.getElementById('main-content');
    const loadingIndicator = document.getElementById('loading-indicator');
    const detailMapContainer = document.getElementById('detail-map');
    
    // Commute Calculator Elements
    const commuteFromAddressEl = document.getElementById('commute-from-address');
    const commuteModeTabsEl = document.getElementById('commute-mode-tabs');
    const commuteResultsContainerEl = document.getElementById('commute-results-container');
    const commuteAddressInputEl = document.getElementById('commute-address-input');
    const commuteNameInputEl = document.getElementById('commute-name-input');
    const addCommuteLocationBtnEl = document.getElementById('add-commute-location-btn');

    // --- 2. State Management ---
    let currentProperty = null;
    let commuteDestinations = []; // Array to store destinations {id, name, address, results: {DRIVING, ...}}
    let activeCommuteMode = 'DRIVING'; // Default mode

    // --- 3. Core Logic ---

    function getPropertyIdFromUrl() {
        const params = new URLSearchParams(window.location.search);
        return params.get('id');
    }

    function getPropertiesFromStorage() {
        const propertiesJson = localStorage.getItem('allPropertyListings');
        try {
            return JSON.parse(propertiesJson);
        } catch (e) {
            console.error("Could not parse properties from localStorage", e);
            return null;
        }
    }
    
    function findPropertyById(properties, id) {
        return properties.find(p => p.listing_id == id);
    }
    
    function renderPropertyDetails(property) {
        currentProperty = property;
        document.title = `${property.address || '房源详情'} - 悉尼学生房源中心`;
        
        renderImageCarousel(property.images, property.address);

        propertyPriceEl.innerHTML = property.rent_pw ? `$${property.rent_pw}<span class="text-base font-medium text-textSecondary"> / week</span>` : '价格待定';
        propertyAddressEl.textContent = property.address || '地址未知';
        propertySuburbPostcodeEl.textContent = `${property.suburb || ''} ${property.state || ''} ${property.postcode || ''}`.trim();
        
        propertySpecsEl.innerHTML = `
            <div class="flex items-center gap-1.5"><i class="fa-solid fa-bed w-4 text-center"></i><span class="font-bold text-textPrimary">${property.bedrooms || 0}</span></div>
            <div class="flex items-center gap-1.5"><i class="fa-solid fa-bath w-4 text-center"></i><span class="font-bold text-textPrimary">${property.bathrooms || 0}</span></div>
            <div class="flex items-center gap-1.5"><i class="fa-solid fa-car w-4 text-center"></i><span class="font-bold text-textPrimary">${property.parking_spaces || 0}</span></div>
        `;
        propertyTypeEl.textContent = property.property_type || '房产';
        propertyAvailabilityEl.textContent = `Available from ${property.available_date || '待定'}`;
        propertyBondEl.textContent = property.bond ? `Bond $${property.bond}` : '押金待定';
        
        propertyDescriptionEl.innerHTML = property.property_description ? property.property_description.replace(/\n/g, '<br>') : '暂无房源描述。';
        
        renderInspectionTimes(property.inspection_times);

        commuteFromAddressEl.textContent = `${property.address}, ${property.suburb} NSW ${property.postcode}`;
        addCommuteLocationBtnEl.disabled = true;

        loadMapScript(property);

        loadingIndicator.classList.add('hidden');
        mainContent.classList.remove('hidden');
    }
    
    function renderImageCarousel(imagesData, altText) {
        let imageList = [];
        try {
            if (imagesData && imagesData.startsWith('[') && imagesData.endsWith(']')) {
                 imageList = JSON.parse(imagesData);
            }
        } catch(e) { console.error("Failed to parse images for carousel", e); }

        const placeholderSvg = `<svg width="600" height="400" xmlns="http://www.w3.org/2000/svg"><rect width="100%" height="100%" fill="#E3E3E3"/><text x="50%" y="50%" font-family='Inter, sans-serif' font-size='50' dy='.3em' fill='white' text-anchor='middle'>?</text></svg>`;
        const placeholderUrl = `data:image/svg+xml,${encodeURIComponent(placeholderSvg)}`;
        const coverImage = imageList.length > 0 ? imageList[0] : placeholderUrl;
        
        const backButton = `
            <div class="absolute top-4 left-4 z-10">
                <a href="./listings.html" class="w-9 h-9 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center text-textPrimary shadow-md hover:bg-white transition-colors">
                    <i class="fa-solid fa-arrow-left"></i>
                </a>
            </div>
        `;

        const carouselControls = imageList.length > 1 ? `
            <button class="carousel-btn absolute top-1/2 left-3 -translate-y-1/2 bg-white/80 backdrop-blur-sm text-textPrimary w-9 h-9 rounded-full flex items-center justify-center hover:bg-white transition shadow-md" data-direction="prev"><i class="fa-solid fa-chevron-left"></i></button>
            <button class="carousel-btn absolute top-1/2 right-3 -translate-y-1/2 bg-white/80 backdrop-blur-sm text-textPrimary w-9 h-9 rounded-full flex items-center justify-center hover:bg-white transition shadow-md" data-direction="next"><i class="fa-solid fa-chevron-right"></i></button>
            <div class="image-counter absolute bottom-4 right-4 bg-black/50 text-white text-xs font-semibold px-3 py-1 rounded-full flex items-center gap-2">
                <i class="fa-solid fa-camera"></i>
                <span id="image-counter-text">1 / ${imageList.length}</span>
            </div>
        ` : (imageList.length === 1 ? `
             <div class="image-counter absolute bottom-4 right-4 bg-black/50 text-white text-xs font-semibold px-3 py-1 rounded-full flex items-center gap-2">
                <i class="fa-solid fa-camera"></i>
                <span>1 / 1</span>
            </div>
        ` : '');

        imageCarouselEl.innerHTML = `
            ${backButton}
            <img id="property-image" src="${coverImage}" alt="${altText}" class="w-full h-60 object-cover">
            ${carouselControls}
        `;
        imageCarouselEl.dataset.images = JSON.stringify(imageList);
        imageCarouselEl.dataset.currentIndex = "0";
    }

    function renderInspectionTimes(inspectionData) {
        inspectionTimesContainer.innerHTML = '';
        if (!inspectionData) {
            inspectionTimesContainer.innerHTML = `<p class="text-textSecondary text-sm">暂无看房时间安排。</p>`;
            return;
        }
        const times = inspectionData.split(';').map(t => t.trim()).filter(t => t);
        if (times.length === 0) {
            inspectionTimesContainer.innerHTML = `<p class="text-textSecondary text-sm">暂无看房时间安排。</p>`;
            return;
        }
        times.forEach(time => {
            const timeEl = document.createElement('a');
            timeEl.href = "#";
            timeEl.className = "block p-3 border border-borderDefault rounded-lg hover:border-accentPrimary transition-colors";
            timeEl.innerHTML = `<p class="font-semibold text-textPrimary">${time}</p>`;
            inspectionTimesContainer.appendChild(timeEl);
        });
    }
    
    function initDetailMap(property) {
        const lat = parseFloat(property.latitude);
        const lng = parseFloat(property.longitude);

        if (isNaN(lat) || isNaN(lng)) {
            detailMapContainer.innerHTML = '<p class="text-center text-sm text-textSecondary p-4">Map data not available.</p>';
            return;
        }

        const propertyLocation = { lat, lng };
        const map = new google.maps.Map(detailMapContainer, {
            zoom: 15,
            center: propertyLocation,
            mapTypeControl: false,
            streetViewControl: false,
            zoomControl: false,
        });

        new google.maps.Marker({
            position: propertyLocation,
            map: map,
            title: property.address
        });
    }

    // --- 4. Commute Calculator Logic ---

    function setupCommuteCalculator() {
        if (typeof google !== 'undefined' && google.maps && google.maps.places) {
            const autocomplete = new google.maps.places.Autocomplete(commuteAddressInputEl, {
                types: ['address'],
                componentRestrictions: { 'country': 'au' }
            });

            autocomplete.addListener('place_changed', () => {
                const place = autocomplete.getPlace();
                if (place && place.formatted_address) {
                    addCommuteLocationBtnEl.disabled = false;
                }
            });
        }
        
        commuteAddressInputEl.addEventListener('input', () => {
            if (commuteAddressInputEl.value.trim() === '') {
                 addCommuteLocationBtnEl.disabled = true;
            } else {
                 // This is a fallback for when a user types an address without using autocomplete.
                 // It's not perfect but allows the button to be enabled.
                 addCommuteLocationBtnEl.disabled = false;
            }
        });

        commuteModeTabsEl.addEventListener('click', handleTabClick);
        addCommuteLocationBtnEl.addEventListener('click', handleAddLocation);
        commuteResultsContainerEl.addEventListener('click', (e) => {
            const removeButton = e.target.closest('.remove-commute-btn');
            if (removeButton) {
                const destinationId = removeButton.dataset.id;
                commuteDestinations = commuteDestinations.filter(d => d.id !== destinationId);
                renderCommuteResults();
            }
        });
    }

    async function handleTabClick(e) {
        if (e.target.tagName !== 'BUTTON') return;
        const newMode = e.target.dataset.mode;
        if (newMode === activeCommuteMode) return;

        activeCommuteMode = newMode;
        document.querySelector('.commute-tab-btn.active-tab').classList.remove('active-tab');
        e.target.classList.add('active-tab');

        const fetchPromises = commuteDestinations
            .filter(dest => !dest.results[activeCommuteMode])
            .map(dest => fetchCommuteTimeForDestination(dest, activeCommuteMode));

        if (fetchPromises.length > 0) {
            await Promise.all(fetchPromises);
        }

        renderCommuteResults();
    }

    async function fetchCommuteTimeForDestination(destination, mode) {
        destination.isLoading = true;
        renderCommuteResults();

        const origin = `${currentProperty.latitude},${currentProperty.longitude}`;
        try {
            const response = await fetch(`/api/get-directions?origin=${origin}&destination=${destination.address}&mode=${mode}`);
            if (!response.ok) throw new Error(`Directions API fetch failed with status ${response.status}`);
            
            const result = await response.json();
            destination.results[mode] = result;
        } catch (error) {
            console.error('Failed to fetch commute time:', error);
            destination.results[mode] = { error: '无法计算' };
        } finally {
            destination.isLoading = false;
            // No final render here, handleTabClick or handleAddLocation will do it.
        }
    }

    async function handleAddLocation() {
        const destinationAddress = commuteAddressInputEl.value;
        const destinationName = commuteNameInputEl.value || destinationAddress;
        if (!destinationAddress) return;

        addCommuteLocationBtnEl.disabled = true;

        const newDestination = {
            id: `dest_${new Date().getTime()}`,
            name: destinationName,
            address: destinationAddress,
            results: {},
            isLoading: true
        };
        commuteDestinations.push(newDestination);
        
        await fetchCommuteTimeForDestination(newDestination, activeCommuteMode);
        
        renderCommuteResults(); // Final render after fetch is complete

        commuteAddressInputEl.value = '';
        commuteNameInputEl.value = '';
    }

    function renderCommuteResults() {
        commuteResultsContainerEl.innerHTML = '';
        if (commuteDestinations.length === 0) {
            commuteResultsContainerEl.innerHTML = `<p class="text-center text-sm text-textSecondary py-4">添加一个目的地来计算通勤时间。</p>`;
            return;
        }

        commuteDestinations.forEach(dest => {
            const result = dest.results[activeCommuteMode];
            let resultHTML;
            
            // This condition is key: show loading if the flag is true for this destination
            if (dest.isLoading) {
                 resultHTML = `<p class="font-bold text-lg text-textSecondary animate-pulse">计算中...</p>`;
            } else if (result) {
                if (result.error) {
                    resultHTML = `<p class="font-bold text-lg text-red-500">${result.error}</p>`;
                } else {
                    resultHTML = `
                        <p class="font-bold text-lg text-textPrimary">${result.duration}</p>
                        <p class="text-sm text-textSecondary">${result.distance}</p>
                    `;
                }
            } else {
                // This state means data for this mode hasn't been fetched yet.
                resultHTML = `<p class="font-bold text-lg text-textSecondary">--</p>`;
            }

            const cardHTML = `
                <div class="flex justify-between items-center bg-gray-50 p-3 rounded-lg">
                    <div>
                        <p class="font-semibold text-textPrimary">${dest.name}</p>
                        <p class="text-sm text-textSecondary truncate max-w-xs">${dest.address}</p>
                    </div>
                    <div class="text-right flex-shrink-0 w-24">
                        ${resultHTML}
                    </div>
                    <button data-id="${dest.id}" class="remove-commute-btn ml-4 text-red-500 hover:text-red-700 text-sm font-semibold flex-shrink-0">移除</button>
                </div>
            `;
            commuteResultsContainerEl.insertAdjacentHTML('beforeend', cardHTML);
        });
    }

    // --- 5. Map and Script Loading ---
    
    function loadMapScript(property) {
        window.initDetailMapCallback = () => {
            initDetailMap(property);
            setupCommuteCalculator(); 
        };

        const script = document.createElement('script');
        script.src = `/api/get-map-script?callback=initDetailMapCallback&libraries=places`;
        script.async = true;
        script.defer = true;
        document.body.appendChild(script);
    }

    function renderError() {
        loadingIndicator.classList.add('hidden');
        mainContent.innerHTML = `<div class="p-4 text-center text-red-600"><p class="font-bold">加载失败</p><p class="mt-2 text-sm">无法找到该房源的详细信息。可能是链接已失效，或数据暂时不可用。</p><a href="./listings.html" class="mt-4 inline-block text-accentPrimary hover:underline">返回列表页</a></div>`;
        mainContent.classList.remove('hidden');
    }

    // --- 6. Event Listeners ---

    if (readMoreBtn) {
        readMoreBtn.addEventListener('click', () => {
            const isCollapsed = propertyDescriptionEl.classList.contains('max-h-24');
            propertyDescriptionEl.classList.toggle('max-h-24');
            readMoreBtn.textContent = isCollapsed ? 'Read less' : 'Read more';
        });
    }
    imageCarouselEl.addEventListener('click', (event) => {
        const carouselBtn = event.target.closest('.carousel-btn');
        if (!carouselBtn) return;
        const direction = carouselBtn.dataset.direction;
        const images = JSON.parse(imageCarouselEl.dataset.images || '[]');
        if (images.length <= 1) return;
        let currentIndex = parseInt(imageCarouselEl.dataset.currentIndex || '0', 10);
        if (direction === 'next') {
            currentIndex = (currentIndex + 1) % images.length;
        } else {
            currentIndex = (currentIndex - 1 + images.length) % images.length;
        }
        document.getElementById('property-image').src = images[currentIndex];
        const counter = document.getElementById('image-counter-text');
        if (counter) counter.textContent = `${currentIndex + 1} / ${images.length}`;
        imageCarouselEl.dataset.currentIndex = currentIndex;
    });

    // --- 7. Initialization ---
    
    const propertyId = getPropertyIdFromUrl();
    if (!propertyId) {
        renderError();
        return;
    }
    const allProperties = getPropertiesFromStorage();
    if (!allProperties) {
        renderError();
        return;
    }
    const property = findPropertyById(allProperties, propertyId);
    if (!property) {
        renderError();
        return;
    }
    renderPropertyDetails(property);
    renderCommuteResults(); // Initial render for the empty state
});

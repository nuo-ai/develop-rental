// --- Sydney Student Rental Hub - Details Page JavaScript ---

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
    const detailMapContainer = document.getElementById('detail-map'); // Map container
    
    // --- 2. Core Logic ---

    /**
     * Gets the property ID from the current URL's query parameters.
     * @returns {string|null} The listing ID or null if not found.
     */
    function getPropertyIdFromUrl() {
        const params = new URLSearchParams(window.location.search);
        return params.get('id');
    }

    /**
     * Fetches the full property list from localStorage.
     * @returns {Array<Object>|null} The array of properties or null if not found.
     */
    function getPropertiesFromStorage() {
        const propertiesJson = localStorage.getItem('allPropertyListings');
        try {
            return JSON.parse(propertiesJson);
        } catch (e) {
            console.error("Could not parse properties from localStorage", e);
            return null;
        }
    }
    
    /**
     * Finds a specific property by its ID.
     * @param {Array<Object>} properties - The array of all properties.
     * @param {string} id - The ID of the property to find.
     * @returns {Object|undefined} The found property object.
     */
    function findPropertyById(properties, id) {
        // Use '==' for loose comparison as URL param is a string and ID might be a number
        return properties.find(p => p.listing_id == id);
    }
    
    /**
     * Populates the page with the data of the found property.
     * @param {Object} property - The property object.
     */
    function renderPropertyDetails(property) {
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
        
        // Use innerHTML to render line breaks from the description
        propertyDescriptionEl.innerHTML = property.property_description ? property.property_description.replace(/\n/g, '<br>') : '暂无房源描述。';
        
        renderInspectionTimes(property.inspection_times);

        // Load the map after rendering other details
        loadMapScript(property);

        // Hide loading indicator and show content
        loadingIndicator.classList.add('hidden');
        mainContent.classList.remove('hidden');
    }
    
    /**
     * Renders the image carousel for the details page.
     * @param {string} imagesData - The JSON string of image URLs.
     * @param {string} altText - The alt text for the images.
     */
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

    /**
     * Renders the inspection times list.
     * @param {string} inspectionData - The string containing inspection times.
     */
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
    
    /**
     * Initializes the detail map for a given property.
     * @param {Object} property - The property object with lat/lng.
     */
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

    /**
     * Dynamically loads the Google Maps script and sets a callback.
     * @param {Object} property - The property to pass to the map init function.
     */
    function loadMapScript(property) {
        // Define the callback function on the window object
        window.initDetailMapCallback = () => {
            initDetailMap(property);
        };

        const script = document.createElement('script');
        script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyDR-IqWUXtp64-Pfp09FwGvFHnbKjMNuqU&callback=initDetailMapCallback&v=weekly`;
        script.async = true;
        script.defer = true;
        document.body.appendChild(script);
    }


    /**
     * Displays an error message on the page if data cannot be loaded.
     */
    function renderError() {
        loadingIndicator.classList.add('hidden');
        mainContent.innerHTML = `<div class="p-4 text-center text-red-600"><p class="font-bold">加载失败</p><p class="mt-2 text-sm">无法找到该房源的详细信息。可能是链接已失效，或数据暂时不可用。</p><a href="./listings.html" class="mt-4 inline-block text-accentPrimary hover:underline">返回列表页</a></div>`;
        mainContent.classList.remove('hidden');
    }

    // --- 3. Event Listeners ---

    // Read more/less button functionality
    if (readMoreBtn) {
        readMoreBtn.addEventListener('click', () => {
            const isCollapsed = propertyDescriptionEl.classList.contains('max-h-24');
            propertyDescriptionEl.classList.toggle('max-h-24');
            readMoreBtn.textContent = isCollapsed ? 'Read less' : 'Read more';
        });
    }

    // Image carousel functionality
    imageCarouselEl.addEventListener('click', (event) => {
        const target = event.target.closest('.carousel-btn');
        if (!target) return;
        const direction = target.dataset.direction;
        const images = JSON.parse(imageCarouselEl.dataset.images || '[]');
        if (images.length <= 1) return;
        let currentIndex = parseInt(imageCarouselEl.dataset.currentIndex || '0', 10);
        if (direction === 'next') {
            currentIndex = (currentIndex + 1) % images.length;
        } else {
            currentIndex = (currentIndex - 1 + images.length) % images.length;
        }
        document.getElementById('property-image').src = images[currentIndex];
        document.getElementById('image-counter-text').textContent = `${currentIndex + 1} / ${images.length}`;
        imageCarouselEl.dataset.currentIndex = currentIndex;
    });

    // --- 4. Initialization ---
    
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
});

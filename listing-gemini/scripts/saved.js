// --- Sydney Student Rental Hub - Saved Page JavaScript ---

document.addEventListener('DOMContentLoaded', () => {
    
    // --- 1. DOM ELEMENTS ---
    const savedContainer = document.getElementById('saved-listings-container');
    const emptyStateContainer = document.getElementById('empty-state-container');

    // --- 2. UTILITY FUNCTIONS ---

    /**
     * Retrieves all property data from localStorage.
     * @returns {Array<Object>} An array of all property objects.
     */
    function getPropertiesFromStorage() {
        const propertiesJson = localStorage.getItem('allPropertyListings');
        return propertiesJson ? JSON.parse(propertiesJson) : [];
    }

    /**
     * Retrieves the list of saved property IDs from localStorage.
     * @returns {Array<string>} An array of saved listing IDs.
     */
    function getSavedIds() {
        return JSON.parse(localStorage.getItem('rentalHubFavorites')) || [];
    }

    /**
     * Creates the HTML string for a single property card.
     * This is a simplified version of the card from main.js.
     * In Phase 5 (refactoring), we would share this function.
     * @param {Object} property - A single property object.
     * @returns {string} The HTML for the listing card.
     */
    function createListingCard(property) {
        const streetAddress = property.address || '地址未知';
        const suburbAndPostcode = `${property.suburb || ''} ${property.state || ''} ${property.postcode || ''}`.trim();
        const bedrooms = property.bedrooms || 0;
        const bathrooms = property.bathrooms || 0;
        const parking = property.parking_spaces || 0;
        const rent = property.rent_pw ? `$${property.rent_pw}` : '价格待定';
        
        let imageList = [];
        const imagesData = property.images;
        if (imagesData && imagesData.startsWith('[') && imagesData.endsWith(']')) {
            try { imageList = JSON.parse(imagesData); } catch (e) { console.warn('Could not parse image data for saved item.'); }
        }
        const coverImage = imageList.length > 0 ? imageList[0] : `https://placehold.co/600x400/E3E3E3/595959?text=暂无图片`;

        return `
            <a href="./details.html?id=${property.listing_id}" class="block bg-bgCard rounded-lg shadow-sm overflow-hidden">
                <div class="relative">
                    <img src="${coverImage}" alt="房源图片: ${streetAddress}" class="w-full h-52 object-cover">
                    <div class="absolute top-3 right-3">
                        <button class="w-8 h-8 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center text-red-500">
                            <i class="fa-solid fa-heart"></i>
                        </button>
                    </div>
                </div>
                <div class="p-4">
                    <p class="text-2xl font-extrabold text-textPrice">${rent}<span class="text-base font-medium text-textSecondary"> / week</span></p>
                    <div class="mt-2">
                        <p class="text-lg font-semibold text-textPrimary truncate">${streetAddress}</p>
                        <p class="text-base text-textSecondary">${suburbAndPostcode}</p>
                    </div>
                    <div class="flex items-center gap-4 mt-3 text-textSecondary border-t border-borderDefault pt-3">
                        <div class="flex items-center gap-2"><i class="fa-solid fa-bed text-lg w-5 text-center"></i><span class="font-bold text-textPrimary">${bedrooms}</span></div>
                        <div class="flex items-center gap-2"><i class="fa-solid fa-bath text-lg w-5 text-center"></i><span class="font-bold text-textPrimary">${bathrooms}</span></div>
                        <div class="flex items-center gap-2"><i class="fa-solid fa-car text-lg w-5 text-center"></i><span class="font-bold text-textPrimary">${parking}</span></div>
                    </div>
                </div>
            </a>
        `;
    }

    // --- 3. MAIN LOGIC ---

    /**
     * Fetches saved properties and renders them to the page.
     */
    function renderSavedListings() {
        if (!savedContainer || !emptyStateContainer) return;

        const allProperties = getPropertiesFromStorage();
        const savedIds = getSavedIds();

        // If no properties are loaded at all, show empty state
        if (allProperties.length === 0) {
            savedContainer.classList.add('hidden');
            emptyStateContainer.classList.remove('hidden');
            emptyStateContainer.querySelector('p').textContent = '请先访问列表页加载房源数据。';
            return;
        }

        // If there are no saved IDs, show empty state
        if (savedIds.length === 0) {
            savedContainer.classList.add('hidden');
            emptyStateContainer.classList.remove('hidden');
            return;
        }

        // Filter to get only the saved properties
        const savedProperties = allProperties.filter(p => savedIds.includes(String(p.listing_id)));
        
        // Show the listings container and hide the empty state
        emptyStateContainer.classList.add('hidden');
        savedContainer.classList.remove('hidden');
        savedContainer.innerHTML = ''; // Clear any previous content

        // Render each saved property
        savedProperties.forEach(property => {
            const cardHTML = createListingCard(property);
            savedContainer.insertAdjacentHTML('beforeend', cardHTML);
        });
    }

    // --- 4. INITIALIZATION ---
    renderSavedListings();
});

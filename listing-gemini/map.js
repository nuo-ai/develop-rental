// --- Sydney Student Rental Hub - Map Page JavaScript ---

function initMap() {
    // 1. Get property data from localStorage
    const propertiesJson = localStorage.getItem('allPropertyListings');
    const properties = propertiesJson ? JSON.parse(propertiesJson) : [];

    // 2. Set the map's center to Sydney
    const sydney = { lat: -33.8688, lng: 151.2093 };

    // 3. Create the map instance
    const map = new google.maps.Map(document.getElementById("map"), {
        zoom: 12,
        center: sydney,
        mapTypeControl: false, // Optional: clean up the UI
        streetViewControl: false,
    });

    // 4. Create an info window instance to be reused
    const infoWindow = new google.maps.InfoWindow();

    // 5. Loop through properties and create markers
    properties.forEach(property => {
        // Ensure the property has valid latitude and longitude
        const lat = parseFloat(property.latitude);
        const lng = parseFloat(property.longitude);

        if (!isNaN(lat) && !isNaN(lng)) {
            const marker = new google.maps.Marker({
                position: { lat: lat, lng: lng },
                map: map,
                title: property.address,
            });

            // Create content for the info window
            const contentString = `
                <div style="font-family: 'Inter', sans-serif; padding: 5px; max-width: 250px;">
                    <img src="${(JSON.parse(property.images)[0] || 'https://placehold.co/250x150/E3E3E3/595959?text=暂无图片')}" style="width:100%; height:auto; border-radius: 4px; margin-bottom: 8px;" alt="房源图片">
                    <div style="font-weight: 600; font-size: 14px; color: #2d2d2d; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${property.address}</div>
                    <p style="font-size: 16px; font-weight: 700; color: #000000; margin: 4px 0;">$${property.rent_pw} / week</p>
                    <a href="./details.html?id=${property.listing_id}" target="_top" style="font-size: 12px; color: #007BFF; text-decoration: none;">View Details</a>
                </div>
            `;

            // Add a click listener for each marker to open the info window
            marker.addListener("click", () => {
                infoWindow.setContent(contentString);
                infoWindow.open({
                    anchor: marker,
                    map,
                });
            });
        }
    });
}

// Make initMap globally accessible
window.initMap = initMap;

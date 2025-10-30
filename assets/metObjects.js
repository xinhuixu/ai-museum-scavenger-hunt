// Function to fetch details for a single object
async function fetchObjectDetails(objectId) {
    const response = await fetch(`https://collectionapi.metmuseum.org/public/collection/v1/objects/${objectId}`);
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
}

// Function to create HTML for a single object
function createObjectHTML(data) {
    // Collect all descriptive texts
    const descriptions = [
        data.objectDescription,
        data.objectHistory,
        data.objectWikidata_URL ? `<a href="${data.objectWikidata_URL}" target="_blank">Learn more on Wikidata</a>` : null,
        data.objectURL ? `<a href="${data.objectURL}" target="_blank">View on The Met website</a>` : null
    ].filter(Boolean);

    const accessionInfo = [
        data.accessionNumber ? `Accession Number: ${data.accessionNumber}` : null,
        data.creditLine
    ].filter(Boolean).join(' | ');

    return `
        <div class="hunt-item">
            <div class="item-image">
                <img src="${data.primaryImageSmall || 'https://via.placeholder.com/300x200?text=No+Image+Available'}" 
                     alt="${data.title || 'Artwork image'}"
                     onerror="this.src='https://via.placeholder.com/300x200?text=No+Image+Available'">
            </div>
            <div class="item-details">
                <div class="item-core">
                    <div class="item-title">${data.title || 'Untitled'}</div>
                    <div class="item-location">Gallery ${data.GalleryNumber || 'TBD'}</div>
                    <div class="item-metadata">
                        <p><strong>Artist:</strong> ${data.artistDisplayName || 'Unknown'}
                           ${data.artistNationality ? ` (${data.artistNationality})` : ''}</p>
                        <p><strong>Date:</strong> ${data.objectDate || 'N/A'}</p>
                        <p><strong>Type:</strong> ${data.classification || 'N/A'}</p>
                        ${data.medium ? `<p><strong>Medium:</strong> ${data.medium}</p>` : ''}
                        ${data.dimensions ? `<p><strong>Dimensions:</strong> ${data.dimensions}</p>` : ''}
                    </div>
                </div>
                ${descriptions.length > 0 ? `
                    <div class="item-description">
                        ${descriptions.map(desc => `<p>${desc}</p>`).join('')}
                        ${accessionInfo ? `<p class="accession-info">${accessionInfo}</p>` : ''}
                    </div>
                ` : ''}
            </div>
        </div>
    `;
}

// Main function to generate HTML for all objects
async function generateMetObjectsHTML(objectIds) {
    try {
        // Fetch all objects in parallel
        const objectPromises = objectIds.map(id => fetchObjectDetails(id));
        const objects = await Promise.all(objectPromises);

        // Create HTML for all objects
        return objects.map(data => createObjectHTML(data)).join('');
    } catch (error) {
        console.error('Error fetching object details:', error);
        return '<p>Error loading objects. Please try again later.</p>';
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const typefaceDetailContainer = document.getElementById('typeface-detail');
    let currentTypeface;
    let typefaces = [];

    const fetchTypefaces = async () => {
        try {
            const response = await fetch('./data/typeface.json'); // Changed to match the actual file name
            typefaces = await response.json();
            initializeTypeface();
        } catch (error) {
            console.error('Error fetching typefaces:', error);
        }
    };

    const initializeTypeface = () => {
        const urlParams = new URLSearchParams(window.location.search);
        const typefaceId = urlParams.get('id'); // Changed to string to match JSON
        currentTypeface = typefaces.find(typeface => typeface.id === typefaceId) || typefaces[0];
        renderTypefaceDetail();
    };

    const renderTypefaceDetail = () => {
        if (currentTypeface) {
            typefaceDetailContainer.innerHTML = `
                <div class="detail_head">
                    <div class="detail_back"><a href="typeface.html" id="prevTypeface">Back</a></div>
                    <div class="typeface_name">${currentTypeface.name}</div>
                    <div class="detail_next"><a href="#" id="nextTypeface">Next</a></div>
                </div>
                <div class="detail_content">
                    <div class="detail_main_img">
                        <img src="${currentTypeface.image}" alt="${currentTypeface.name}">
                    </div>
    <div class="detail_content">
        <div class="typeface_info">
            <p>Design By: ${currentTypeface.designer}</p>
            <p>Public On: ${currentTypeface.publicOn}</p>
            <p>Version: ${currentTypeface.version}</p>
            <p>Update: ${currentTypeface.updateDate}</p>
        </div>
        <div class="typeface_story">
            <h3>Story</h3>
            <p>${currentTypeface.story ? currentTypeface.story : 'No story available for this typeface.'}</p>
        </div>
        <div class="detail_img_grid">
            <img src="${currentTypeface.image1}" alt="${currentTypeface.name} Detail 1">
            <img src="${currentTypeface.image2}" alt="${currentTypeface.name} Detail 2">
        </div>
                <div class="typeface_features">
            <h3>Features:</h3>
            <p>${currentTypeface.features || 'Glyph set: 394 / Uppercase & lowercase / Alternates / Numbers & fractions / Punctuation / Diacritics / Symbols & arrows / Currency Symbols / Ligatures / En & Vi / Variable'}</p>
        </div>
    </div>
    <div class="detail_end">
        <a href="#" id="prevTypefaceBottom">Back</a>
        <a href="Typeface.html">All Typefaces</a>
        <a href="#" id="nextTypefaceBottom">Next</a>
    </div>
            `;

            document.getElementById('nextTypeface').addEventListener('click', navigateToNext);
            document.getElementById('nextTypefaceBottom').addEventListener('click', navigateToNext);
            document.getElementById('prevTypeface').addEventListener('click', navigateToPrev);
            document.getElementById('prevTypefaceBottom').addEventListener('click', navigateToPrev);
        } else {
            typefaceDetailContainer.innerHTML = '<p>Typeface not found.</p>';
        }
    };

    const navigateToNext = (e) => {
        e.preventDefault();
        const currentIndex = typefaces.findIndex(typeface => typeface.id === currentTypeface.id);
        const nextIndex = (currentIndex + 1) % typefaces.length;
        currentTypeface = typefaces[nextIndex];
        updateURL();
        renderTypefaceDetail();
    };

    const navigateToPrev = (e) => {
        e.preventDefault();
        const currentIndex = typefaces.findIndex(typeface => typeface.id === currentTypeface.id);
        const prevIndex = (currentIndex - 1 + typefaces.length) % typefaces.length;
        currentTypeface = typefaces[prevIndex];
        updateURL();
        renderTypefaceDetail();
    };

    const updateURL = () => {
        const newUrl = `${window.location.pathname}?id=${currentTypeface.id}`;
        history.pushState(null, '', newUrl);
    };

    fetchTypefaces();
});

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
    <div class="detail_left">
        <h2>DETAIL</h2>
<div class="detail_character">
    <div class="metric_diagram">
        <svg width="400" height="400" viewBox="0 0 400 400" id="metricSvg">
            <!-- Cap Height -->
            <text x="0" y="30" font-size="14" fill="white">Cap Height</text>
            <line x1="0" y1="50" x2="400" y2="50" stroke="white" stroke-width="1"/>
            <text x="380" y="30" font-size="14" fill="white" text-anchor="end">${currentTypeface.capHeight || '716'}</text>

            <!-- X-Height -->
            <text x="0" y="130" font-size="14" fill="white">X Height</text>
            <line x1="0" y1="150" x2="400" y2="150" stroke="white" stroke-width="1"/>
            <text x="380" y="130" font-size="14" fill="white" text-anchor="end">${currentTypeface.xHeight || '484'}</text>

            <!-- Base Line -->
            <text x="0" y="280" font-size="14" fill="white">Base Line</text>
            <line x1="0" y1="300" x2="400" y2="300" stroke="white" stroke-width="1"/>
            <text x="380" y="280" font-size="14" fill="white" text-anchor="end">${currentTypeface.baseLine || '0'}</text>

            <!-- Descender -->
            <text x="0" y="350" font-size="14" fill="white">Descender</text>
            <line x1="0" y1="370" x2="400" y2="370" stroke="white" stroke-width="1"/>
            <text x="380" y="350" font-size="14" fill="white" text-anchor="end">${currentTypeface.descender || '-211'}</text>

            <!-- Sample character -->
            <text x="200" y="300" font-size="250" text-anchor="middle" fill="white" class="imported-font" id="sampleChar">A</text>
        </svg>
    </div>
    <div id="characterInput" contenteditable="true" class="imported-font">P</div>
</div>
    </div>
                <div class="detail_right">
                    <h2>GLYPHS</h2>
                    <div class="glyphs_content imported-font">
                        <div class="alphabet">
                            Aa Bb Cc Dd Ee Ff Gg Hh Ii Jj Kk Ll Mm
                            Nn Oo Pp Qq Rr Ss Tt Uu Vv Ww Xx Yy Zz
                        </div>
                        <div class="numbers">
                            0 1 2 3 4 5 6 7 8 9
                        </div>
                        <div class="symbols">
                            ! @ # $ % ^ & * ( ) { } [ ] _ + = | \\ : " ' < > , . / ?
                        </div>
                    </div>
            <div class="preview_section">
                <h2>PREVIEW</h2>
                <div id="previewText" class="imported-font">
                    The quick brown fox jumps over the lazy dog.
                </div>

                        <div class="preview_controls">
                            <button id="uppercaseBtn">Uppercase</button>
                            <button id="titlecaseBtn">Title case</button>
                            <button id="lowercaseBtn">Lowercase</button>
                        </div>
                    </div>
                </div>
</div>
                    <style id="dynamicFontStyle"></style>
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
    <div class="img-carousel">
        ${currentTypeface.images && currentTypeface.images.length > 0 ? `
            <div class="img-container">
                <img src="${currentTypeface.images[0]}" alt="${currentTypeface.name} Detail 1">
                ${currentTypeface.images.length > 1 ? `<img src="${currentTypeface.images[1]}" alt="${currentTypeface.name} Detail 2">` : ''}
            </div>
            ${currentTypeface.images.length > 2 ? `
                <button class="carousel-arrow next-arrow">&#8250;</button>
            ` : ''}
        ` : 'No images available'}
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

        // Load the custom font
        const fontFace = new FontFace(currentTypeface.name, `url(${currentTypeface.fontFile})`);
        fontFace.load().then((loadedFace) => {
            document.fonts.add(loadedFace);
            document.documentElement.style.setProperty('--imported-font', `'${currentTypeface.name}'`);
        
            // Font preview functionality
            const characterInput = document.getElementById('characterInput');
            const sampleChar = document.getElementById('sampleChar');
            const previewText = document.getElementById('previewText');
            const uppercaseBtn = document.getElementById('uppercaseBtn');
            const titlecaseBtn = document.getElementById('titlecaseBtn');
            const lowercaseBtn = document.getElementById('lowercaseBtn');
    
            
            // Set up the character input event listener
            characterInput.addEventListener('input', (e) => {
                const inputChar = e.target.textContent.charAt(0) || 'P';
                sampleChar.textContent = inputChar;
                characterInput.textContent = inputChar;
            });
    
            // Set up other event listeners
            uppercaseBtn.addEventListener('click', () => {
                previewText.textContent = previewText.textContent.toUpperCase();
            });
    
            titlecaseBtn.addEventListener('click', () => {
                previewText.textContent = previewText.textContent.toLowerCase().replace(/\b\w/g, c => c.toUpperCase());
            });
    
            lowercaseBtn.addEventListener('click', () => {
                previewText.textContent = previewText.textContent.toLowerCase();
            });
    
            // Image carousel functionality
            if (currentTypeface.images && currentTypeface.images.length > 2) {
                const imgContainer = document.querySelector('.img-container');
                const nextArrow = document.querySelector('.next-arrow');
                let currentImageIndex = 0;

                nextArrow.addEventListener('click', () => {
                    currentImageIndex = (currentImageIndex + 2) % currentTypeface.images.length;
                    imgContainer.innerHTML = `
                        <img src="${currentTypeface.images[currentImageIndex]}" alt="${currentTypeface.name} Detail ${currentImageIndex + 1}">
                        ${currentTypeface.images[currentImageIndex + 1] ? `<img src="${currentTypeface.images[currentImageIndex + 1]}" alt="${currentTypeface.name} Detail ${currentImageIndex + 2}">` : ''}
                    `;
                });
            }
        }).catch(error => {
            console.error('Error loading font:', error);
        });

            // Image carousel functionality
if (currentTypeface.images && currentTypeface.images.length > 2) {
    const imgContainer = document.querySelector('.img-container');
    const nextArrow = document.querySelector('.next-arrow');
    let currentImageIndex = 0;

    nextArrow.addEventListener('click', () => {
        currentImageIndex = (currentImageIndex + 2) % currentTypeface.images.length;
        imgContainer.innerHTML = `
            <img src="${currentTypeface.images[currentImageIndex]}" alt="${currentTypeface.name} Detail ${currentImageIndex + 1}">
            ${currentTypeface.images[currentImageIndex + 1] ? `<img src="${currentTypeface.images[currentImageIndex + 1]}" alt="${currentTypeface.name} Detail ${currentImageIndex + 2}">` : ''}
        `;
    });
}
    
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

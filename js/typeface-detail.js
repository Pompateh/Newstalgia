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
    <line x1="0" y1="50" x2="400" y2="50" stroke="white" stroke-width="1" data-metric-line="capHeight"/>
    <text x="5" y="45" font-size="14" fill="white" data-metric="capHeight">Cap Height</text>
    <text x="395" y="45" font-size="14" fill="white" text-anchor="end" data-metric-value="capHeight">716</text>

    <!-- X-Height -->
    <line x1="0" y1="150" x2="400" y2="150" stroke="white" stroke-width="1" data-metric-line="xHeight"/>
    <text x="5" y="145" font-size="14" fill="white" data-metric="xHeight">X Height</text>
    <text x="395" y="145" font-size="14" fill="white" text-anchor="end" data-metric-value="xHeight">484</text>

    <!-- Base Line -->
    <line x1="0" y1="300" x2="400" y2="300" stroke="white" stroke-width="1" data-metric-line="baseLine"/>
    <text x="5" y="295" font-size="14" fill="white" data-metric="baseLine">Base Line</text>
    <text x="395" y="295" font-size="14" fill="white" text-anchor="end" data-metric-value="baseLine">0</text>

    <!-- Descender -->
    <line x1="0" y1="370" x2="400" y2="370" stroke="white" stroke-width="1" data-metric-line="descender"/>
    <text x="5" y="365" font-size="14" fill="white" data-metric="descender">Descender</text>
    <text x="395" y="365" font-size="14" fill="white" text-anchor="end" data-metric-value="descender">-211</text>

    <!-- Sample character -->
    <text x="200" y="300" font-size="250" text-anchor="middle" fill="white" class="imported-font" id="sampleChar">P</text>
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

    // Calculate metrics and update SVG
    const metrics = calculateMetrics(inputChar, currentTypeface.name, 250);
    updateSVGDiagram(metrics);
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
    
    const updateSVGDiagram = (metrics) => {
        const svgHeight = 400;
        const baseLine = 300;
        const staticDescenderY = 370; // Static position for descender line
    
        // Update Cap Height, X-Height, and Baseline
        ['capHeight', 'xHeight', 'baseLine'].forEach(metric => {
            const line = document.querySelector(`[data-metric-line='${metric}']`);
            const label = document.querySelector(`[data-metric='${metric}']`);
            const value = document.querySelector(`[data-metric-value='${metric}']`);
            
            let yPosition;
            if (metric === 'baseLine') {
                yPosition = baseLine;
            } else {
                yPosition = baseLine - metrics[metric];
            }
    
            line.setAttribute("y1", yPosition);
            line.setAttribute("y2", yPosition);
            label.setAttribute("y", yPosition - 5);
            value.setAttribute("y", yPosition - 5);
            value.textContent = Math.round(metrics[metric]);
        });
    
        // Update descender (static position)
        const descenderLine = document.querySelector(`[data-metric-line='descender']`);
        const descenderLabel = document.querySelector(`[data-metric='descender']`);
        const descenderValue = document.querySelector(`[data-metric-value='descender']`);
    
        descenderLine.setAttribute("y1", staticDescenderY);
        descenderLine.setAttribute("y2", staticDescenderY);
        descenderLabel.setAttribute("y", staticDescenderY - 5);
        descenderValue.setAttribute("y", staticDescenderY - 5);
        descenderValue.textContent = Math.round(metrics.descender);
    
        // Update sample character position
        const sampleChar = document.getElementById('sampleChar');
        sampleChar.setAttribute("y", baseLine);
    };
    
    const calculateMetrics = (char, fontFamily, fontSize) => {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        ctx.font = `${fontSize}px '${fontFamily}'`;
        
        // Measure text size
        const metrics = ctx.measureText(char);
    
        const capHeight = metrics.actualBoundingBoxAscent;
        const descender = metrics.actualBoundingBoxDescent;
        const baseLine = capHeight; // Baseline is where ascent stops
        const xHeight = capHeight * 0.6; // Rough estimate
    
        return { capHeight, xHeight, baseLine, descender };
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

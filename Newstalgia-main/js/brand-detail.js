document.addEventListener('DOMContentLoaded', () => {
    const brandData = JSON.parse(localStorage.getItem('currentBrand'));

    if (brandData) {
        const brandDetailHTML = `
            <div class="detail_head">
                <div class="detail_back"><a href="Brand.html">Back</a></div>
                <div class="brand_name">${brandData.name}</div>
                <div class="detail_next"><a href="#">Next</a></div>
            </div>
            <div class="detail_img">
                <img src="${brandData.image}" alt="${brandData.name}">
            </div>
            <div class="story">
                <h2>Story</h2>
                <p>${brandData.story}</p>
            </div>
            <div class="detail_img_grid">
                <img src="${brandData.gridImage1}" alt="Grid Image 1">
                <img src="${brandData.gridImage2}" alt="Grid Image 2">
            </div>
            <div class="detail_info">
                <div class="info_row">
                    <div class="client_info">
                        <span class="info_label">Client:</span>
                        <span class="info_value">${brandData.client}</span>
                    </div>
                    <div class="published_info">
                        <span class="info_label">Published:</span>
                        <span class="info_value">${brandData.publishedDate}</span>
                    </div>
                </div>
            </div>
            <div class="detail_end">
            <div class="footer_back"><a href="#">Back</a></div>
                <a href="index.html" class="home_btn">Home</a>
                <div class="footer_next"><a href="#">Next</a></div>
            </div>
        `;

        document.getElementById('brand-detail').innerHTML = brandDetailHTML;
    } else {
        window.location.href = 'Brand.html';
    }
});
/**
 * Background Module - Imágenes locales
 */
const Background = {
    IMAGES_PATH: 'img/',
    images: [
        'robert-lukeman-_RBcxo9AU-U-unsplash.jpg',
        'tobias-olivier-ZjUmAoN1U6A-unsplash.jpg',
        'neom-NPDnHmYsl6Y-unsplash.jpg',
        'lucas-calloch-P-yzuyWFEIk-unsplash.jpg',
        'phill-brown-T0PaR22Kv8k-unsplash.jpg',
        'phill-brown-r-RVV4u6hKY-unsplash.jpg',
        'diego-jimenez-A-NVHPka9Rk-unsplash.jpg',
        'annie-spratt-rBk2dhZBVlw-unsplash.jpg',
        'kalen-emsley-Bkci_8qcdvQ-unsplash.jpg',
        'johann-siemens-EPy0gBJzzZU_unsplash.jpg',
        'pawel-nolbert-yVmETKGjRgM_unsplash.jpg',
        'jessica-fadel-n8hz--kLWgI_unsplash.jpg',
        'neom-Iy59i0M7oP4_unsplash.jpg',
        'simon-twukN12EN7c_unsplash.jpg',
        'marek-piwnicki-NwZmYW5ETnE_unsplash.jpg',
        'phill-brown-S7YTvzJnf0w_unsplash.jpg',
        'land-o-lakes-inc-5KSXpLJRw8o_unsplash.jpg',
        'wolfgang-hasselmann-tm--9PpA_BI_unsplash.jpg',
        'bruce-barrow-Nm9stZybikM_unsplash.jpg',
        'stephanie-davison-KKp-dhqzrIM_unsplash.jpg',
        'soner-ozmen-B64sjafiUf8_unsplash.jpg'
    ],
    currentIndex: 0,
    CHANGE_INTERVAL: 900000,
    intervalId: null,
    bgElement: null,

    init() {
        this.bgElement = document.getElementById('background-image');
        const prefs = Storage.getBackgroundPrefs();
        this.currentIndex = prefs.currentIndex || 0;
        if (this.currentIndex >= this.images.length) this.currentIndex = 0;
        
        this.loadImage(this.currentIndex);
        this.startAutoChange();
    },

    loadImage(index) {
        if (index < 0 || index >= this.images.length) index = 0;
        
        const imageUrl = this.IMAGES_PATH + this.images[index];
        const img = new Image();
        
        img.onload = () => {
            if (this.bgElement) {
                this.bgElement.style.opacity = '0';
                setTimeout(() => {
                    this.bgElement.style.backgroundImage = `url(${imageUrl})`;
                    this.bgElement.style.opacity = '1';
                }, 300);
            }
            Storage.saveBackgroundPrefs({ currentIndex: this.currentIndex });
        };
        
        img.onerror = () => {
            if (this.currentIndex < this.images.length - 1) {
                this.currentIndex++;
                this.loadImage(this.currentIndex);
            }
        };
        
        img.src = imageUrl;
    },

    nextImage() {
        this.currentIndex = (this.currentIndex + 1) % this.images.length;
        this.loadImage(this.currentIndex);
        this.resetInterval();
    },

    startAutoChange() {
        if (this.intervalId) clearInterval(this.intervalId);
        this.intervalId = setInterval(() => this.nextImage(), this.CHANGE_INTERVAL);
    },

    resetInterval() {
        this.startAutoChange();
    }
};

document.addEventListener('DOMContentLoaded', () => Background.init());
window.Background = Background;
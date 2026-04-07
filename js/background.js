/**
 * Background Module - Imágenes locales con secuencia y opción de fijar
 */
const Background = {
    IMAGES_PATH: 'img/',
    images: [
        'adam-kool-ndN00KmbJ1c-unsplash.jpg',
        'alexander-slattery-LI748t0BK8w-unsplash.jpg',
        'anders-jilden-cYrMQA7a3Wc-unsplash.jpg',
        'andreas-gucklhorn-mawU2PoJWfU-unsplash.jpg',
        'andrew-ridley-Kt5hRENuotI-unsplash.jpg',
        'andrey-savelev-PWTgjVhwyBU-unsplash.jpg',
        'anna-wangler-_GqwoiT7QY8-unsplash.jpg',
        'annie-spratt-rBk2dhZBVlw-unsplash.jpg',
        'bailey-zindel-NRQV-hBF10M-unsplash.jpg',
        'bruce-barrow-Nm9stZybikM-unsplash.jpg',
        'christian-joudrey-u_nsiSvPEak-unsplash.jpg',
        'cristina-gottardi-CSpjU6hYo_0-unsplash.jpg',
        'danist-soh-bviex5lwf3s-unsplash.jpg',
        'diego-jimenez-A-NVHPka9Rk-unsplash.jpg',
        'fabian-quintero-UWQP2mh5YJI-unsplash.jpg',
        'garrett-parker-DlkF4-dbCOU-unsplash.jpg',
        'ian-dooley-DuBNA1QMpPA-unsplash.jpg',
        'iswanto-arif-OJ74pFtrYi0-unsplash.jpg',
        'jack-anstey-XVoyX7l9ocY-unsplash.jpg',
        'jessica-fadel-n8hz--kLWgI-unsplash.jpg',
        'jms-kFHz9Xh3PPU-unsplash.jpg',
        'johann-siemens-EPy0gBJzzZU-unsplash.jpg',
        'john-towner-89PFnHKg8HE-unsplash.jpg',
        'john-towner-JgOeRuGD_Y4-unsplash.jpg',
        'jonatan-pie-3l3RwQdHRHg-unsplash.jpg',
        'kace-rodriguez-p3OzJuT_Dks-unsplash.jpg',
        'kalen-emsley-Bkci_8qcdvQ-unsplash.jpg',
        'land-o-lakes-inc-5KSXpLJRw8o-unsplash.jpg',
        'luca-bravo-zAjdgNXsMeg-unsplash.jpg',
        'lucas-calloch-P-yzuyWFEIk-unsplash.jpg',
        'marek-piwnicki-NwZmYW5ETnE-unsplash.jpg',
        'neom-Iy59i0M7oP4-unsplash.jpg',
        'neom-NPDnHmYsl6Y-unsplash.jpg',
        'nick-scheerbart-xFjAftU8lMY-unsplash.jpg',
        'pawel-nolbert-yVmETKGjRgM-unsplash.jpg',
        'pexels-asadphoto-28859946.jpg',
        'pexels-asadphoto-28859947.jpg',
        'pexels-connorscottmcmanus-28708795.jpg',
        'pexels-optical-chemist-340351297-31241795.jpg',
        'pexels-optical-chemist-340351297-31256371.jpg',
        'phill-brown-S7YTvzJnf0w-unsplash.jpg',
        'phill-brown-T0PaR22Kv8k-unsplash.jpg',
        'phill-brown-r-RVV4u6hKY-unsplash.jpg',
        'qingbao-meng-01_igFr7hd4-unsplash.jpg',
        'robert-lukeman-_RBcxo9AU-U-unsplash.jpg',
        'samsommer-J3ABLQjZQBg-unsplash.jpg',
        'simon-twukN12EN7c-unsplash.jpg',
        'soner-ozmen-B64sjafiUf8-unsplash.jpg',
        'stefan-stefancik-TPv9dh822VA-unsplash.jpg',
        'stephanie-davison-KKp-dhqzrIM-unsplash.jpg',
        'tobias-olivier-ZjUmAoN1U6A-unsplash.jpg',
        'wade-meng-LgCj9qcrfhI-unsplash.jpg',
        'wil-stewart-pHANr-CpbYM-unsplash.jpg',
        'wolfgang-hasselmann-tm--9PpA_BI-unsplash.jpg'
    ],
    currentIndex: 0,
    isLocked: false,
    CHANGE_INTERVAL: 900000,
    intervalId: null,
    bgElement: null,
    lockButton: null,
    changeButton: null,

    init() {
        this.bgElement = document.getElementById('background-image');
        this.lockButton = document.getElementById('lock-bg-btn');
        this.changeButton = document.getElementById('change-bg-btn');
        
        const prefs = Storage.getBackgroundPrefs();
        this.currentIndex = prefs.currentIndex || 0;
        this.isLocked = prefs.isLocked || false;
        
        if (this.currentIndex >= this.images.length) this.currentIndex = 0;
        
        this.loadImage(this.currentIndex);
        this.updateLockButton();
        
        // Solo iniciar cambio automático si no está bloqueado
        if (!this.isLocked) {
            this.startAutoChange();
        }
        
        // Configurar evento del botón de bloqueo
        if (this.lockButton) {
            this.lockButton.addEventListener('click', () => this.toggleLock());
        }
        
        // Configurar evento del botón de cambio de fondo
        if (this.changeButton) {
            this.changeButton.addEventListener('click', () => {
                if (!this.isLocked) {
                    this.nextImage();
                }
            });
        }
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
            this.savePrefs();
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

    toggleLock() {
        this.isLocked = !this.isLocked;
        this.updateLockButton();
        this.savePrefs();
        
        if (this.isLocked) {
            // Detener cambio automático
            if (this.intervalId) {
                clearInterval(this.intervalId);
                this.intervalId = null;
            }
        } else {
            // Reanudar cambio automático
            this.startAutoChange();
        }
    },

    updateLockButton() {
        if (!this.lockButton) return;
        
        if (this.isLocked) {
            this.lockButton.classList.add('locked');
            this.lockButton.title = 'Desfijar fondo';
            // Icono de candado cerrado
            this.lockButton.innerHTML = `
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                    <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                </svg>
            `;
        } else {
            this.lockButton.classList.remove('locked');
            this.lockButton.title = 'Fijar fondo';
            // Icono de candado abierto
            this.lockButton.innerHTML = `
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                    <path d="M7 11V7a5 5 0 0 1 9.9-1"></path>
                </svg>
            `;
        }
        
        // Deshabilitar/habilitar botón de cambio de fondo
        if (this.changeButton) {
            this.changeButton.disabled = this.isLocked;
        }
    },

    savePrefs() {
        Storage.saveBackgroundPrefs({ 
            currentIndex: this.currentIndex, 
            isLocked: this.isLocked 
        });
    },

    startAutoChange() {
        if (this.intervalId) clearInterval(this.intervalId);
        // No iniciar si está bloqueado
        if (this.isLocked) return;
        this.intervalId = setInterval(() => this.nextImage(), this.CHANGE_INTERVAL);
    },

    resetInterval() {
        // Solo reiniciar si no está bloqueado
        if (!this.isLocked) {
            this.startAutoChange();
        }
    }
};

window.Background = Background;
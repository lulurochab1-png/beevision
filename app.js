const App = {
    screens: ['screen-welcome', 'screen-tutorial', 'screen-camera', 'screen-result'],
    currentScreen: 'screen-welcome',
    stream: null,

    // Mock Database
    beeDatabase: {
        'melipona-scutellaris': {
            name: 'Melipona scutellaris',
            commonName: '(Uruçu-amarela)',
            family: 'Família: Apidae',
            sting: 'Não',
            description: 'A Melipona scutellaris, conhecida como uruçu-amarela, é uma abelha social sem ferrão muito importante para polinização. Vivem em colônias grandes e produzem mel de alta qualidade.',
            image: 'bee.png'
        }
    },

    init() {
        this.bindEvents();
    },

    bindEvents() {
        // Navigation
        document.getElementById('btn-start').addEventListener('click', () => this.navigateTo('screen-tutorial'));
        document.getElementById('btn-tutorial-ok').addEventListener('click', () => this.navigateTo('screen-camera'));
        document.getElementById('btn-skip').addEventListener('click', () => this.navigateTo('screen-camera'));
        document.getElementById('btn-home').addEventListener('click', () => this.navigateTo('screen-welcome'));
        document.getElementById('btn-close-camera').addEventListener('click', () => this.navigateTo('screen-welcome'));
        document.getElementById('btn-back-to-camera').addEventListener('click', () => this.navigateTo('screen-camera'));
        document.getElementById('btn-new-id').addEventListener('click', () => this.navigateTo('screen-camera'));

        // Camera Action
        document.getElementById('btn-capture').addEventListener('click', () => this.capturePhoto());
    },

    navigateTo(screenId) {
        // Stop camera if leaving camera screen
        if (this.currentScreen === 'screen-camera' && screenId !== 'screen-camera') {
            this.stopCamera();
        }

        // Start camera if entering camera screen
        if (screenId === 'screen-camera') {
            this.startCamera();
        }

        // Switch screens
        this.screens.forEach(id => {
            document.getElementById(id).classList.remove('active');
        });

        document.getElementById(screenId).classList.add('active');
        this.currentScreen = screenId;
    },

    async startCamera() {
        const video = document.getElementById('camera-stream');
        try {
            this.stream = await navigator.mediaDevices.getUserMedia({
                video: { facingMode: 'environment' },
                audio: false
            });
            video.srcObject = this.stream;
        } catch (err) {
            console.error("Erro ao acessar câmera: ", err);
            alert("Não foi possível acessar a câmera. Verifique as permissões.");
        }
    },

    stopCamera() {
        if (this.stream) {
            this.stream.getTracks().forEach(track => track.stop());
            this.stream = null;
        }
    },

    capturePhoto() {
        const video = document.getElementById('camera-stream');
        const canvas = document.getElementById('camera-capture');
        const context = canvas.getContext('2d');

        // Set canvas size to video size
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;

        // Draw current frame to canvas
        context.drawImage(video, 0, 0, canvas.width, canvas.height);

        // Simulate AI analysis
        this.analyzeWithAI();
    },

    analyzeWithAI() {
        const overlay = document.getElementById('ai-processing');
        overlay.classList.add('active');

        // Simulate network delay / AI processing
        setTimeout(() => {
            overlay.classList.remove('active');
            this.showResult('melipona-scutellaris');
        }, 2000);
    },

    showResult(beeId) {
        const bee = this.beeDatabase[beeId];
        if (!bee) return;

        // Update UI
        document.getElementById('result-name').innerText = bee.name;
        document.getElementById('result-common-name').innerText = bee.commonName;
        document.getElementById('result-family').innerText = bee.family;
        document.getElementById('result-sting').innerText = bee.sting;
        document.getElementById('result-description').innerText = bee.description;
        document.getElementById('result-bee-img').src = bee.image;

        this.navigateTo('screen-result');
    }
};

document.addEventListener('DOMContentLoaded', () => App.init());

// Registro do Service Worker para PWA
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('./service-worker.js')
            .then(() => console.log('Service Worker registrado com sucesso'))
            .catch(err => console.log('Erro ao registrar Service Worker:', err));
    });
}
window.addEventListener('error', function (e) {
  alert('Erro no app: ' + e.message);
});

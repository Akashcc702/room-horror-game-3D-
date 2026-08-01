// =====================================================
// 3D HOUSE SCANNER PRO - ULTIMATE VERSION
// 26 Features Consolidated
// =====================================================

// ===== GLOBAL STATE =====
const state = {
    scene: null, camera: null, renderer: null,
    videoStream: null, meshModel: null, pointCloud: null,
    isScanning: false, frameCount: 0,
    pointCloudData: [], scanQuality: 0,
    coverageGrid: [],
    
    // Lighting
    ambientLight: null, directionalLight: null,
    
    // Measurements
    measureMode: false, measurePoints: [],
    measureLine: null, raycaster: new THREE.Raycaster(),
    mouse: new THREE.Vector2(),
    
    // Screenshots
    screenshots: [], screenshotCount: 0,
    
    // GPS
    gpsData: null,
    
    // Detail
    currentZoom: 1, detailCaptures: 0,
    
    // Low Light
    isLowLightEnabled: false,
    lowLightSettings: { brightness: 1, contrast: 1 },
    
    // Weather
    currentWeather: 'clear', weatherIntensity: 50,
    weatherParticles: [],
    
    // Projects
    currentProject: null, projects: [],
    
    // Achievements
    achievements: [], totalPoints: 0,
    unlockedAchievements: [],
    lightingPresetsUsed: new Set(),
    weatherTypesUsed: new Set(),
    pdfsGenerated: 0,
    
    // Furniture
    selectedFurniture: null, furnitureObjects: [],
    
    // Character
    character: null, characterParts: {},
    
    // Game
    isGameMode: false, gameScore: 0, gameTime: 60,
    gameCoins: [], gameInterval: null,
    highScore: parseInt(localStorage.getItem('highScore') || '0'),
    
    // Music
    musicPlaying: false, audioContext: null,
    musicGain: null, currentTrack: 0,
    musicTracks: [], musicTimeout: null,
    currentTrackObj: null,
    
    // Video Tour
    isTourRecording: false,
    
    // Recording
    isRecording: false, mediaRecorder: null,
    recordedChunks: [], recordingStartTime: 0,
    
    // Camera
    isDragging: false,
    previousMouse: { x: 0, y: 0 },
    cameraAngle: { theta: 0, phi: Math.PI / 4, radius: 8 },
    
    // Language
    currentLang: localStorage.getItem('lang') || 'kn',
    
    // DB
    db: null
};

// ===== TRANSLATIONS =====
const TRANSLATIONS = {
    en: {
        appTitle: '🏠 3D Scanner Pro',
        welcomeTitle: '🏠 3D House Scanner Pro',
        subtitle: '26 Features • AI Ready • Offline',
        startScan: '📷 Start Scanning',
        scanning: '🔍 Scanning',
        quality: 'Q:',
        measure: 'Measure', qualityScore: 'Quality',
        record: 'Record', floorPlan: 'Floor Plan',
        dims: 'Dimensions', materials: 'Materials',
        export: 'Export', screenshots: 'Screenshots',
        timeOfDay: 'Time', theme: 'Theme',
        gps: 'GPS', detail: 'Detail', lighting: 'Lighting',
        achievements: 'Achievements', projects: 'Projects',
        lowLight: 'Low Light', pdf: 'PDF', weather: 'Weather',
        furniture: 'Furniture', repair: 'Repair',
        videoTour: 'Tour', email: 'Email',
        game: 'Game', music: 'Music',
        character: 'Character', language: 'Language',
        morning: 'Morning', noon: 'Noon',
        evening: 'Evening', night: 'Night',
        measureMode: 'Measurement Mode',
        measureHint: 'Click 2 points on model',
        clear: 'Clear', exportModel: 'Export Model',
        gpsLocation: 'GPS Location', refresh: 'Refresh',
        saveToProject: 'Save to Project',
        detailCapture: 'Detail Capture', zoom: 'Zoom:',
        capture: 'Capture', lightingSim: 'Lighting Simulator',
        lowLightEnhance: 'Low Light Enhancement',
        enable: 'Enable', brightness: 'Brightness:',
        contrast: 'Contrast:', weatherSim: 'Weather Simulation',
        intensity: 'Intensity:', pdfReport: 'PDF Report',
        generatePdf: 'Generate PDF', saveProject: 'Save Project',
        savedProjects: 'Saved Projects',
        repairTool: 'Model Repair', furnitureLib: 'Furniture Library',
        videoTourTitle: 'Video Tour', startRecording: 'Start Recording',
        emailExport: 'Email Export', sendEmail: 'Send Email',
        gameMode: 'Game Mode', startGame: 'Start Game',
        gameOver: 'Game Over!', customizeChar: 'Character',
        selectLang: 'Language'
    },
    kn: {
        appTitle: '🏠 3D ಸ್ಕ್ಯಾನರ್ ಪ್ರೋ',
        welcomeTitle: '🏠 3D ಮನೆ ಸ್ಕ್ಯಾನರ್ ಪ್ರೋ',
        subtitle: '26 ವೈಶಿಷ್ಟ್ಯಗಳು • AI ಸಿದ್ಧ • ಆಫ್‌ಲೈನ್',
        startScan: '📷 ಸ್ಕ್ಯಾನಿಂಗ್ ಪ್ರಾರಂಭಿಸಿ',
        scanning: '🔍 ಸ್ಕ್ಯಾನಿಂಗ್',
        quality: 'ಗುಣ:',
        measure: 'ಅಳತೆ', qualityScore: 'ಗುಣಮಟ್ಟ',
        record: 'ರೆಕಾರ್ಡ್', floorPlan: 'ಫ್ಲೋರ್ ಪ್ಲಾನ್',
        dims: 'ಅಳತೆಗಳು', materials: 'ವಸ್ತುಗಳು',
        export: 'ರಫ್ತು', screenshots: 'ಸ್ಕ್ರೀನ್‌ಶಾಟ್',
        timeOfDay: 'ಸಮಯ', theme: 'ಥೀಮ್',
        gps: 'GPS', detail: 'ವಿವರ', lighting: 'ಬೆಳಕು',
        achievements: 'ಸಾಧನೆಗಳು', projects: 'ಯೋಜನೆಗಳು',
        lowLight: 'ಕಡಿಮೆ ಬೆಳಕು', pdf: 'PDF', weather: 'ಹವಾಮಾನ',
        furniture: 'ಪೀಠೋಪಕರಣ', repair: 'ದುರಸ್ತಿ',
        videoTour: 'ಟೂರ್', email: 'ಇಮೇಲ್',
        game: 'ಗೇಮ್', music: 'ಸಂಗೀತ',
        character: 'ಪಾತ್ರ', language: 'ಭಾಷೆ',
        morning: 'ಬೆಳಿಗ್ಗೆ', noon: 'ಮಧ್ಯಾಹ್ನ',
        evening: 'ಸಂಜೆ', night: 'ರಾತ್ರಿ',
        measureMode: 'ಅಳತೆ ಮೋಡ್',
        measureHint: 'ಮಾದೆಲಿಯ ಮೇಲೆ 2 ಪಾಯಿಂಟ್ ಕ್ಲಿಕ್ ಮಾಡಿ',
        clear: 'ತೆರವುಗೊಳಿಸಿ', exportModel: 'ಮಾದೆಲಿ ರಫ್ತು',
        gpsLocation: 'GPS ಸ್ಥಳ', refresh: 'ರಿಫ್ರೆಶ್',
        saveToProject: 'ಯೋಜನೆಗೆ ಉಳಿಸಿ',
        detailCapture: 'ವಿವರ ಸೆರೆ', zoom: 'ಜೂಮ್:',
        capture: 'ಸೆರೆಹಿಡಿ', lightingSim: 'ಬೆಳಕು ಸಿಮ್ಯುಲೇಟರ್',
        lowLightEnhance: 'ಕಡಿಮೆ ಬೆಳಕು ವರ್ಧನೆ',
        enable: 'ಸಕ್ರಿಯಗೊಳಿಸಿ', brightness: 'ಪ್ರಕಾಶ:',
        contrast: 'ಕಾಂಟ್ರಾಸ್ಟ್:', weatherSim: 'ಹವಾಮಾನ ಸಿಮ್ಯುಲೇಷನ್',
        intensity: 'ತೀವ್ರತೆ:', pdfReport: 'PDF ವರದಿ',
        generatePdf: 'PDF ರಚಿಸಿ', saveProject: 'ಯೋಜನೆ ಉಳಿಸಿ',
        savedProjects: 'ಉಳಿಸಿದ ಯೋಜನೆಗಳು',
        repairTool: 'ಮಾದೆಲಿ ದುರಸ್ತಿ', furnitureLib: 'ಪೀಠೋಪಕರಣ ಗ್ರಂಥಾಲಯ',
        videoTourTitle: 'ವೀಡಿಯೋ ಟೂರ್', startRecording: 'ರೆಕಾರ್ಡಿಂಗ್ ಪ್ರಾರಂಭ',
        emailExport: 'ಇಮೇಲ್ ರಫ್ತು', sendEmail: 'ಇಮೇಲ್ ಕಳುಹಿಸಿ',
        gameMode: 'ಗೇಮ್ ಮೋಡ್', startGame: 'ಗೇಮ್ ಪ್ರಾರಂಭ',
        gameOver: 'ಗೇಮ್ ಮುಗಿಯಿತು!', customizeChar: 'ಪಾತ್ರ',
        selectLang: 'ಭಾಷೆ'
    },
    hi: {
        appTitle: '🏠 3D स्कैनर प्रो',
        welcomeTitle: '🏠 3D हाउस स्कैनर प्रो',
        subtitle: '26 विशेषताएं • AI तैयार • ऑफलाइन',
        startScan: '📷 स्कैनिंग शुरू करें',
        scanning: '🔍 स्कैनिंग',
        quality: 'गुण:',
        measure: 'माप', qualityScore: 'गुणवत्ता',
        record: 'रिकॉर्ड', floorPlan: 'फ्लोर प्लान',
        dims: 'आयाम', materials: 'सामग्री',
        export: 'निर्यात', screenshots: 'स्क्रीनशॉट',
        timeOfDay: 'समय', theme: 'थीम',
        gps: 'GPS', detail: 'विवरण', lighting: 'प्रकाश',
        achievements: 'उपलब्धियां', projects: 'परियोजनाएं',
        lowLight: 'कम रोशनी', pdf: 'PDF', weather: 'मौसम',
        furniture: 'फर्नीचर', repair: 'मरम्मत',
        videoTour: 'टूर', email: 'ईमेल',
        game: 'गेम', music: 'संगीत',
        character: 'चरित्र', language: 'भाषा',
        morning: 'सुबह', noon: 'दोपहर',
        evening: 'शाम', night: 'रात',
        measureMode: 'माप मोड',
        measureHint: 'मॉडल पर 2 बिंदु क्लिक करें',
        clear: 'साफ', exportModel: 'मॉडल निर्यात',
        gpsLocation: 'GPS स्थान', refresh: 'रीफ्रेश',
        saveToProject: 'प्रोजेक्ट में सहेजें',
        detailCapture: 'विवरण कैप्चर', zoom: 'ज़ूम:',
        capture: 'कैप्चर', lightingSim: 'प्रकाश सिम्युलेटर',
        lowLightEnhance: 'कम रोशनी सुधार',
        enable: 'सक्षम', brightness: 'चमक:',
        contrast: 'कंट्रास्ट:', weatherSim: 'मौसम सिमुलेशन',
        intensity: 'तीव्रता:', pdfReport: 'PDF रिपोर्ट',
        generatePdf: 'PDF बनाएं', saveProject: 'प्रोजेक्ट सहेजें',
        savedProjects: 'सहेजे गए प्रोजेक्ट',
        repairTool: 'मॉडल मरम्मत', furnitureLib: 'फर्नीचर लाइब्रेरी',
        videoTourTitle: 'वीडियो टूर', startRecording: 'रिकॉर्डिंग शुरू',
        emailExport: 'ईमेल निर्यात', sendEmail: 'ईमेल भेजें',
        gameMode: 'गेम मोड', startGame: 'गेम शुरू',
        gameOver: 'गेम खत्म!', customizeChar: 'चरित्र',
        selectLang: 'भाषा'
    }
};

// ===== MATERIALS =====
const MATERIALS = [
    { name: 'White', color: 0xffffff },
    { name: 'Beige', color: 0xf5f5dc },
    { name: 'Gray', color: 0x808080 },
    { name: 'Wood', color: 0x8b4513 },
    { name: 'Marble', color: 0xe8e8e8 },
    { name: 'Tile', color: 0xd3d3d3 },
    { name: 'Concrete', color: 0x999999 },
    { name: 'Brick', color: 0xb22222 },
    { name: 'Blue', color: 0x4682b4 },
    { name: 'Green', color: 0x228b22 },
    { name: 'Yellow', color: 0xffd700 },
    { name: 'Black', color: 0x1a1a1a }
];

// ===== TIME PRESETS =====
const TIME_PRESETS = {
    morning: { ambient: 0xffd4a3, ambientI: 0.5, dir: 0xffaa66, dirI: 0.7, bg: 0xffe4b5 },
    noon: { ambient: 0xffffff, ambientI: 0.7, dir: 0xffffff, dirI: 1.0, bg: 0x87ceeb },
    evening: { ambient: 0xff8c69, ambientI: 0.4, dir: 0xff6347, dirI: 0.6, bg: 0xff7f50 },
    night: { ambient: 0x191970, ambientI: 0.2, dir: 0x4169e1, dirI: 0.3, bg: 0x0a0a2e }
};

// ===== LIGHTING PRESETS =====
const LIGHTING_PRESETS = {
    natural: { ambient: 0xffffff, ambientI: 0.6, dir: 0xffffff, dirI: 0.8, angle: 45 },
    warm: { ambient: 0xffd4a3, ambientI: 0.7, dir: 0xffaa66, dirI: 0.9, angle: 30 },
    cool: { ambient: 0xa3d4ff, ambientI: 0.5, dir: 0x66aaff, dirI: 0.8, angle: 60 },
    dramatic: { ambient: 0x333333, ambientI: 0.2, dir: 0xffffff, dirI: 1.5, angle: 15 },
    studio: { ambient: 0xffffff, ambientI: 0.8, dir: 0xffffff, dirI: 1.0, angle: 45 },
    sunset: { ambient: 0xff8c69, ambientI: 0.4, dir: 0xff6347, dirI: 0.7, angle: 20 }
};

// ===== ACHIEVEMENTS =====
const ACHIEVEMENTS = [
    { id: 'first_scan', name: 'First Steps', desc: 'Complete first scan', icon: '🎯', points: 10, condition: () => state.frameCount >= 50 },
    { id: 'high_quality', name: 'Quality Master', desc: '90%+ quality', icon: '⭐', points: 25, condition: () => state.scanQuality >= 90 },
    { id: 'gps_tagged', name: 'Location Scout', desc: 'Tag GPS', icon: '📍', points: 15, condition: () => state.gpsData !== null },
    { id: 'detail_master', name: 'Detail Eye', desc: '5 detail shots', icon: '🔍', points: 20, condition: () => state.detailCaptures >= 5 },
    { id: 'lighting_pro', name: 'Lighting Pro', desc: 'Try all presets', icon: '💡', points: 20, condition: () => state.lightingPresetsUsed.size >= 6 },
    { id: 'weather_exp', name: 'Weather Explorer', desc: 'Try all weather', icon: '🌤️', points: 20, condition: () => state.weatherTypesUsed.size >= 6 },
    { id: 'pdf_creator', name: 'Report Writer', desc: 'Generate PDF', icon: '📄', points: 15, condition: () => state.pdfsGenerated >= 1 },
    { id: 'project_mgr', name: 'Project Manager', desc: 'Save 3 projects', icon: '📋', points: 30, condition: () => state.projects.length >= 3 },
    { id: 'low_light', name: 'Night Owl', desc: 'Use low light', icon: '🌙', points: 10, condition: () => state.isLowLightEnabled },
    { id: 'screenshot_pro', name: 'Screenshot Pro', desc: '10 screenshots', icon: '📸', points: 20, condition: () => state.screenshotCount >= 10 }
];

// ===== FURNITURE ITEMS =====
const FURNITURE_ITEMS = [
    { id: 'chair', name: 'Chair', icon: '🪑', cat: 'living', builder: buildChair },
    { id: 'table', name: 'Table', icon: '🪵', cat: 'living', builder: buildTable },
    { id: 'sofa', name: 'Sofa', icon: '🛋️', cat: 'living', builder: buildSofa },
    { id: 'lamp', name: 'Lamp', icon: '💡', cat: 'living', builder: buildLamp },
    { id: 'bed', name: 'Bed', icon: '🛏️', cat: 'bedroom', builder: buildBed },
    { id: 'wardrobe', name: 'Wardrobe', icon: '🚪', cat: 'bedroom', builder: buildWardrobe },
    { id: 'stove', name: 'Stove', icon: '🍳', cat: 'kitchen', builder: buildStove },
    { id: 'fridge', name: 'Fridge', icon: '🧊', cat: 'kitchen', builder: buildFridge },
    { id: 'desk', name: 'Desk', icon: '🖥️', cat: 'office', builder: buildDesk },
    { id: 'officeChair', name: 'Office Chair', icon: '💺', cat: 'office', builder: buildOfficeChair },
    { id: 'bookshelf', name: 'Bookshelf', icon: '📚', cat: 'office', builder: buildBookshelf }
];

// ===== FURNITURE BUILDERS =====
function buildChair(color) {
    const g = new THREE.Group();
    const m = new THREE.MeshPhongMaterial({ color });
    const seat = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.05, 0.5), m);
    seat.position.y = 0.45; g.add(seat);
    const back = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.5, 0.05), m);
    back.position.set(0, 0.7, -0.225); g.add(back);
    for (let i = 0; i < 4; i++) {
        const leg = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 0.45), m);
        leg.position.set((i % 2 === 0 ? -0.2 : 0.2), 0.225, (i < 2 ? -0.2 : 0.2));
        g.add(leg);
    }
    return g;
}

function buildTable(color) {
    const g = new THREE.Group();
    const m = new THREE.MeshPhongMaterial({ color });
    const top = new THREE.Mesh(new THREE.BoxGeometry(1.5, 0.05, 0.8), m);
    top.position.y = 0.75; g.add(top);
    for (let i = 0; i < 4; i++) {
        const leg = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 0.75), m);
        leg.position.set((i % 2 === 0 ? -0.65 : 0.65), 0.375, (i < 2 ? -0.3 : 0.3));
        g.add(leg);
    }
    return g;
}

function buildSofa(color) {
    const g = new THREE.Group();
    const m = new THREE.MeshPhongMaterial({ color });
    const base = new THREE.Mesh(new THREE.BoxGeometry(2, 0.4, 0.8), m);
    base.position.y = 0.3; g.add(base);
    const back = new THREE.Mesh(new THREE.BoxGeometry(2, 0.5, 0.15), m);
    back.position.set(0, 0.65, -0.325); g.add(back);
    return g;
}

function buildLamp(color) {
    const g = new THREE.Group();
    const m = new THREE.MeshPhongMaterial({ color });
    const base = new THREE.Mesh(new THREE.CylinderGeometry(0.15, 0.2, 0.05), m);
    base.position.y = 0.025; g.add(base);
    const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 1.2), m);
    pole.position.y = 0.65; g.add(pole);
    const shade = new THREE.Mesh(new THREE.ConeGeometry(0.2, 0.3, 16, 1, true),
        new THREE.MeshPhongMaterial({ color: 0xFFF8DC, side: THREE.DoubleSide }));
    shade.position.y = 1.3; shade.rotation.x = Math.PI; g.add(shade);
    return g;
}

function buildBed(color) {
    const g = new THREE.Group();
    const m = new THREE.MeshPhongMaterial({ color });
    const frame = new THREE.Mesh(new THREE.BoxGeometry(2, 0.3, 1.5), m);
    frame.position.y = 0.3; g.add(frame);
    const mattress = new THREE.Mesh(new THREE.BoxGeometry(1.9, 0.2, 1.4),
        new THREE.MeshPhongMaterial({ color: 0xFFFFFF }));
    mattress.position.y = 0.55; g.add(mattress);
    return g;
}

function buildWardrobe(color) {
    const g = new THREE.Group();
    const m = new THREE.MeshPhongMaterial({ color });
    const body = new THREE.Mesh(new THREE.BoxGeometry(1.2, 2, 0.6), m);
    body.position.y = 1; g.add(body);
    return g;
}

function buildStove(color) {
    const g = new THREE.Group();
    const m = new THREE.MeshPhongMaterial({ color });
    const body = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.9, 0.6), m);
    body.position.y = 0.45; g.add(body);
    return g;
}

function buildFridge(color) {
    const g = new THREE.Group();
    const m = new THREE.MeshPhongMaterial({ color });
    const body = new THREE.Mesh(new THREE.BoxGeometry(0.7, 1.8, 0.7), m);
    body.position.y = 0.9; g.add(body);
    return g;
}

function buildDesk(color) {
    const g = new THREE.Group();
    const m = new THREE.MeshPhongMaterial({ color });
    const top = new THREE.Mesh(new THREE.BoxGeometry(1.5, 0.05, 0.7), m);
    top.position.y = 0.75; g.add(top);
    for (let i = 0; i < 4; i++) {
        const leg = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 0.75), m);
        leg.position.set((i % 2 === 0 ? -0.7 : 0.7), 0.375, (i < 2 ? -0.3 : 0.3));
        g.add(leg);
    }
    return g;
}

function buildOfficeChair(color) {
    const g = new THREE.Group();
    const m = new THREE.MeshPhongMaterial({ color });
    const seat = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.08, 0.5), m);
    seat.position.y = 0.5; g.add(seat);
    const back = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.6, 0.08), m);
    back.position.set(0, 0.85, -0.21); g.add(back);
    return g;
}

function buildBookshelf(color) {
    const g = new THREE.Group();
    const m = new THREE.MeshPhongMaterial({ color });
    for (let i = 0; i < 5; i++) {
        const shelf = new THREE.Mesh(new THREE.BoxGeometry(1, 0.03, 0.3), m);
        shelf.position.y = i * 0.5; g.add(shelf);
    }
    return g;
}

// ===== THREE.JS INIT =====
function initThreeJS() {
    state.scene = new THREE.Scene();
    state.scene.background = new THREE.Color(0x87ceeb);
    
    state.camera = new THREE.PerspectiveCamera(
        75, window.innerWidth / window.innerHeight, 0.1, 1000
    );
    updateCameraPosition();
    
    const canvas = document.getElementById('canvas3D');
    state.renderer = new THREE.WebGLRenderer({
        canvas, alpha: true, antialias: true,
        preserveDrawingBuffer: true
    });
    state.renderer.setSize(window.innerWidth, window.innerHeight);
    
    state.ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    state.scene.add(state.ambientLight);
    
    state.directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    state.directionalLight.position.set(5, 10, 5);
    state.scene.add(state.directionalLight);
    
    createCharacter();
    
    for (let i = 0; i < 10; i++) {
        state.coverageGrid[i] = [];
        for (let j = 0; j < 10; j++) state.coverageGrid[i][j] = 0;
    }
    
    animate();
}

// ===== CHARACTER =====
function createCharacter() {
    state.character = new THREE.Group();
    
    const head = new THREE.Mesh(new THREE.SphereGeometry(0.3, 16, 16),
        new THREE.MeshPhongMaterial({ color: 0xFFDBB5 }));
    head.position.y = 1.6; state.character.add(head);
    state.characterParts.head = head;
    
    const hair = new THREE.Mesh(new THREE.SphereGeometry(0.32, 16, 16, 0, Math.PI * 2, 0, Math.PI / 2),
        new THREE.MeshPhongMaterial({ color: 0x3E2723 }));
    hair.position.y = 1.65; state.character.add(hair);
    state.characterParts.hair = hair;
    
    const body = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.3, 0.8, 8),
        new THREE.MeshPhongMaterial({ color: 0x2196F3 }));
    body.position.y = 1; state.character.add(body);
    state.characterParts.body = body;
    
    const armMat = new THREE.MeshPhongMaterial({ color: 0x2196F3 });
    const armL = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.1, 0.7, 8), armMat);
    armL.position.set(-0.4, 1, 0); state.character.add(armL);
    state.characterParts.armL = armL;
    const armR = armL.clone(); armR.position.x = 0.4;
    state.character.add(armR); state.characterParts.armR = armR;
    
    const legMat = new THREE.MeshPhongMaterial({ color: 0x424242 });
    const legL = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.12, 0.8, 8), legMat);
    legL.position.set(-0.15, 0.4, 0); state.character.add(legL);
    state.characterParts.legL = legL;
    const legR = legL.clone(); legR.position.x = 0.15;
    state.character.add(legR); state.characterParts.legR = legR;
    
    const shoeMat = new THREE.MeshPhongMaterial({ color: 0x000000 });
    const shoeL = new THREE.Mesh(new THREE.BoxGeometry(0.15, 0.1, 0.25), shoeMat);
    shoeL.position.set(-0.15, 0.05, 0.05); state.character.add(shoeL);
    state.characterParts.shoeL = shoeL;
    const shoeR = shoeL.clone(); shoeR.position.x = 0.15;
    state.character.add(shoeR); state.characterParts.shoeR = shoeR;
    
    state.scene.add(state.character);
}

// ===== CAMERA CONTROLS =====
function updateCameraPosition() {
    const { theta, phi, radius } = state.cameraAngle;
    state.camera.position.x = radius * Math.sin(phi) * Math.cos(theta);
    state.camera.position.y = radius * Math.cos(phi);
    state.camera.position.z = radius * Math.sin(phi) * Math.sin(theta);
    state.camera.lookAt(0, 1, 0);
}

function setupCameraControls() {
    const canvas = document.getElementById('canvas3D');
    
    canvas.addEventListener('mousedown', (e) => {
        if (state.isGameMode) return;
        if (state.measureMode) { handleMeasureClick(e); return; }
        state.isDragging = true;
        state.previousMouse = { x: e.clientX, y: e.clientY };
    });
    
    canvas.addEventListener('mousemove', (e) => {
        if (!state.isDragging || state.isGameMode) return;
        const dx = e.clientX - state.previousMouse.x;
        const dy = e.clientY - state.previousMouse.y;
        state.cameraAngle.theta -= dx * 0.01;
        state.cameraAngle.phi = Math.max(0.1, Math.min(Math.PI - 0.1,
            state.cameraAngle.phi - dy * 0.01));
        updateCameraPosition();
        state.previousMouse = { x: e.clientX, y: e.clientY };
    });
    
    canvas.addEventListener('mouseup', () => state.isDragging = false);
    canvas.addEventListener('mouseleave', () => state.isDragging = false);
    
    canvas.addEventListener('wheel', (e) => {
        e.preventDefault();
        state.cameraAngle.radius = Math.max(2, Math.min(30,
            state.cameraAngle.radius + e.deltaY * 0.01));
        updateCameraPosition();
    });
}

// ===== CAMERA START =====
async function startCamera() {
    try {
        state.videoStream = await navigator.mediaDevices.getUserMedia({
            video: { facingMode: 'environment' }
        });
        document.getElementById('videoFeed').srcObject = state.videoStream;
        document.getElementById('startScreen').classList.add('hidden');
        
        setTimeout(() => {
            document.getElementById('scanOverlay').classList.remove('hidden');
            document.getElementById('progressPanel').classList.remove('hidden');
            document.getElementById('sideToolbar').classList.remove('hidden');
            state.isScanning = true;
            startScanning();
        }, 1000);
    } catch (err) {
        alert('Camera access required.');
    }
}

function startScanning() {
    const interval = setInterval(() => {
        if (!state.isScanning) { clearInterval(interval); return; }
        
        state.frameCount++;
        const progress = Math.min(100, (state.frameCount / 50) * 100);
        document.getElementById('progressFill').style.width = progress + '%';
        document.getElementById('progressText').textContent = Math.round(progress) + '%';
        
        state.scanQuality = Math.min(100, state.frameCount * 2);
        document.getElementById('qualityFill').style.width = state.scanQuality + '%';
        document.getElementById('qualityScore').textContent = state.scanQuality + '%';
        
        if (state.frameCount >= 50) {
            clearInterval(interval);
            completeScanning();
            checkAchievements();
        }
    }, 500);
}

function completeScanning() {
    state.isScanning = false;
    generateMesh();
    updateDimensions();
    document.getElementById('scanOverlay').classList.add('hidden');
    document.getElementById('progressPanel').classList.add('hidden');
    document.getElementById('videoFeed').style.display = 'none';
}

function generateMesh() {
    const geometry = new THREE.BoxGeometry(8, 4, 8);
    const material = new THREE.MeshPhongMaterial({
        color: 0xF5F5DC, side: THREE.BackSide,
        transparent: true, opacity: 0.7
    });
    state.meshModel = new THREE.Mesh(geometry, material);
    state.meshModel.position.y = 2;
    state.scene.add(state.meshModel);
    
    const floor = new THREE.Mesh(
        new THREE.PlaneGeometry(8, 8),
        new THREE.MeshPhongMaterial({ color: 0x8B4513 })
    );
    floor.rotation.x = -Math.PI / 2;
    state.scene.add(floor);
}

function updateDimensions() {
    if (!state.meshModel) return;
    const box = new THREE.Box3().setFromObject(state.meshModel);
    const size = new THREE.Vector3();
    box.getSize(size);
    document.getElementById('dimW').textContent = `W:${size.x.toFixed(1)}m`;
    document.getElementById('dimH').textContent = `H:${size.y.toFixed(1)}m`;
    document.getElementById('dimD').textContent = `D:${size.z.toFixed(1)}m`;
}

// ===== MEASUREMENT =====
function toggleMeasureMode() {
    state.measureMode = !state.measureMode;
    document.getElementById('measureInfo').classList.toggle('hidden', !state.measureMode);
    document.getElementById('measureBtn').classList.toggle('active', state.measureMode);
    if (!state.measureMode) clearMeasurement();
}

function handleMeasureClick(event) {
    const rect = state.renderer.domElement.getBoundingClientRect();
    state.mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    state.mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
    state.raycaster.setFromCamera(state.mouse, state.camera);
    
    const targets = [];
    if (state.meshModel) targets.push(state.meshModel);
    state.furnitureObjects.forEach(f => targets.push(f));
    
    const intersects = state.raycaster.intersectObjects(targets, true);
    if (intersects.length > 0) {
        const point = intersects[0].point.clone();
        state.measurePoints.push(point);
        
        const marker = new THREE.Mesh(
            new THREE.SphereGeometry(0.1, 16, 16),
            new THREE.MeshBasicMaterial({ color: 0xff0000 })
        );
        marker.position.copy(point);
        marker.userData.isMeasureMarker = true;
        state.scene.add(marker);
        
        if (state.measurePoints.length === 2) showMeasurement();
    }
}

function showMeasurement() {
    const [p1, p2] = state.measurePoints;
    const distance = p1.distanceTo(p2);
    
    const lineGeo = new THREE.BufferGeometry().setFromPoints([p1, p2]);
    const lineMat = new THREE.LineBasicMaterial({ color: 0xff0000 });
    state.measureLine = new THREE.Line(lineGeo, lineMat);
    state.scene.add(state.measureLine);
    
    document.getElementById('measureResult').textContent = `Distance: ${distance.toFixed(2)}m`;
}

function clearMeasurement() {
    state.measurePoints = [];
    if (state.measureLine) {
        state.scene.remove(state.measureLine);
        state.measureLine = null;
    }
    const toRemove = [];
    state.scene.traverse(obj => {
        if (obj.userData.isMeasureMarker) toRemove.push(obj);
    });
    toRemove.forEach(obj => state.scene.remove(obj));
    document.getElementById('measureResult').textContent = 'Distance: ---';
}

// ===== VIDEO RECORDING =====
function toggleRecording() {
    if (!state.isRecording) startRecording();
    else stopRecording();
}

function startRecording() {
    try {
        const canvas = document.getElementById('canvas3D');
        const stream = canvas.captureStream(30);
        state.mediaRecorder = new MediaRecorder(stream, { mimeType: 'video/webm' });
        state.recordedChunks = [];
        
        state.mediaRecorder.ondataavailable = (e) => {
            if (e.data.size > 0) state.recordedChunks.push(e.data);
        };
        
        state.mediaRecorder.onstop = () => {
            const blob = new Blob(state.recordedChunks, { type: 'video/webm' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `scan_${Date.now()}.webm`;
            a.click();
        };
        
        state.mediaRecorder.start();
        state.isRecording = true;
        state.recordingStartTime = Date.now();
        document.getElementById('recordingIndicator').classList.remove('hidden');
        document.getElementById('recordBtn').classList.add('active');
        updateRecordingTime();
    } catch (err) {
        alert('Recording not supported');
    }
}

function stopRecording() {
    if (state.mediaRecorder && state.isRecording) {
        state.mediaRecorder.stop();
        state.isRecording = false;
        document.getElementById('recordingIndicator').classList.add('hidden');
        document.getElementById('recordBtn').classList.remove('active');
    }
}

function updateRecordingTime() {
    if (!state.isRecording) return;
    const elapsed = Math.floor((Date.now() - state.recordingStartTime) / 1000);
    const mins = String(Math.floor(elapsed / 60)).padStart(2, '0');
    const secs = String(elapsed % 60).padStart(2, '0');
    document.getElementById('recTime').textContent = `${mins}:${secs}`;
    setTimeout(updateRecordingTime, 1000);
}

// ===== FLOOR PLAN =====
function generateFloorPlan() {
    const canvas = document.getElementById('floorPlanCanvas');
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, 400, 400);
    
    ctx.strokeStyle = '#e0e0e0';
    for (let i = 0; i <= 400; i += 20) {
        ctx.beginPath();
        ctx.moveTo(i, 0); ctx.lineTo(i, 400);
        ctx.moveTo(0, i); ctx.lineTo(400, i);
        ctx.stroke();
    }
    
    ctx.strokeStyle = '#00aa66';
    ctx.lineWidth = 3;
    ctx.strokeRect(50, 50, 300, 300);
    
    ctx.fillStyle = '#333';
    ctx.font = 'bold 14px Arial';
    ctx.fillText('Floor Plan - 8m × 8m', 130, 390);
    
    document.getElementById('floorPlanModal').classList.remove('hidden');
}

function downloadFloorPlan() {
    const canvas = document.getElementById('floorPlanCanvas');
    const url = canvas.toDataURL('image/png');
    const a = document.createElement('a');
    a.href = url;
    a.download = `floor_plan_${Date.now()}.png`;
    a.click();
}

// ===== MATERIALS =====
function openMaterialPanel() {
    const grid = document.getElementById('materialGrid');
    grid.innerHTML = '';
    MATERIALS.forEach((mat, idx) => {
        const swatch = document.createElement('div');
        swatch.className = 'material-swatch';
        swatch.style.background = `#${mat.color.toString(16).padStart(6, '0')}`;
        swatch.title = mat.name;
        swatch.onclick = () => applyMaterial(idx);
        grid.appendChild(swatch);
    });
    document.getElementById('materialPanel').classList.remove('hidden');
}

function applyMaterial(idx) {
    if (!state.meshModel) { alert('Complete scanning first!'); return; }
    const mat = MATERIALS[idx];
    state.meshModel.material = new THREE.MeshPhongMaterial({
        color: mat.color, side: THREE.DoubleSide
    });
    document.querySelectorAll('.material-swatch').forEach((s, i) => {
        s.classList.toggle('active', i === idx);
    });
}

// ===== EXPORT =====
function openExportPanel() {
    document.getElementById('exportPanel').classList.remove('hidden');
}

function exportModel(format) {
    if (!state.meshModel) { alert('No model to export!'); return; }
    
    let exporter, filename, mimeType, content;
    
    switch (format) {
        case 'obj':
            exporter = new THREE.OBJExporter();
            content = exporter.parse(state.scene);
            filename = `model_${Date.now()}.obj`;
            mimeType = 'text/plain';
            break;
        case 'gltf':
            exporter = new THREE.GLTFExporter();
            exporter.parse(state.scene, (result) => {
                const json = JSON.stringify(result);
                downloadFile(json, `model_${Date.now()}.gltf`, 'application/json');
            }, { binary: false });
            return;
        case 'stl':
            exporter = new THREE.STLExporter();
            content = exporter.parse(state.scene);
            filename = `model_${Date.now()}.stl`;
            mimeType = 'application/octet-stream';
            break;
    }
    
    downloadFile(content, filename, mimeType);
    alert(`${format.toUpperCase()} exported!`);
}

function downloadFile(content, filename, mimeType) {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = filename; a.click();
    URL.revokeObjectURL(url);
}

// ===== SCREENSHOTS =====
function takeScreenshot() {
    state.renderer.render(state.scene, state.camera);
    const dataUrl = state.renderer.domElement.toDataURL('image/png');
    state.screenshots.push({
        id: Date.now(), url: dataUrl,
        timestamp: new Date().toLocaleTimeString()
    });
    state.screenshotCount++;
    updateScreenshotGallery();
    openScreenshotModal();
    checkAchievements();
}

function updateScreenshotGallery() {
    const gallery = document.getElementById('screenshotGallery');
    gallery.innerHTML = '';
    state.screenshots.forEach(ss => {
        const item = document.createElement('div');
        item.className = 'gallery-item';
        item.innerHTML = `
            <img src="${ss.url}" alt="Screenshot">
            <button class="delete-btn" data-id="${ss.id}">×</button>
        `;
        item.querySelector('img').onclick = () => {
            const a = document.createElement('a');
            a.href = ss.url;
            a.download = `screenshot_${ss.id}.png`;
            a.click();
        };
        item.querySelector('.delete-btn').onclick = (e) => {
            e.stopPropagation();
            state.screenshots = state.screenshots.filter(s => s.id !== ss.id);
            updateScreenshotGallery();
        };
        gallery.appendChild(item);
    });
}

function openScreenshotModal() {
    updateScreenshotGallery();
    document.getElementById('screenshotModal').classList.remove('hidden');
}

// ===== TIME OF DAY =====
function openTimePanel() {
    document.getElementById('timePanel').classList.remove('hidden');
}

function setTimeOfDay(time) {
    const preset = TIME_PRESETS[time];
    if (!preset) return;
    state.ambientLight.color.setHex(preset.ambient);
    state.ambientLight.intensity = preset.ambientI;
    state.directionalLight.color.setHex(preset.dir);
    state.directionalLight.intensity = preset.dirI;
    state.scene.background = new THREE.Color(preset.bg);
    
    document.querySelectorAll('.time-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.time === time);
    });
}

// ===== GPS =====
function openGPSPanel() {
    document.getElementById('gpsPanel').classList.remove('hidden');
    getGPSLocation();
}

function getGPSLocation() {
    if (!navigator.geolocation) { alert('Geolocation not supported'); return; }
    
    navigator.geolocation.getCurrentPosition(
        (position) => {
            state.gpsData = {
                lat: position.coords.latitude,
                lng: position.coords.longitude,
                accuracy: position.coords.accuracy,
                alt: position.coords.altitude,
                timestamp: new Date().toISOString()
            };
            document.getElementById('gpsLat').textContent = state.gpsData.lat.toFixed(6);
            document.getElementById('gpsLng').textContent = state.gpsData.lng.toFixed(6);
            document.getElementById('gpsAccuracy').textContent = state.gpsData.accuracy.toFixed(1) + 'm';
            document.getElementById('gpsAlt').textContent = (state.gpsData.alt || 'N/A') + 'm';
            document.getElementById('gpsTime').textContent = new Date(state.gpsData.timestamp).toLocaleString();
            
            document.getElementById('gpsInfo').classList.remove('hidden');
            document.getElementById('gpsCoords').textContent =
                `${state.gpsData.lat.toFixed(4)}, ${state.gpsData.lng.toFixed(4)}`;
            checkAchievements();
        },
        (error) => alert('GPS Error: ' + error.message),
        { enableHighAccuracy: true, timeout: 10000 }
    );
}

function saveGPSToProject() {
    if (!state.gpsData) { alert('Get GPS first!'); return; }
    if (state.currentProject) {
        state.currentProject.gps = state.gpsData;
        saveProject();
        alert('GPS saved!');
    } else alert('Create project first!');
}

// ===== DETAIL CAPTURE =====
function openDetailPanel() {
    document.getElementById('detailPanel').classList.remove('hidden');
}

function setZoom(level) {
    state.currentZoom = level;
    document.getElementById('zoomValue').textContent = level.toFixed(1) + 'x';
    document.getElementById('zoomSlider').value = level;
    const video = document.getElementById('videoFeed');
    video.style.transform = `scale(${level})`;
    state.camera.fov = 75 / level;
    state.camera.updateProjectionMatrix();
}

function captureDetail() {
    state.detailCaptures++;
    takeScreenshot();
    alert(`Detail captured! Total: ${state.detailCaptures}`);
}

// ===== LIGHTING =====
function openLightingPanel() {
    document.getElementById('lightingPanel').classList.remove('hidden');
}

function applyLightingPreset(presetName) {
    const preset = LIGHTING_PRESETS[presetName];
    if (!preset) return;
    state.ambientLight.color.setHex(preset.ambient);
    state.ambientLight.intensity = preset.ambientI;
    state.directionalLight.color.setHex(preset.dir);
    state.directionalLight.intensity = preset.dirI;
    
    const angleRad = (preset.angle * Math.PI) / 180;
    state.directionalLight.position.set(
        10 * Math.cos(angleRad), 10, 10 * Math.sin(angleRad)
    );
    
    state.lightingPresetsUsed.add(presetName);
    document.querySelectorAll('.light-preset').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.preset === presetName);
    });
    checkAchievements();
}

function updateLightingFromSliders() {
    state.ambientLight.intensity = parseFloat(document.getElementById('ambientIntensity').value);
    state.directionalLight.intensity = parseFloat(document.getElementById('dirIntensity').value);
    const angle = parseFloat(document.getElementById('lightAngle').value);
    const angleRad = (angle * Math.PI) / 180;
    state.directionalLight.position.set(
        10 * Math.cos(angleRad), 10, 10 * Math.sin(angleRad)
    );
    state.directionalLight.color.set(document.getElementById('lightColor').value);
}

// ===== LOW LIGHT =====
function openLowLightPanel() {
    document.getElementById('lowLightPanel').classList.remove('hidden');
}

function toggleLowLight() {
    state.isLowLightEnabled = document.getElementById('lowLightToggle').checked;
    const overlay = document.getElementById('lowLightOverlay');
    if (state.isLowLightEnabled) {
        overlay.classList.remove('hidden');
        applyLowLightFilter();
        checkAchievements();
    } else {
        overlay.classList.add('hidden');
        document.getElementById('videoFeed').style.filter = '';
    }
}

function applyLowLightFilter() {
    const video = document.getElementById('videoFeed');
    const { brightness, contrast } = state.lowLightSettings;
    video.style.filter = `brightness(${brightness}) contrast(${contrast})`;
}

function updateLowLightSettings() {
    state.lowLightSettings.brightness = parseFloat(document.getElementById('brightnessSlider').value);
    state.lowLightSettings.contrast = parseFloat(document.getElementById('contrastSlider').value);
    document.getElementById('brightnessVal').textContent = state.lowLightSettings.brightness.toFixed(1);
    document.getElementById('contrastVal').textContent = state.lowLightSettings.contrast.toFixed(1);
    if (state.isLowLightEnabled) applyLowLightFilter();
}

function applyEnhancePreset(preset) {
    const presets = {
        auto: { brightness: 1.5, contrast: 1.2 },
        bright: { brightness: 2.0, contrast: 1.3 },
        night: { brightness: 2.5, contrast: 1.5 }
    };
    const p = presets[preset];
    document.getElementById('brightnessSlider').value = p.brightness;
    document.getElementById('contrastSlider').value = p.contrast;
    updateLowLightSettings();
}

// ===== WEATHER =====
function openWeatherPanel() {
    document.getElementById('weatherPanel').classList.remove('hidden');
}

function setWeather(type) {
    state.currentWeather = type;
    state.weatherTypesUsed.add(type);
    
    document.querySelectorAll('.weather-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.weather === type);
    });
    
    clearWeatherParticles();
    
    switch (type) {
        case 'clear': state.scene.background = new THREE.Color(0x87ceeb); break;
        case 'cloudy': state.scene.background = new THREE.Color(0x708090); break;
        case 'rain': state.scene.background = new THREE.Color(0x4a5568); startRain(); break;
        case 'snow': state.scene.background = new THREE.Color(0xb0c4de); startSnow(); break;
        case 'fog':
            state.scene.background = new THREE.Color(0x9ca3af);
            state.scene.fog = new THREE.Fog(0x9ca3af, 5, 20);
            break;
        case 'storm': state.scene.background = new THREE.Color(0x2d3748); startRain(); break;
    }
    checkAchievements();
}

function startRain() {
    const overlay = document.getElementById('weatherOverlay');
    const count = Math.floor(state.weatherIntensity * 2);
    for (let i = 0; i < count; i++) {
        const drop = document.createElement('div');
        drop.className = 'weather-particle rain-drop';
        drop.style.left = Math.random() * 100 + '%';
        drop.style.height = (10 + Math.random() * 20) + 'px';
        drop.style.animationDuration = (0.5 + Math.random() * 0.5) + 's';
        overlay.appendChild(drop);
        state.weatherParticles.push(drop);
    }
}

function startSnow() {
    const overlay = document.getElementById('weatherOverlay');
    const count = Math.floor(state.weatherIntensity);
    for (let i = 0; i < count; i++) {
        const flake = document.createElement('div');
        flake.className = 'weather-particle snow-flake';
        flake.textContent = '❄';
        flake.style.left = Math.random() * 100 + '%';
        flake.style.fontSize = (10 + Math.random() * 10) + 'px';
        flake.style.animationDuration = (3 + Math.random() * 5) + 's';
        overlay.appendChild(flake);
        state.weatherParticles.push(flake);
    }
}

function clearWeatherParticles() {
    state.weatherParticles.forEach(p => p.remove());
    state.weatherParticles = [];
    state.scene.fog = null;
}

function updateWeatherIntensity() {
    state.weatherIntensity = parseInt(document.getElementById('weatherIntensity').value);
    document.getElementById('weatherIntensityVal').textContent = state.weatherIntensity + '%';
    const type = state.currentWeather;
    clearWeatherParticles();
    if (type === 'rain' || type === 'storm') startRain();
    else if (type === 'snow') startSnow();
}

// ===== PDF =====
function openPDFPanel() {
    document.getElementById('pdfPanel').classList.remove('hidden');
}

function generatePDF() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    const date = new Date().toLocaleDateString();
    let y = 20;
    
    doc.setFontSize(20);
    doc.setTextColor(0, 170, 102);
    doc.text('3D House Scan Report', 20, y); y += 15;
    
    doc.setFontSize(11);
    doc.setTextColor(0);
    doc.text(`Date: ${date}`, 20, y); y += 7;
    doc.text(`Project: ${state.currentProject?.name || 'Untitled'}`, 20, y); y += 10;
    
    doc.setFontSize(14);
    doc.setTextColor(0, 170, 102);
    doc.text('Scan Summary', 20, y); y += 8;
    
    doc.setFontSize(11);
    doc.setTextColor(0);
    doc.text(`Frames: ${state.frameCount}`, 20, y); y += 6;
    doc.text(`Quality: ${state.scanQuality}%`, 20, y); y += 10;
    
    if (document.getElementById('pdfIncludeDimensions').checked) {
        doc.setFontSize(14);
        doc.setTextColor(0, 170, 102);
        doc.text('Dimensions', 20, y); y += 8;
        doc.setFontSize(11);
        doc.setTextColor(0);
        doc.text(`${document.getElementById('dimW').textContent} × ${document.getElementById('dimH').textContent} × ${document.getElementById('dimD').textContent}`, 20, y);
        y += 10;
    }
    
    if (document.getElementById('pdfIncludeGPS').checked && state.gpsData) {
        doc.setFontSize(14);
        doc.setTextColor(0, 170, 102);
        doc.text('Location', 20, y); y += 8;
        doc.setFontSize(11);
        doc.setTextColor(0);
        doc.text(`Lat: ${state.gpsData.lat.toFixed(6)}`, 20, y); y += 6;
        doc.text(`Lng: ${state.gpsData.lng.toFixed(6)}`, 20, y); y += 10;
    }
    
    if (document.getElementById('pdfIncludeImages').checked && state.screenshots.length > 0) {
        if (y > 200) { doc.addPage(); y = 20; }
        doc.setFontSize(14);
        doc.setTextColor(0, 170, 102);
        doc.text('Screenshots', 20, y); y += 8;
        state.screenshots.slice(0, 3).forEach(ss => {
            if (y > 250) { doc.addPage(); y = 20; }
            try {
                doc.addImage(ss.url, 'PNG', 20, y, 80, 60);
                y += 65;
            } catch (e) {}
        });
    }
    
    doc.save(`scan_report_${Date.now()}.pdf`);
    state.pdfsGenerated++;
    checkAchievements();
    alert('PDF generated!');
}

// ===== PROJECTS (IndexedDB) =====
function initDB() {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open('HouseScannerDB', 1);
        request.onerror = () => reject(request.error);
        request.onsuccess = () => { state.db = request.result; resolve(); };
        request.onupgradeneeded = (event) => {
            const db = event.target.result;
            if (!db.objectStoreNames.contains('projects')) {
                db.createObjectStore('projects', { keyPath: 'id', autoIncrement: true });
            }
        };
    });
}

async function openProjectPanel() {
    document.getElementById('projectPanel').classList.remove('hidden');
    await loadProjects();
    if (state.currentProject) {
        document.getElementById('projectName').value = state.currentProject.name;
        document.getElementById('projectNotes').value = state.currentProject.notes || '';
    }
}

async function saveProject() {
    const name = document.getElementById('projectName').value.trim();
    if (!name) { alert('Enter name!'); return; }
    
    const project = {
        name,
        notes: document.getElementById('projectNotes').value,
        gps: state.gpsData,
        frameCount: state.frameCount,
        quality: state.scanQuality,
        createdAt: state.currentProject?.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString()
    };
    
    try {
        const tx = state.db.transaction('projects', 'readwrite');
        const store = tx.objectStore('projects');
        
        if (state.currentProject?.id) {
            project.id = state.currentProject.id;
            await new Promise((res, rej) => {
                const r = store.put(project);
                r.onsuccess = res; r.onerror = rej;
            });
        } else {
            const r = store.add(project);
            await new Promise((res) => { r.onsuccess = () => { project.id = r.result; res(); }; });
        }
        
        state.currentProject = project;
        await loadProjects();
        checkAchievements();
        alert('Project saved!');
    } catch (err) {
        alert('Error: ' + err.message);
    }
}

async function loadProjects() {
    try {
        const tx = state.db.transaction('projects', 'readonly');
        const store = tx.objectStore('projects');
        const request = store.getAll();
        request.onsuccess = () => {
            state.projects = request.result;
            renderProjectList();
        };
    } catch (err) { console.error(err); }
}

function renderProjectList() {
    const list = document.getElementById('projectList');
    list.innerHTML = '';
    if (state.projects.length === 0) {
        list.innerHTML = '<p style="color: var(--text-secondary); text-align: center;">No projects</p>';
        return;
    }
    state.projects.forEach(project => {
        const item = document.createElement('div');
        item.className = 'project-item';
        item.innerHTML = `
            <div>
                <div class="project-item-name">${project.name}</div>
                <div class="project-item-date">${new Date(project.updatedAt).toLocaleDateString()}</div>
            </div>
            <div class="project-item-actions">
                <button onclick="loadProject(${project.id})">📂</button>
                <button onclick="deleteProject(${project.id})">🗑️</button>
            </div>
        `;
        list.appendChild(item);
    });
}

async function loadProject(id) {
    const project = state.projects.find(p => p.id === id);
    if (!project) return;
    state.currentProject = project;
    document.getElementById('projectName').value = project.name;
    document.getElementById('projectNotes').value = project.notes || '';
    alert(`Loaded: ${project.name}`);
}

async function deleteProject(id) {
    if (!confirm('Delete?')) return;
    try {
        const tx = state.db.transaction('projects', 'readwrite');
        await tx.objectStore('projects').delete(id);
        await loadProjects();
    } catch (err) { alert('Error: ' + err.message); }
}

// ===== ACHIEVEMENTS =====
function openAchievementPanel() {
    document.getElementById('achievementPanel').classList.remove('hidden');
    renderAchievements();
}

function renderAchievements() {
    const list = document.getElementById('achievementList');
    list.innerHTML = '';
    let unlockedCount = 0;
    
    ACHIEVEMENTS.forEach(ach => {
        const unlocked = state.unlockedAchievements.includes(ach.id);
        if (unlocked) unlockedCount++;
        const item = document.createElement('div');
        item.className = `achievement-item ${unlocked ? 'unlocked' : 'locked'}`;
        item.innerHTML = `
            <div class="achievement-icon">${ach.icon}</div>
            <div class="achievement-info">
                <div class="achievement-name">${ach.name}</div>
                <div class="achievement-desc">${ach.desc}</div>
            </div>
            <div class="achievement-points">${unlocked ? '✓' : ''} ${ach.points}</div>
        `;
        list.appendChild(item);
    });
    
    document.getElementById('unlockedCount').textContent = unlockedCount;
    document.getElementById('totalPoints').textContent = state.totalPoints;
}

function checkAchievements() {
    ACHIEVEMENTS.forEach(ach => {
        if (!state.unlockedAchievements.includes(ach.id) && ach.condition()) {
            unlockAchievement(ach);
        }
    });
}

function unlockAchievement(ach) {
    state.unlockedAchievements.push(ach.id);
    state.totalPoints += ach.points;
    
    document.getElementById('achievementName').textContent = ach.name;
    document.getElementById('achievementPoints').textContent = `+${ach.points} points`;
    const notif = document.getElementById('achievementNotification');
    notif.classList.remove('hidden');
    setTimeout(() => notif.classList.add('hidden'), 4000);
    
    localStorage.setItem('achievements', JSON.stringify({
        unlocked: state.unlockedAchievements,
        points: state.totalPoints
    }));
}

function loadAchievements() {
    const saved = localStorage.getItem('achievements');
    if (saved) {
        const data = JSON.parse(saved);
        state.unlockedAchievements = data.unlocked || [];
        state.totalPoints = data.points || 0;
    }
}

// ===== FURNITURE =====
function openFurniturePanel() {
    document.getElementById('furniturePanel').classList.remove('hidden');
    renderFurnitureGrid('all');
}

function renderFurnitureGrid(category) {
    const grid = document.getElementById('furnitureGrid');
    grid.innerHTML = '';
    const items = category === 'all' ? FURNITURE_ITEMS : FURNITURE_ITEMS.filter(f => f.cat === category);
    items.forEach(item => {
        const div = document.createElement('div');
        div.className = 'furniture-item';
        div.dataset.id = item.id;
        div.innerHTML = `<div class="furniture-icon">${item.icon}</div><div class="furniture-name">${item.name}</div>`;
        div.onclick = () => selectFurniture(item.id);
        grid.appendChild(div);
    });
}

function selectFurniture(id) {
    state.selectedFurniture = FURNITURE_ITEMS.find(f => f.id === id);
    document.querySelectorAll('.furniture-item').forEach(el => {
        el.classList.toggle('selected', el.dataset.id === id);
    });
}

function addFurnitureToScene() {
    if (!state.selectedFurniture) { alert('Select furniture!'); return; }
    const color = parseInt(document.getElementById('furnitureColor').value.replace('#', '0x'));
    const obj = state.selectedFurniture.builder(color);
    obj.position.set((Math.random() - 0.5) * 6, 0, (Math.random() - 0.5) * 6);
    state.scene.add(obj);
    state.furnitureObjects.push(obj);
    alert(`${state.selectedFurniture.name} added!`);
}

// ===== REPAIR =====
function openRepairPanel() {
    document.getElementById('repairPanel').classList.remove('hidden');
    updateRepairStats();
}

function updateRepairStats() {
    if (!state.meshModel) {
        document.getElementById('vertexCount').textContent = '0';
        document.getElementById('faceCount').textContent = '0';
        return;
    }
    const geo = state.meshModel.geometry;
    document.getElementById('vertexCount').textContent = geo.attributes.position.count.toLocaleString();
    document.getElementById('faceCount').textContent = (geo.index ? geo.index.count / 3 : 0).toLocaleString();
}

function performRepair(action) {
    if (!state.meshModel) { alert('Complete scanning first!'); return; }
    const log = document.getElementById('repairLog');
    let message = '';
    
    switch (action) {
        case 'fillHoles': message = '✓ Holes filled'; break;
        case 'smooth': message = '✓ Smoothed'; break;
        case 'simplify': message = '✓ Simplified'; break;
        case 'remesh': message = '✓ Remeshed'; break;
        case 'recalcNormals':
            state.meshModel.geometry.computeVertexNormals();
            message = '✓ Normals recalculated';
            break;
        case 'autoRepair':
            performRepair('fillHoles');
            performRepair('smooth');
            performRepair('recalcNormals');
            message = '✓ Auto repair complete';
            break;
    }
    
    const entry = document.createElement('div');
    entry.className = 'log-entry log-success';
    entry.textContent = `[${new Date().toLocaleTimeString()}] ${message}`;
    log.appendChild(entry);
    log.scrollTop = log.scrollHeight;
    updateRepairStats();
}

// ===== VIDEO TOUR =====
function openVideoPanel() {
    document.getElementById('videoPanel').classList.remove('hidden');
}

async function startVideoTour() {
    if (!state.meshModel) { alert('Complete scanning first!'); return; }
    
    const style = document.getElementById('tourStyle').value;
    const duration = parseInt(document.getElementById('tourDuration').value);
    
    state.isTourRecording = true;
    document.getElementById('tourProgress').classList.remove('hidden');
    document.getElementById('startTourBtn').disabled = true;
    
    const canvas = document.getElementById('canvas3D');
    const stream = canvas.captureStream(30);
    const recorder = new MediaRecorder(stream, { mimeType: 'video/webm' });
    const chunks = [];
    
    recorder.ondataavailable = (e) => { if (e.data.size > 0) chunks.push(e.data); };
    recorder.onstop = () => {
        const blob = new Blob(chunks, { type: 'video/webm' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `tour_${Date.now()}.webm`;
        a.click();
        state.isTourRecording = false;
        document.getElementById('tourProgress').classList.add('hidden');
        document.getElementById('startTourBtn').disabled = false;
        alert('Tour saved!');
    };
    
    recorder.start();
    const startTime = Date.now();
    
    const animateTour = () => {
        if (!state.isTourRecording) return;
        const elapsed = (Date.now() - startTime) / 1000;
        const progress = elapsed / duration;
        if (progress >= 1) { recorder.stop(); return; }
        
        document.getElementById('tourProgressFill').style.width = (progress * 100) + '%';
        document.getElementById('tourStatus').textContent = `Recording... ${Math.round(progress * 100)}%`;
        
        switch (style) {
            case 'orbit':
                state.cameraAngle.theta = progress * Math.PI * 2;
                state.cameraAngle.phi = Math.PI / 3;
                state.cameraAngle.radius = 8;
                break;
            case 'flythrough':
                state.cameraAngle.theta = progress * Math.PI * 2;
                state.cameraAngle.phi = Math.PI / 4 + Math.sin(progress * Math.PI * 2) * 0.2;
                state.cameraAngle.radius = 5 + Math.sin(progress * Math.PI * 4) * 2;
                break;
            case 'topdown':
                state.cameraAngle.theta = progress * Math.PI * 2;
                state.cameraAngle.phi = 0.1;
                state.cameraAngle.radius = 10;
                break;
            case 'cinematic':
                state.cameraAngle.theta = progress * Math.PI * 1.5;
                state.cameraAngle.phi = Math.PI / 4 + Math.sin(progress * Math.PI) * 0.3;
                state.cameraAngle.radius = 6 + Math.sin(progress * Math.PI * 2) * 3;
                break;
        }
        updateCameraPosition();
        requestAnimationFrame(animateTour);
    };
    animateTour();
}

// ===== EMAIL =====
function openEmailPanel() {
    document.getElementById('emailPanel').classList.remove('hidden');
}

function sendEmail() {
    const recipient = document.getElementById('recipientEmail').value;
    const subject = document.getElementById('emailSubject').value;
    const body = document.getElementById('emailBody').value;
    if (!recipient) { alert('Enter email!'); return; }
    const mailtoLink = `mailto:${recipient}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.location.href = mailtoLink;
}

// ===== GAME =====
function openGamePanel() {
    document.getElementById('gamePanel').classList.remove('hidden');
    updateGameDisplay();
}

function startGame() {
    state.isGameMode = true;
    state.gameScore = 0;
    state.gameTime = 60;
    state.gameCoins = [];
    
    document.getElementById('gamePanel').classList.add('hidden');
    document.getElementById('gameHUD').classList.remove('hidden');
    document.getElementById('gameScoreTop').classList.remove('hidden');
    document.getElementById('gameOverPanel').classList.add('hidden');
    
    spawnCoins(10);
    
    state.gameInterval = setInterval(() => {
        state.gameTime--;
        updateGameDisplay();
        if (state.gameTime <= 0) endGame();
    }, 1000);
}

function spawnCoins(count) {
    for (let i = 0; i < count; i++) {
        const coin = document.createElement('div');
        coin.className = 'game-coin';
        coin.innerHTML = '🪙';
        coin.style.left = (10 + Math.random() * 80) + '%';
        coin.style.top = (15 + Math.random() * 70) + '%';
        coin.onclick = (e) => collectCoin(e.target);
        document.getElementById('container').appendChild(coin);
        state.gameCoins.push(coin);
    }
}

function collectCoin(coinElement) {
    if (!state.isGameMode) return;
    coinElement.classList.add('coin-collected');
    state.gameScore += 10;
    setTimeout(() => {
        coinElement.remove();
        state.gameCoins = state.gameCoins.filter(c => c !== coinElement);
        if (state.gameCoins.length < 3 && state.gameTime > 10) spawnCoins(1);
        if (state.gameCoins.length === 0) endGame(true);
    }, 500);
    updateGameDisplay();
}

function endGame(allCollected = false) {
    clearInterval(state.gameInterval);
    state.isGameMode = false;
    state.gameCoins.forEach(c => c.remove());
    state.gameCoins = [];
    
    document.getElementById('gameHUD').classList.add('hidden');
    document.getElementById('gameScoreTop').classList.add('hidden');
    document.getElementById('gamePanel').classList.remove('hidden');
    document.getElementById('gameOverPanel').classList.remove('hidden');
    
    if (state.gameScore > state.highScore) {
        state.highScore = state.gameScore;
        localStorage.setItem('highScore', state.highScore);
    }
    
    document.getElementById('finalScore').textContent =
        `${allCollected ? '🎉 All Coins!' : '⏱️ Time Up!'} Score: ${state.gameScore}`;
    document.getElementById('highScore').textContent = `🏆 High Score: ${state.highScore}`;
}

function resetGame() {
    state.gameScore = 0;
    state.gameTime = 60;
    state.gameCoins.forEach(c => c.remove());
    state.gameCoins = [];
    document.getElementById('gameOverPanel').classList.add('hidden');
    updateGameDisplay();
}

function updateGameDisplay() {
    document.getElementById('gameScoreDisplay').textContent = state.gameScore;
    document.getElementById('gameTimeDisplay').textContent = state.gameTime + 's';
    document.getElementById('coinCount').textContent = state.gameCoins.length;
    document.getElementById('hudScore').textContent = state.gameScore;
    document.getElementById('hudTime').textContent = state.gameTime;
    document.getElementById('topScoreValue').textContent = state.gameScore;
}

// ===== CHARACTER =====
function openCharacterPanel() {
    document.getElementById('characterPanel').classList.remove('hidden');
}

function applyCharacterColors() {
    const skin = document.getElementById('skinColor').value;
    const shirt = document.getElementById('shirtColor').value;
    const pants = document.getElementById('pantsColor').value;
    const hair = document.getElementById('hairColor').value;
    const shoes = document.getElementById('shoeColor').value;
    
    if (state.characterParts.head) state.characterParts.head.material.color.set(skin);
    if (state.characterParts.hair) state.characterParts.hair.material.color.set(hair);
    if (state.characterParts.body) state.characterParts.body.material.color.set(shirt);
    if (state.characterParts.armL) {
        state.characterParts.armL.material.color.set(shirt);
        state.characterParts.armR.material.color.set(shirt);
    }
    if (state.characterParts.legL) {
        state.characterParts.legL.material.color.set(pants);
        state.characterParts.legR.material.color.set(pants);
    }
    if (state.characterParts.shoeL) {
        state.characterParts.shoeL.material.color.set(shoes);
        state.characterParts.shoeR.material.color.set(shoes);
    }
    alert('Character updated!');
}

function applyCharacterPreset(preset) {
    const presets = {
        casual: { skin: '#FFDBB5', shirt: '#2196F3', pants: '#424242', hair: '#3E2723', shoes: '#FFFFFF' },
        formal: { skin: '#FFDBB5', shirt: '#000000', pants: '#1A1A1A', hair: '#000000', shoes: '#000000' },
        sporty: { skin: '#FFDBB5', shirt: '#FF5722', pants: '#212121', hair: '#FFC107', shoes: '#FF5722' },
        gamer: { skin: '#FFDBB5', shirt: '#9C27B0', pants: '#311B92', hair: '#00E676', shoes: '#000000' }
    };
    const p = presets[preset];
    document.getElementById('skinColor').value = p.skin;
    document.getElementById('shirtColor').value = p.shirt;
    document.getElementById('pantsColor').value = p.pants;
    document.getElementById('hairColor').value = p.hair;
    document.getElementById('shoeColor').value = p.shoes;
    applyCharacterColors();
}

// ===== MUSIC =====
function initAudio() {
    state.audioContext = new (window.AudioContext || window.webkitAudioContext)();
    state.musicGain = state.audioContext.createGain();
    state.musicGain.gain.value = 0.5;
    state.musicGain.connect(state.audioContext.destination);
    
    state.musicTracks = [
        { name: 'Ambient Pad', generator: generateAmbientPad },
        { name: 'Soft Piano', generator: generateSoftPiano },
        { name: 'Nature Sounds', generator: generateNatureSounds },
        { name: 'Chill Beats', generator: generateChillBeats }
    ];
}

function generateAmbientPad() {
    const osc1 = state.audioContext.createOscillator();
    const osc2 = state.audioContext.createOscillator();
    const gain = state.audioContext.createGain();
    osc1.type = 'sine'; osc1.frequency.value = 220;
    osc2.type = 'sine'; osc2.frequency.value = 330;
    gain.gain.value = 0.1;
    osc1.connect(gain); osc2.connect(gain);
    gain.connect(state.musicGain);
    osc1.start(); osc2.start();
    return { stop: () => { osc1.stop(); osc2.stop(); } };
}

function generateSoftPiano() {
    const notes = [261.63, 329.63, 392.00, 523.25];
    let noteIndex = 0;
    const playNote = () => {
        if (!state.musicPlaying) return;
        const osc = state.audioContext.createOscillator();
        const gain = state.audioContext.createGain();
        osc.type = 'sine';
        osc.frequency.value = notes[noteIndex % notes.length];
        gain.gain.setValueAtTime(0, state.audioContext.currentTime);
        gain.gain.linearRampToValueAtTime(0.2, state.audioContext.currentTime + 0.1);
        gain.gain.linearRampToValueAtTime(0, state.audioContext.currentTime + 1);
        osc.connect(gain); gain.connect(state.musicGain);
        osc.start(); osc.stop(state.audioContext.currentTime + 1);
        noteIndex++;
        state.musicTimeout = setTimeout(playNote, 800);
    };
    playNote();
    return { stop: () => clearTimeout(state.musicTimeout) };
}

function generateNatureSounds() {
    const bufferSize = 2 * state.audioContext.sampleRate;
    const buffer = state.audioContext.createBuffer(1, bufferSize, state.audioContext.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) data[i] = Math.random() * 2 - 1;
    const noise = state.audioContext.createBufferSource();
    noise.buffer = buffer; noise.loop = true;
    const filter = state.audioContext.createBiquadFilter();
    filter.type = 'lowpass'; filter.frequency.value = 500;
    const gain = state.audioContext.createGain();
    gain.gain.value = 0.15;
    noise.connect(filter); filter.connect(gain);
    gain.connect(state.musicGain);
    noise.start();
    return { stop: () => noise.stop() };
}

function generateChillBeats() {
    let beatCount = 0;
    const playBeat = () => {
        if (!state.musicPlaying) return;
        const osc = state.audioContext.createOscillator();
        const gain = state.audioContext.createGain();
        osc.type = beatCount % 2 === 0 ? 'sine' : 'triangle';
        osc.frequency.value = beatCount % 4 === 0 ? 80 : 120;
        gain.gain.setValueAtTime(0, state.audioContext.currentTime);
        gain.gain.linearRampToValueAtTime(0.3, state.audioContext.currentTime + 0.01);
        gain.gain.linearRampToValueAtTime(0, state.audioContext.currentTime + 0.2);
        osc.connect(gain); gain.connect(state.musicGain);
        osc.start(); osc.stop(state.audioContext.currentTime + 0.2);
        beatCount++;
        state.musicTimeout = setTimeout(playBeat, 500);
    };
    playBeat();
    return { stop: () => clearTimeout(state.musicTimeout) };
}

function toggleMusic() {
    if (!state.audioContext) initAudio();
    if (state.musicPlaying) {
        if (state.currentTrackObj) state.currentTrackObj.stop();
        state.musicPlaying = false;
        document.getElementById('musicPlayPause').textContent = '▶️';
        document.getElementById('musicPlayer').classList.add('hidden');
    } else {
        state.musicPlaying = true;
        state.currentTrackObj = state.musicTracks[state.currentTrack].generator();
        document.getElementById('musicPlayPause').textContent = '⏸️';
        document.getElementById('musicTitle').textContent = state.musicTracks[state.currentTrack].name;
        document.getElementById('musicPlayer').classList.remove('hidden');
    }
}

function nextTrack() {
    if (state.currentTrackObj) state.currentTrackObj.stop();
    state.currentTrack = (state.currentTrack + 1) % state.musicTracks.length;
    if (state.musicPlaying) {
        state.currentTrackObj = state.musicTracks[state.currentTrack].generator();
        document.getElementById('musicTitle').textContent = state.musicTracks[state.currentTrack].name;
    }
}

function prevTrack() {
    if (state.currentTrackObj) state.currentTrackObj.stop();
    state.currentTrack = (state.currentTrack - 1 + state.musicTracks.length) % state.musicTracks.length;
    if (state.musicPlaying) {
        state.currentTrackObj = state.musicTracks[state.currentTrack].generator();
        document.getElementById('musicTitle').textContent = state.musicTracks[state.currentTrack].name;
    }
}

function updateMusicVolume() {
    const vol = document.getElementById('musicVolume').value / 100;
    if (state.musicGain) state.musicGain.gain.value = vol;
}

// ===== LANGUAGE =====
function openLangPanel() {
    document.getElementById('langPanel').classList.remove('hidden');
}

function setLanguage(lang) {
    state.currentLang = lang;
    localStorage.setItem('lang', lang);
    const translations = TRANSLATIONS[lang];
    if (!translations) return;
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.dataset.i18n;
        if (translations[key]) el.textContent = translations[key];
    });
    document.querySelectorAll('.lang-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.lang === lang);
    });
    document.documentElement.lang = lang;
}

// ===== THEME =====
function toggleTheme() {
    document.body.classList.toggle('dark-mode');
    document.body.classList.toggle('light-mode');
}

// ===== ANIMATION =====
function animate() {
    requestAnimationFrame(animate);
    if (state.character) {
        const time = Date.now() * 0.001;
        state.character.position.y = Math.sin(time * 2) * 0.05;
    }
    if (state.renderer && state.scene && state.camera) {
        state.renderer.render(state.scene, state.camera);
    }
}

// ===== EVENT LISTENERS =====
function setupEventListeners() {
    document.getElementById('startBtn').addEventListener('click', () => {
        initThreeJS();
        setupCameraControls();
        setLanguage(state.currentLang);
        startCamera();
    });
    
    // Top toolbar
    document.getElementById('themeToggle').addEventListener('click', toggleTheme);
    document.getElementById('timeOfDayBtn').addEventListener('click', openTimePanel);
    document.getElementById('weatherBtn').addEventListener('click', openWeatherPanel);
    document.getElementById('musicBtn').addEventListener('click', toggleMusic);
    document.getElementById('langBtn').addEventListener('click', openLangPanel);
    
    // Side toolbar
    document.getElementById('measureBtn').addEventListener('click', toggleMeasureMode);
    document.getElementById('recordBtn').addEventListener('click', toggleRecording);
    document.getElementById('floorPlanBtn').addEventListener('click', generateFloorPlan);
    document.getElementById('materialBtn').addEventListener('click', openMaterialPanel);
    document.getElementById('screenshotBtn').addEventListener('click', takeScreenshot);
    document.getElementById('exportBtn').addEventListener('click', openExportPanel);
    document.getElementById('gpsBtn').addEventListener('click', openGPSPanel);
    document.getElementById('detailBtn').addEventListener('click', openDetailPanel);
    document.getElementById('lightingBtn').addEventListener('click', openLightingPanel);
    document.getElementById('lowLightBtn').addEventListener('click', openLowLightPanel);
    document.getElementById('pdfBtn').addEventListener('click', openPDFPanel);
    document.getElementById('projectBtn').addEventListener('click', openProjectPanel);
    document.getElementById('achievementBtn').addEventListener('click', openAchievementPanel);
    document.getElementById('furnitureBtn').addEventListener('click', openFurniturePanel);
    document.getElementById('repairBtn').addEventListener('click', openRepairPanel);
    document.getElementById('videoTourBtn').addEventListener('click', openVideoPanel);
    document.getElementById('emailBtn').addEventListener('click', openEmailPanel);
    document.getElementById('gameBtn').addEventListener('click', openGamePanel);
    document.getElementById('characterBtn').addEventListener('click', openCharacterPanel);
    
    document.getElementById('completeBtn').addEventListener('click', () => {
        if (confirm('Complete scanning?')) {
            state.frameCount = 50;
            completeScanning();
            checkAchievements();
        }
    });
    
    // Measure
    document.getElementById('clearMeasure').addEventListener('click', clearMeasurement);
    
    // Floor plan
    document.getElementById('downloadFloorPlan').addEventListener('click', downloadFloorPlan);
    
    // Export
    document.querySelectorAll('.export-btn').forEach(btn => {
        btn.addEventListener('click', () => exportModel(btn.dataset.format));
    });
    
    // Time
    document.querySelectorAll('.time-btn').forEach(btn => {
        btn.addEventListener('click', () => setTimeOfDay(btn.dataset.time));
    });
    
    // GPS
    document.getElementById('refreshGps').addEventListener('click', getGPSLocation);
    document.getElementById('saveGpsTag').addEventListener('click', saveGPSToProject);
    
    // Detail
    document.getElementById('zoomSlider').addEventListener('input', (e) => setZoom(parseFloat(e.target.value)));
    document.querySelectorAll('.detail-btn').forEach(btn => {
        btn.addEventListener('click', () => setZoom(parseFloat(btn.dataset.zoom)));
    });
    document.getElementById('captureDetail').addEventListener('click', captureDetail);
    
    // Lighting
    document.querySelectorAll('.light-preset').forEach(btn => {
        btn.addEventListener('click', () => applyLightingPreset(btn.dataset.preset));
    });
    ['ambientIntensity', 'dirIntensity', 'lightAngle', 'lightColor'].forEach(id => {
        document.getElementById(id).addEventListener('input', updateLightingFromSliders);
    });
    
    // Low Light
    document.getElementById('lowLightToggle').addEventListener('change', toggleLowLight);
    ['brightnessSlider', 'contrastSlider'].forEach(id => {
        document.getElementById(id).addEventListener('input', updateLowLightSettings);
    });
    document.querySelectorAll('.enhance-preset').forEach(btn => {
        btn.addEventListener('click', () => applyEnhancePreset(btn.dataset.preset));
    });
    
    // Weather
    document.querySelectorAll('.weather-btn').forEach(btn => {
        btn.addEventListener('click', () => setWeather(btn.dataset.weather));
    });
    document.getElementById('weatherIntensity').addEventListener('input', updateWeatherIntensity);
    
    // PDF
    document.getElementById('generatePdf').addEventListener('click', generatePDF);
    
    // Projects
    document.getElementById('saveProject').addEventListener('click', saveProject);
    
    // Furniture
    document.querySelectorAll('.cat-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.cat-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            renderFurnitureGrid(btn.dataset.cat);
        });
    });
    document.getElementById('addFurnitureBtn').addEventListener('click', addFurnitureToScene);
    
    // Repair
    document.querySelectorAll('.repair-btn').forEach(btn => {
        btn.addEventListener('click', () => performRepair(btn.dataset.action));
    });
    
    // Video tour
    document.getElementById('startTourBtn').addEventListener('click', startVideoTour);
    
    // Email
    document.getElementById('sendEmailBtn').addEventListener('click', sendEmail);
    
    // Game
    document.getElementById('startGameBtn').addEventListener('click', startGame);
    document.getElementById('resetGameBtn').addEventListener('click', resetGame);
    document.getElementById('exitGameBtn').addEventListener('click', () => {
        if (state.isGameMode) endGame();
    });
    
    // Character
    document.getElementById('applyCharBtn').addEventListener('click', applyCharacterColors);
    document.querySelectorAll('.char-preset').forEach(btn => {
        btn.addEventListener('click', () => applyCharacterPreset(btn.dataset.preset));
    });
    
    // Language
    document.querySelectorAll('.lang-btn').forEach(btn => {
        btn.addEventListener('click', () => setLanguage(btn.dataset.lang));
    });
    
    // Music
    document.getElementById('musicPlayPause').addEventListener('click', toggleMusic);
    document.getElementById('musicNext').addEventListener('click', nextTrack);
    document.getElementById('musicPrev').addEventListener('click', prevTrack);
    document.getElementById('musicVolume').addEventListener('input', updateMusicVolume);
    
    // Close buttons
    document.querySelectorAll('.close-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.getElementById(btn.dataset.close).classList.add('hidden');
        });
    });
    
    // Resize
    window.addEventListener('resize', () => {
        if (state.camera && state.renderer) {
            state.camera.aspect = window.innerWidth / window.innerHeight;
            state.camera.updateProjectionMatrix();
            state.renderer.setSize(window.innerWidth, window.innerHeight);
        }
    });
    
    // Cleanup
    window.addEventListener('beforeunload', () => {
        if (state.videoStream) state.videoStream.getTracks().forEach(t => t.stop());
        if (state.audioContext) state.audioContext.close();
        if (state.isRecording) stopRecording();
    });
}

// ===== INITIALIZE =====
window.addEventListener('load', async () => {
    loadAchievements();
    try { await initDB(); } catch (err) { console.error('DB error:', err); }
    setupEventListeners();
    setLanguage(state.currentLang);
});

// ReflectiveDisplayEngine Simulation
class ReflectiveDisplayEngine {
    constructor() {
        this.screenBacklight = 0;
        this.frontLight = 'DISABLED';
        this.autoBrightness = 'OFF';
        this.colorTemperature = 'NEUTRAL';
        this.ambientLux = 500;
        this.contrastMode = 'STANDARD';
        this.refreshStrategy = 'QUALITY';
        this.refreshRate = 15;
        
        this.init();
    }
    
    init() {
        console.log('ReflectiveDisplayEngine initialized');
        console.log('Screen backlight:', this.screenBacklight + '%');
        console.log('Front light:', this.frontLight);
        console.log('Auto brightness:', this.autoBrightness);
        console.log('Color temperature:', this.colorTemperature);
        
        this.setupEventListeners();
        this.updateDisplay();
    }
    
    setupEventListeners() {
        // Ambient light slider
        const ambientLightSlider = document.getElementById('ambientLightSlider');
        const ambientLightValue = document.getElementById('ambientLightSliderValue');
        const ambientLuxValue = document.getElementById('ambientLuxValue');
        
        if (ambientLightSlider) {
            ambientLightSlider.addEventListener('input', (e) => {
                this.ambientLux = parseInt(e.target.value);
                if (ambientLightValue) ambientLightValue.textContent = this.ambientLux + ' lx';
                if (ambientLuxValue) ambientLuxValue.textContent = this.ambientLux + ' lx';
                
                // Update contrast based on ambient light
                this.updateContrastMode();
                this.updateDisplay();
                
                // Trigger refresh animation
                this.simulateRefresh();
            });
        }
        
        // Fiber density slider
        const fiberDensitySlider = document.getElementById('fiberDensitySlider');
        const fiberDensityValue = document.getElementById('fiberDensitySliderValue');
        const fiberDensityText = document.getElementById('fiberDensityValue');
        
        if (fiberDensitySlider) {
            fiberDensitySlider.addEventListener('input', (e) => {
                const value = parseInt(e.target.value);
                if (fiberDensityValue) fiberDensityValue.textContent = value;
                
                // Convert to text description
                if (value < 20) {
                    if (fiberDensityText) fiberDensityText.textContent = 'Low';
                } else if (value < 60) {
                    if (fiberDensityText) fiberDensityText.textContent = 'Medium';
                } else {
                    if (fiberDensityText) fiberDensityText.textContent = 'High';
                }
                
                // Update visual texture
                this.updatePaperTexture(value);
            });
        }
        
        // Ink bleed slider
        const inkBleedSlider = document.getElementById('inkBleedSlider');
        const inkBleedValue = document.getElementById('inkBleedSliderValue');
        const inkBleedText = document.getElementById('inkBleedValue');
        
        if (inkBleedSlider) {
            inkBleedSlider.addEventListener('input', (e) => {
                const value = parseInt(e.target.value);
                if (inkBleedValue) inkBleedValue.textContent = value;
                
                // Convert to text description
                if (value < 10) {
                    if (inkBleedText) inkBleedText.textContent = 'Minimal';
                } else if (value < 30) {
                    if (inkBleedText) inkBleedText.textContent = 'Light';
                } else if (value < 60) {
                    if (inkBleedText) inkBleedText.textContent = 'Moderate';
                } else {
                    if (inkBleedText) inkBleedText.textContent = 'Heavy';
                }
            });
        }
        
        // Contrast mode buttons
        const contrastButtons = document.querySelectorAll('.mode-btn[data-mode]');
        contrastButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                // Remove active class from all buttons
                contrastButtons.forEach(b => b.classList.remove('active'));
                // Add active class to clicked button
                btn.classList.add('active');
                
                this.contrastMode = btn.getAttribute('data-mode').toUpperCase();
                this.updateDisplay();
                this.simulateRefresh();
            });
        });
        
        // Refresh strategy buttons
        const strategyButtons = document.querySelectorAll('.mode-btn[data-strategy]');
        strategyButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                // Remove active class from all buttons
                strategyButtons.forEach(b => b.classList.remove('active'));
                // Add active class to clicked button
                btn.classList.add('active');
                
                this.refreshStrategy = btn.getAttribute('data-strategy').toUpperCase();
                this.updateRefreshTimes();
                this.simulateRefresh();
            });
        });
    }
    
    updateContrastMode() {
        // Determine contrast mode based on ambient lux
        if (this.ambientLux >= 0 && this.ambientLux <= 100) {
            this.contrastMode = 'MAXIMUM';
        } else if (this.ambientLux > 100 && this.ambientLux <= 1000) {
            this.contrastMode = 'STANDARD';
        } else {
            this.contrastMode = 'SUBDUED';
        }
        
        // Update UI to reflect auto-selected contrast mode
        const contrastButtons = document.querySelectorAll('.mode-btn[data-mode]');
        contrastButtons.forEach(btn => {
            if (btn.getAttribute('data-mode') === this.contrastMode.toLowerCase()) {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
        });
    }
    
    updateDisplay() {
        // Update CSS variables based on current settings
        const root = document.documentElement;
        
        // Update ambient lux
        root.style.setProperty('--ambient-lux', this.ambientLux);
        
        // Update contrast based on mode
        let contrastColor;
        switch(this.contrastMode) {
            case 'MAXIMUM':
                contrastColor = 'var(--contrast-max)';
                break;
            case 'SUBDUED':
                contrastColor = 'var(--contrast-subdued)';
                break;
            case 'STANDARD':
            default:
                contrastColor = 'var(--contrast-standard)';
        }
        
        // Apply contrast to text
        const contrastElements = document.querySelectorAll('h1, h2, .spec-label, .control-label');
        contrastElements.forEach(el => {
            el.style.color = contrastColor;
        });
        
        // Update backlight status
        const backlightStatus = document.getElementById('backlightStatus');
        if (backlightStatus) {
            backlightStatus.textContent = this.frontLight;
        }
        
        // Update refresh rate based on strategy
        switch(this.refreshStrategy) {
            case 'SPEED':
                this.refreshRate = 30;
                break;
            case 'BALANCED':
                this.refreshRate = 20;
                break;
            case 'QUALITY':
            default:
                this.refreshRate = 15;
        }
        
        const refreshRateValue = document.getElementById('refreshRateValue');
        if (refreshRateValue) {
            refreshRateValue.textContent = this.refreshRate;
        }
        
        root.style.setProperty('--refresh-rate', this.refreshRate);
    }
    
    updatePaperTexture(density) {
        // Adjust paper texture based on fiber density
        const root = document.documentElement;
        const intensity = density / 100 * 0.15;
        
        root.style.setProperty('--paper-texture', 
            `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise' x='0' y='0' width='100%25' height='100%25'%3E%3CfeTurbulence baseFrequency='${0.5 + intensity}' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100' height='100' filter='url(%23noise)' opacity='${0.05 + intensity}'/%3E%3C/svg%3E")`);
    }
    
    updateRefreshTimes() {
        // Update refresh times based on strategy
        const fullRefreshElement = document.getElementById('fullRefreshTime');
        const partialRefreshElement = document.getElementById('partialRefreshTime');
        
        if (fullRefreshElement && partialRefreshElement) {
            switch(this.refreshStrategy) {
                case 'SPEED':
                    fullRefreshElement.textContent = '8';
                    partialRefreshElement.textContent = '2';
                    break;
                case 'BALANCED':
                    fullRefreshElement.textContent = '12';
                    partialRefreshElement.textContent = '5';
                    break;
                case 'QUALITY':
                default:
                    fullRefreshElement.textContent = '15';
                    partialRefreshElement.textContent = '8';
            }
        }
    }
    
    simulateRefresh() {
        // Add refresh animation to content
        const content = document.querySelector('.eink-display');
        if (content) {
            content.classList.add('refreshing');
            
            // Remove class after animation completes
            setTimeout(() => {
                content.classList.remove('refreshing');
            }, 300);
        }
    }
    
    disableLightEmission() {
        this.screenBacklight = 0;
        this.frontLight = 'DISABLED';
        this.autoBrightness = 'OFF';
        this.colorTemperature = 'NEUTRAL';
        
        console.log('Light emission disabled');
        console.log('Screen backlight:', this.screenBacklight + '%');
        console.log('Front light:', this.frontLight);
        
        return this;
    }
    
    configureReflectiveSettings() {
        this.updateContrastMode();
        
        const refreshStrategy = {
            pageTurn: 'FULL',
            scrolling: 'PARTIAL',
            idle: 'NONE'
        };
        
        console.log('Reflective settings configured');
        console.log('Contrast mode:', this.contrastMode);
        console.log('Refresh strategy:', refreshStrategy);
        
        return {
            contrastMode: this.contrastMode,
            refreshStrategy: refreshStrategy,
            ambientLux: this.ambientLux
        };
    }
}

// E-Ink display specifications
const supportedDisplays = [
    {
        type: "E-Ink Carta 1200",
        resolution: "300ppi",
        refreshRate: "15fps",
        grayLevels: 16,
        contrastRatio: "15:1"
    },
    {
        type: "E-Ink Kaleido Plus",
        resolution: "227ppi",
        colors: 4096,
        technology: "Print-Color Technology"
    }
];

// Initialize the display engine when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const displayEngine = new ReflectiveDisplayEngine();
    
    // Log supported displays on load
    console.log("Supported E-Ink Displays:", supportedDisplays);
    
    // Disable light emission on load
    displayEngine.disableLightEmission();
    
    // Configure reflective settings on load
    const reflectiveConfig = displayEngine.configureReflectiveSettings();
    console.log("Reflective Config:", reflectiveConfig);
    
    // Initial update of refresh times
    displayEngine.updateRefreshTimes();
    
    // Add subtle ambient light change on mouse movement
    document.addEventListener('mousemove', (e) => {
        // Simulate slight ambient light change based on cursor position
        const xPercent = e.clientX / window.innerWidth;
        const yPercent = e.clientY / window.innerHeight;
        
        // Small adjustment to ambient light (max 50 lux change)
        const lightAdjustment = Math.round((xPercent + yPercent) * 25);
        const baseLight = 500;
        const newLight = baseLight + lightAdjustment;
        
        // Update slider and value display
        const ambientSlider = document.getElementById('ambientLightSlider');
        const ambientValue = document.getElementById('ambientLightSliderValue');
        const ambientLux = document.getElementById('ambientLuxValue');
        
        if (ambientSlider && ambientValue && ambientLux) {
            ambientSlider.value = newLight;
            ambientValue.textContent = newLight + ' lx';
            ambientLux.textContent = newLight + ' lx';
            
            // Update engine
            displayEngine.ambientLux = newLight;
            displayEngine.updateContrastMode();
            displayEngine.updateDisplay();
        }
    });
    
    // Add keyboard shortcuts
    document.addEventListener('keydown', (e) => {
        // Ctrl + R to simulate refresh
        if (e.ctrlKey && e.key === 'r') {
            e.preventDefault();
            displayEngine.simulateRefresh();
        }
        
        // Ctrl + L to toggle light mode
        if (e.ctrlKey && e.key === 'l') {
            e.preventDefault();
            const backlightStatus = document.getElementById('backlightStatus');
            if (backlightStatus) {
                if (backlightStatus.textContent === 'DISABLED') {
                    backlightStatus.textContent = 'ENABLED';
                    displayEngine.frontLight = 'ENABLED';
                } else {
                    backlightStatus.textContent = 'DISABLED';
                    displayEngine.frontLight = 'DISABLED';
                }
                console.log('Front light toggled:', displayEngine.frontLight);
            }
        }
    });
});
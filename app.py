# server.py
from flask import Flask, render_template, jsonify
import json

app = Flask(__name__)

# E-Ink display specifications
SUPPORTED_DISPLAYS = [
    {
        "type": "E-Ink Carta 1200",
        "resolution": "300ppi",
        "refreshRate": "15fps",
        "grayLevels": 16,
        "contrastRatio": "15:1"
    },
    {
        "type": "E-Ink Kaleido Plus",
        "resolution": "227ppi",
        "colors": 4096,
        "technology": "Print-Color Technology"
    }
]

class ReflectiveDisplayEngine:
    def __init__(self):
        self.screen_backlight = 0
        self.front_light = "DISABLED"
        self.auto_brightness = "OFF"
        self.color_temperature = "NEUTRAL"
    
    def disable_light_emission(self):
        self.screen_backlight = 0
        self.front_light = "DISABLED"
        self.auto_brightness = "OFF"
        self.color_temperature = "NEUTRAL"
        return {
            "screenBacklight": f"{self.screen_backlight}%",
            "frontLight": self.front_light,
            "autoBrightness": self.auto_brightness,
            "colorTemperature": self.color_temperature
        }
    
    def configure_reflective_settings(self, ambient_lux):
        if ambient_lux <= 100:
            contrast_mode = "MAXIMUM"
        elif ambient_lux <= 1000:
            contrast_mode = "STANDARD"
        else:
            contrast_mode = "SUBDUED"
        
        refresh_strategy = {
            "pageTurn": "FULL",
            "scrolling": "PARTIAL",
            "idle": "NONE"
        }
        
        return {
            "contrastMode": contrast_mode,
            "refreshStrategy": refresh_strategy,
            "ambientLux": ambient_lux
        }

# Initialize the display engine
display_engine = ReflectiveDisplayEngine()

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/api/display-specs')
def get_display_specs():
    return jsonify(SUPPORTED_DISPLAYS)

@app.route('/api/disable-light')
def disable_light():
    result = display_engine.disable_light_emission()
    return jsonify({"status": "success", "config": result})

@app.route('/api/reflective-config/<int:ambient_lux>')
def get_reflective_config(ambient_lux):
    config = display_engine.configure_reflective_settings(ambient_lux)
    return jsonify(config)

if __name__ == '__main__':
    app.run(debug=True, port=5000)
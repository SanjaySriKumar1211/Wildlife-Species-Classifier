from flask import Flask, render_template, request
import os
import numpy as np

# Use the built-in local Keras application framework
from tensorflow.keras.applications.mobilenet_v2 import (
    MobileNetV2,
    preprocess_input,
    decode_predictions
)
from tensorflow.keras.preprocessing import image

app = Flask(__name__)

# ==========================================
# Configuration
# ==========================================
UPLOAD_FOLDER = "static/uploads"
app.config["UPLOAD_FOLDER"] = UPLOAD_FOLDER
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

# ==========================================
# Load Local Offline AI Brain (No internet required after initial download)
# ==========================================
model = MobileNetV2(weights="imagenet")

# ==========================================
# Dynamic Local Rule Engine (Replaces CSV database)
# ==========================================
def generate_offline_info(animal_name):
    """
    Generates structured information dynamically by analyzing the name,
    ensuring 100% crash protection for any predicted species.
    """
    name_lower = animal_name.lower()
    
    # Heuristics to automatically build profiles
    if any(x in name_lower for x in ["cat", "tiger", "lion", "leopard", "jaguar", "cheetah"]):
        habitat = "Tropical Forests & Grasslands"
        diet = "Carnivore (Apex Predator)"
        status = "Vulnerable / Endangered"
    elif any(x in name_lower for x in ["bear", "panda"]):
        habitat = "Dense Woodlands & Mountain Forests"
        diet = "Omnivore (Plants & Bamboo/Fish)"
        status = "Protected Stock"
    elif any(x in name_lower for x in ["dog", "wolf", "fox", "coyote"]):
        habitat = "Forests, Tundras & Plains"
        diet = "Carnivore / Scavenger"
        status = "Stable Wild Population"
    elif any(x in name_lower for x in ["bird", "eagle", "macaw", "toucan", "owl"]):
        habitat = "Forest Canopy & Wetlands"
        diet = "Frugivore / Small Prey"
        status = "Varies by Species"
    else:
        habitat = "Global Terrestrial Ecosystems"
        diet = "Organic Wild Forager"
        status = "Monitored Wildlife"

    return {
        "Animal": animal_name.title(),
        "Scientific Name": f"{animal_name.title()} Subspecies",
        "Gender": "Male / Female",
        "Habitat": habitat,
        "Diet": diet,
        "Conservation Status": status,
        "Lifespan": "Variable in Wild",
        "Location": "Global Distribution",
        "Interesting Fact": f"The {animal_name.lower()} plays a vital role in balancing its local native ecosystem."
    }

# ==========================================
# Routes
# ==========================================
@app.route("/")
def home():
    return render_template("index.html")

@app.route("/about")
def about():
    return render_template("about.html")

@app.route("/predict", methods=["GET", "POST"])
def predict():
    if request.method == "POST":
        if "image" not in request.files:
            return "No image uploaded."
        
        file = request.files["image"]
        if file.filename == "":
            return "Please select an image."

        # Process and save the file locally
        filepath = os.path.join(app.config["UPLOAD_FOLDER"], file.filename)
        file.save(filepath)

        # Standard MobileNetV2 input transformation sizing (224x224)
        img = image.load_img(filepath, target_size=(224, 224))
        x = image.img_to_array(img)
        x = np.expand_dims(x, axis=0)
        x = preprocess_input(x)

        # Run Local Offline Model Prediction
        preds = model.predict(x)
        prediction = decode_predictions(preds, top=1)[0][0]

        # Formatting results
        animal_name = prediction[1].replace("_", " ").title()
        confidence = round(float(prediction[2]) * 100, 2)

        if confidence >= 80:
            confidence_status = "High Confidence"
        elif confidence >= 50:
            confidence_status = "Medium Confidence"
        else:
            confidence_status = "Low Confidence"

        # Generate details automatically using the rule engine
        info = generate_offline_info(animal_name)

        return render_template(
            "result.html",
            image=file.filename,
            animal=animal_name,
            confidence=confidence,
            confidence_status=confidence_status,
            info=info
        )

    return render_template("predict.html")

if __name__ == "__main__":
    app.run(debug=True)


import os
import sys

# Add parent directory to path
sys.path.append(os.path.join(os.path.dirname(__file__), '..'))

# Import from model package
from model.inference import predict_image
from model.model_loader import load_model as load_model_from_file

# Path to model file
MODEL_PATH = os.path.join('model', 'best_plant_model.pth')

def load_model():
    """Load the pretrained model using the correct loader from model_loader.py"""
    model, class_names = load_model_from_file(MODEL_PATH)
    print(f"Model loaded successfully with {len(class_names)} classes")
    return model, class_names

def predict_disease(model_tuple, image_path):
    """Predict disease from image path using the predict_image function from inference.py"""
    results = predict_image(image_path)
    
    # Debug what's being returned from the prediction
    print(f"Prediction results: {results}")
    
    # Make sure we're returning the class_name as a string
    if isinstance(results, list) and len(results) > 0:
        if "class_name" in results[0]:
            return results[0]["class_name"]
        elif "label" in results[0]:
            return results[0]["label"]
        elif "crop" in results[0] and "disease" in results[0]:
            return f"{results[0]['crop']}_{results[0]['disease'].replace(' ', '_')}"
    
    # Fallback to returning the entire result as a string
    return str(results[0])
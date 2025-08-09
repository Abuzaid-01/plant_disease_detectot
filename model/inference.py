
import torch
import torchvision.transforms as transforms
from PIL import Image
import json
import os
from model.model_loader import PlantDiseaseClassifier, load_model

# Load config
config_path = os.path.join(os.path.dirname(__file__), 'config (1).json')
with open(config_path, 'r') as f:
    config = json.load(f)

# Load the model
model_path = os.path.join(os.path.dirname(__file__), os.path.basename(config['model_path']))
model, class_names = load_model(model_path)

# Define transformation
transform = transforms.Compose([
    transforms.Resize((224, 224)),
    transforms.ToTensor(),
    transforms.Normalize(mean=config['mean'], std=config['std'])
])

def predict_image(image_path, top_k=3):
    """
    Predict plant disease from image
    
    Args:
        image_path: Path to the input image
        top_k: Number of top predictions to return
        
    Returns:
        List of dictionaries containing predictions
    """
    # Open and preprocess the image
    image = Image.open(image_path).convert('RGB')
    image_tensor = transform(image).unsqueeze(0)
    
    # Make prediction
    with torch.no_grad():
        outputs = model(image_tensor)
        probabilities = torch.nn.functional.softmax(outputs, dim=1)[0]
    
    # Get top K predictions
    top_probs, top_indices = torch.topk(probabilities, top_k)
    
    # Create result list
    results = []
    for i in range(top_k):
        idx = top_indices[i].item()
        prob = top_probs[i].item()
        
        # Parse class name to get crop and disease
        class_parts = class_names[idx].split('_', 1)
        crop = class_parts[0]
        disease = class_parts[1].replace('_', ' ') if len(class_parts) > 1 else 'healthy'
        
        results.append({
            'crop': crop,
            'disease': disease,
            'class_name': class_names[idx],
            'confidence': prob,
            'confidence_pct': f"{prob * 100:.2f}%",
            'label': class_names[idx]  # Add this for backward compatibility
        })
    
    return results
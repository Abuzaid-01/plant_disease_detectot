
import torch
import torch.nn as nn
import torch.nn.functional as F
from torchvision import models

class PlantDiseaseClassifier(nn.Module):
    def __init__(self, num_classes, dropout_rate=0.3):
        super(PlantDiseaseClassifier, self).__init__()
        
        # Use EfficientNet as backbone for better performance
        self.backbone = models.efficientnet_b2(pretrained=True)
        
        # Get feature dimension
        num_features = self.backbone.classifier[1].in_features
        
        # Replace classifier with custom head
        self.backbone.classifier = nn.Identity()
        
        # Attention mechanism
        self.attention = nn.Sequential(
            nn.AdaptiveAvgPool2d(1),
            nn.Flatten(),
            nn.Linear(num_features, num_features // 4),
            nn.ReLU(),
            nn.Linear(num_features // 4, num_features),
            nn.Sigmoid()
        )
        
        # Custom classifier head with regularization
        self.classifier = nn.Sequential(
            nn.Dropout(dropout_rate),
            nn.Linear(num_features, 512),
            nn.BatchNorm1d(512),
            nn.ReLU(),
            nn.Dropout(dropout_rate * 0.5),
            nn.Linear(512, 256),
            nn.BatchNorm1d(256),
            nn.ReLU(),
            nn.Dropout(dropout_rate * 0.3),
            nn.Linear(256, num_classes)
        )
    
    def forward(self, x):
        # Extract features
        features = self.backbone.features(x)
        
        # Global average pooling
        pooled = F.adaptive_avg_pool2d(features, 1)
        pooled = torch.flatten(pooled, 1)
        
        # Apply attention
        attention_weights = self.attention(features)
        attended_features = pooled * attention_weights
        
        # Classification
        output = self.classifier(attended_features)
        
        return output

def load_model(model_path):
    """Load the trained plant disease classification model"""
    
    # Load the checkpoint
    checkpoint = torch.load(model_path, map_location=torch.device('cpu'))
    
    # Get class names from checkpoint
    class_names = checkpoint['class_names']
    num_classes = len(class_names)
    
    # Create model
    model = PlantDiseaseClassifier(num_classes=num_classes)
    
    # Load state dict - handle both DataParallel and regular models
    if list(checkpoint['model_state_dict'].keys())[0].startswith('module.'):
        # Handle DataParallel saved model
        from collections import OrderedDict
        new_state_dict = OrderedDict()
        for k, v in checkpoint['model_state_dict'].items():
            name = k[7:] # remove 'module.'
            new_state_dict[name] = v
        model.load_state_dict(new_state_dict)
    else:
        model.load_state_dict(checkpoint['model_state_dict'])
    
    model.eval()
    return model, class_names
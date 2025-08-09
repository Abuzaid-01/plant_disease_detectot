import os
from flask import Flask, request, render_template, url_for, jsonify, redirect
from werkzeug.utils import secure_filename
from utils.model_utils import load_model, predict_disease
from utils.gemini_utils import get_disease_info, ask_question_about_disease, translate_text, get_disease_info_hindi

app = Flask(__name__)
app.config['UPLOAD_FOLDER'] = 'static/uploads/'
app.config['MAX_CONTENT_LENGTH'] = 10 * 1024 * 1024  # 10MB max

# Allowed file extensions
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif'}

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

# Ensure the upload directory exists
os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)

# Load the model
model_tuple = load_model()

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/upload', methods=['POST'])
def upload_file():
    if 'file' not in request.files:
        return redirect(url_for('index'))
        
    file = request.files['file']
    if file.filename == '':
        return redirect(url_for('index'))
    
    if file and allowed_file(file.filename):
        filename = secure_filename(file.filename)
        file_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
        
        try:
            # Ensure uploads directory exists
            os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)
            
            # Save the file
            file.save(file_path)
            
            # Predict disease
            disease = predict_disease(model_tuple, file_path)
            
            # Print debug info
            print(f"Disease detected: {disease}")
            print(f"Type of disease: {type(disease)}")
            
            # Get elaboration from Gemini API
            disease_info = get_disease_info(disease)

            # Create URL for the uploaded image
            image_url = url_for('static', filename=f'uploads/{filename}')

            return render_template('result.html', 
                                disease=disease, 
                                disease_info=disease_info,
                                image_url=image_url)
        
        except Exception as e:
            print(f"Error processing file: {str(e)}")
            return f"Error processing file: {str(e)}"
    
    return redirect(url_for('index'))

@app.route('/get_disease_info', methods=['POST'])
def get_disease_info_route():
    data = request.json
    disease = data.get('disease')
    
    if not disease:
        return jsonify({'error': 'No disease provided'}), 400
    
    try:
        disease_info = get_disease_info(disease)
        return jsonify(disease_info)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/ask_question', methods=['POST'])
def ask_question():
    data = request.json
    question = data.get('question')
    disease = data.get('disease')
    
    if not question or not disease:
        return jsonify({'error': 'Question or disease missing'}), 400
    
    try:
        answer = ask_question_about_disease(question, disease)
        return jsonify({'answer': answer})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/translate_text', methods=['POST'])
def translate_text_route():
    data = request.json
    text = data.get('text')
    
    if not text:
        return jsonify({'error': 'No text provided'}), 400
    
    try:
        translated_text = translate_text(text)
        return jsonify({'translated_text': translated_text})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)
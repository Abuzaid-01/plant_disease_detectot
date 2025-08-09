# Plant Disease Assistant

This project is a web application designed to assist users in detecting plant diseases through image uploads. It utilizes a pre-trained machine learning model for disease detection and integrates with the Gemini API to provide detailed information about the detected diseases, including causes, precautions, and treatment options.

## Project Structure

```
plant-disease-assistant
├── app.py                     # Main entry point of the Flask application
├── model/
│   └── model_loader.py        # Logic for loading the pre-trained model
├── static/
│   ├── css/
│   │   └── style.css          # CSS styles for the web interface
│   ├── js/
│   │   └── main.js            # JavaScript for client-side functionality
│   └── uploads/               # Directory for temporarily storing uploaded images
├── templates/
│   ├── index.html             # Main HTML file for image upload
│   └── result.html            # HTML file for displaying results
├── utils/
│   ├── gemini_utils.py        # Utility functions for interacting with the Gemini API
│   └── model_utils.py         # Utility functions for model predictions
├── requirements.txt           # List of dependencies for the project
├── .env                       # Environment variables and configuration settings
└── README.md                  # Documentation for the project
```

## Setup Instructions

1. **Clone the Repository**
   ```bash
   git clone <repository-url>
   cd plant-disease-assistant
   ```

2. **Create a Virtual Environment**
   ```bash
   python -m venv venv
   ```

3. **Activate the Virtual Environment**
   - On Windows:
     ```bash
     venv\Scripts\activate
     ```
   - On macOS/Linux:
     ```bash
     source venv/bin/activate
     ```

4. **Install Dependencies**
   ```bash
   pip install -r requirements.txt
   ```

5. **Set Up Environment Variables**
   Create a `.env` file in the root directory and add your API keys and other configuration settings:
   ```
   GEMINI_API_KEY=your_api_key_here
   ```

6. **Run the Application**
   ```bash
   python app.py
   ```

7. **Access the Web Interface**
   Open your web browser and navigate to `http://127.0.0.1:5000` to access the application.

## Usage Guidelines

- Upload an image of a plant to detect any diseases.
- After processing, the application will display the results along with detailed information retrieved from the Gemini API.
- Follow the precautions and treatment options provided for the detected disease.

## Contributing

Contributions are welcome! Please feel free to submit a pull request or open an issue for any suggestions or improvements.

## License

This project is licensed under the MIT License. See the LICENSE file for more details.
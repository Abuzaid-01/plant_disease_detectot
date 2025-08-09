import os
import google.generativeai as genai
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

# Configure the Gemini API with your API key
genai.configure(api_key=os.getenv("GEMINI_API_KEY"))

def get_disease_info(disease_name):
    """Get detailed information about a plant disease using the Gemini API."""
    try:
        
        model = genai.GenerativeModel('gemini-1.5-flash')
        
        
        clean_disease_name = disease_name.replace('_', ' ').replace('(', '').replace(')', '')
        
        
        prompt = f"""
        Please provide a clear and concise summary of the plant disease: {clean_disease_name}

Format your response using HTML tags for proper web display:

<h3>Overview</h3>
<p>Short description of {clean_disease_name} (1-2 lines)</p>

<h3>Symptoms</h3>
<ul>
<li>Key visible signs farmers should look for</li>
<li>Additional symptoms</li>
<li>Other observable signs</li>
</ul>

<h3>Causes</h3>
<p>Main causes (e.g., fungi, bacteria, environmental triggers)</p>

<h3>Prevention</h3>
<ul>
<li>Simple, actionable preventive steps</li>
<li>Additional prevention methods</li>
</ul>

<h3>Treatment</h3>
<p>Quick summary of commonly used treatments or practices</p>

<h3>Crop Impact</h3>
<p>How this disease affects plant health or yield (1-2 lines)</p>

Keep the response focused, practical, and under 250 words.
        """
        
        # Generate response from Gemini
        response = model.generate_content(prompt)
        
        # Check if response was generated successfully
        if response and response.text:
            return {
                "name": clean_disease_name,
                "description": response.text
            }
        else:
            raise Exception("Empty response from Gemini API")
        
    except Exception as e:
        print(f"Error calling Gemini API: {e}")
        
        # Provide fallback information based on the disease name
        fallback_info = get_fallback_info(disease_name)
        
        return {
            "name": disease_name.replace('_', ' '),
            "description": fallback_info
        }

def get_fallback_info(disease_name):
    """Provide fallback information when Gemini API fails"""
    
    fallback_data = {
        "Corn_(maize)_Northern_Leaf_Blight": """
        <h3>Overview</h3>
        <p>Northern Leaf Blight is a common fungal disease affecting corn plants, caused by Exserohilum turcicum.</p>
        
        <h3>Symptoms</h3>
        <ul>
        <li>Long, elliptical lesions on leaves</li>
        <li>Gray-green to tan colored spots</li>
        <li>Lesions may have dark borders</li>
        <li>Can cause significant leaf damage</li>
        </ul>
        
        <h3>Causes</h3>
        <p>Fungal pathogen Exserohilum turcicum, favored by warm, humid conditions and spreads through wind and rain splash.</p>
        
        <h3>Prevention</h3>
        <ul>
        <li>Use resistant corn varieties</li>
        <li>Crop rotation with non-host crops</li>
        <li>Proper field sanitation</li>
        <li>Avoid overhead irrigation</li>
        </ul>
        
        <h3>Treatment</h3>
        <p>Fungicide applications when needed, remove infected plant debris, and improve air circulation.</p>
        
        <h3>Crop Impact</h3>
        <p>Can reduce yield by 10-50% in severe cases and affects grain quality and plant vigor.</p>
        """,
        
        "Apple_scab": """
        <h3>Overview</h3>
        <p>Apple Scab is a fungal disease caused by Venturia inaequalis, affecting apple trees worldwide.</p>
        
        <h3>Symptoms</h3>
        <ul>
        <li>Dark, scaly lesions on leaves and fruit</li>
        <li>Premature leaf drop</li>
        <li>Cracked and distorted fruit</li>
        </ul>
        
        <h3>Prevention & Treatment</h3>
        <ul>
        <li>Apply fungicides during growing season</li>
        <li>Rake and destroy fallen leaves</li>
        <li>Choose resistant apple varieties</li>
        </ul>
        """,
        
        "Black_rot": """
        <h3>Overview</h3>
        <p>Black Rot is a fungal disease affecting apples, caused by Botryosphaeria obtusa.</p>
        
        <h3>Symptoms</h3>
        <ul>
        <li>Brown to black lesions on fruit</li>
        <li>Concentric rings on infected areas</li>
        <li>Fruit becomes mummified</li>
        </ul>
        
        <h3>Prevention & Treatment</h3>
        <ul>
        <li>Prune infected branches</li>
        <li>Apply fungicides preventively</li>
        <li>Remove mummified fruit</li>
        </ul>
        """,
        
        "Cedar_apple_rust": """
        <h3>Overview</h3>
        <p>Cedar Apple Rust is a fungal disease that affects both apple and cedar trees, caused by Gymnosporangium juniperi-virginianae.</p>
        
        <h3>Symptoms</h3>
        <ul>
        <li>Orange spots on apple leaves</li>
        <li>Swollen areas on cedar branches</li>
        <li>Reduced fruit quality</li>
        </ul>
        
        <h3>Prevention & Treatment</h3>
        <ul>
        <li>Plant resistant varieties</li>
        <li>Remove cedar trees nearby</li>
        <li>Apply fungicides in spring</li>
        </ul>
        """,
        
        "healthy": """
        <h3>Great News!</h3>
        <p>Your plant appears to be healthy with no signs of disease detected.</p>
        
        <h3>Maintenance Tips</h3>
        <ul>
        <li>Continue regular watering and fertilization</li>
        <li>Monitor for any changes in appearance</li>
        <li>Maintain good air circulation</li>
        <li>Practice preventive care</li>
        </ul>
        
        <h3>Prevention</h3>
        <ul>
        <li>Regular inspection of plants</li>
        <li>Proper spacing between plants</li>
        <li>Avoid overhead watering</li>
        <li>Remove dead or diseased plant material</li>
        </ul>
        """
    }
    
    return fallback_data.get(disease_name, 
        "<p>This is a plant disease that requires proper identification and treatment. Please consult with agricultural experts for specific guidance.</p>")

def ask_question_about_disease(question, disease_name, language='en'):
    """Answer specific questions about a plant disease"""
    try:
        model = genai.GenerativeModel('gemini-1.5-flash')
        
        language_instruction = ""
        if language == 'hi':
            language_instruction = "Please respond in Hindi (Devanagari script)."
        
        prompt = f"""
        You are an expert plant pathologist. A user has detected {disease_name} in their plant and has asked:
        
        Question: {question}
        
        Please provide a helpful, accurate, and practical answer about {disease_name} in the context of their question.
        Keep your response clear, concise, and farmer-friendly.
        
        {language_instruction}
        """
        
        response = model.generate_content(prompt)
        
        if response and response.text:
            return response.text
        else:
            raise Exception("Empty response from Gemini API")
            
    except Exception as e:
        print(f"Error in ask_question_about_disease: {e}")
        if language == 'hi':
            return "क्षमा करें, इस समय जानकारी प्राप्त करने में समस्या हो रही है। कृपया बाद में पुनः प्रयास करें।"
        else:
            return "Sorry, I'm having trouble getting information right now. Please try again later."

def translate_text(text, target_language='hi'):
    """Translate text to target language"""
    try:
        model = genai.GenerativeModel('gemini-1.5-flash')
        
        if target_language == 'hi':
            prompt = f"Translate the following text to Hindi (Devanagari script). Maintain the formatting and structure:\n\n{text}"
        else:
            prompt = f"Translate the following text to English. Maintain the formatting and structure:\n\n{text}"
        
        response = model.generate_content(prompt)
        
        if response and response.text:
            return response.text
        else:
            return text  # Return original text if translation fails
            
    except Exception as e:
        print(f"Error in translate_text: {e}")
        return text  # Return original text if translation fails
    




def get_disease_info_hindi(disease_name):
    """Get detailed information about a plant disease in Hindi using the Gemini API."""
    try:
        
        model = genai.GenerativeModel('gemini-1.5-flash')
        
        # Clean up the disease name for better prompting
        clean_disease_name = disease_name.replace('_', ' ').replace('(', '').replace(')', '')
        
        prompt = f"""
        कृपया पौधों की बीमारी के बारे में विस्तृत जानकारी हिंदी में दें: {clean_disease_name}

अपना उत्तर HTML टैग का उपयोग करके प्रारूपित करें:

<h3>अवलोकन</h3>
<p>{clean_disease_name} का संक्षिप्त विवरण (1-2 लाइनें)</p>

<h3>लक्षण</h3>
<ul>
<li>मुख्य दिखाई देने वाले संकेत जिन पर किसानों को ध्यान देना चाहिए</li>
<li>अतिरिक्त लक्षण</li>
<li>अन्य दिखाई देने वाले संकेत</li>
</ul>

<h3>कारण</h3>
<p>मुख्य कारण (जैसे, कवक, बैक्टीरिया, पर्यावरणीय कारक)</p>

<h3>रोकथाम</h3>
<ul>
<li>सरल, कार्यान्वित करने योग्य रोकथाम के तरीके</li>
<li>अतिरिक्त रोकथाम विधियां</li>
</ul>

<h3>इलाज</h3>
<p>आमतौर पर उपयोग किए जाने वाले उपचार या प्रथाओं का संक्षिप्त सारांश</p>

<h3>फसल पर प्रभाव</h3>
<p>यह बीमारी पौधे के स्वास्थ्य या उपज को कैसे प्रभावित करती है (1-2 लाइनें)</p>

कृपया पूरा उत्तर हिंदी में दें और 250 शब्दों से कम रखें।
        """
        
       
        response = model.generate_content(prompt)
        
        
        if response and response.text:
            return {
                "name": clean_disease_name,
                "description": response.text
            }
        else:
            raise Exception("Empty response from Gemini API")
        
    except Exception as e:
        print(f"Error calling Gemini API for Hindi: {e}")
        
        # Provide fallback information in Hindi
        fallback_info = get_fallback_info_hindi(disease_name)
        
        return {
            "name": disease_name.replace('_', ' '),
            "description": fallback_info
        }

def get_fallback_info_hindi(disease_name):
    """Provide fallback information in Hindi when Gemini API fails"""
    
    fallback_data = {
        "Corn (maize) Northern Leaf Blight": """
        <h3>अवलोकन</h3>
        <p>उत्तरी पत्ती झुलसा मक्के के पौधों को प्रभावित करने वाली एक आम फंगल बीमारी है, जो Exserohilum turcicum के कारण होती है।</p>
        
        <h3>लक्षण</h3>
        <ul>
        <li>पत्तियों पर लंबे, भूरे-स्लेटी घाव जिनके बीच में तन रंग का केंद्र होता है</li>
        <li>घावों के चारों ओर पीले रंग का घेरा हो सकता है</li>
        <li>गंभीर संक्रमण में पत्तियों की मृत्यु हो सकती है</li>
        <li>पौधे की जीवन शक्ति में कमी</li>
        </ul>
        
        <h3>कारण</h3>
        <p>एक्सेरोहिलम टर्सिकम नामक कवक मुख्य कारण है। अधिक नमी और 20-30°C (68-86°F) तापमान में यह बीमारी अधिक फैलती है।</p>
        
        <h3>रोकथाम</h3>
        <ul>
        <li>प्रतिरोधी हाइब्रिड किस्मों का रोपण करें</li>
        <li>फसल चक्रण का उचित पालन करें</li>
        <li>खेत की उचित सफाई रखें</li>
        <li>अधिक घनत्व में बुआई से बचें</li>
        </ul>
        
        <h3>इलाज</h3>
        <p>प्रारंभिक संक्रमण के दौरान कवकनाशी का छिड़काव प्रभावी है। स्थानीय कृषि विशेषज्ञों से सलाह लेकर उचित समय पर उपचार करें।</p>
        
        <h3>फसल पर प्रभाव</h3>
        <p>यह बीमारी प्रकाश संश्लेषण की क्षमता को कम करती है, जिससे अनाज की उपज और गुणवत्ता में कमी आती है। गंभीर संक्रमण से महत्वपूर्ण नुकसान हो सकता है।</p>
        """,
        
        "Apple scab": """
        <h3>अवलोकन</h3>
        <p>सेब की खुजली एक फंगल बीमारी है जो वेंटुरिया इनइक्वलिस के कारण होती है।</p>
        
        <h3>लक्षण</h3>
        <ul>
        <li>पत्तियों और फलों पर काले, पपड़ीदार घाव</li>
        <li>समय से पहले पत्तियों का गिरना</li>
        <li>फलों में दरार और विकृति</li>
        </ul>
        
        <h3>रोकथाम और इलाज</h3>
        <ul>
        <li>बढ़ते मौसम में कवकनाशी का प्रयोग</li>
        <li>गिरी हुई पत्तियों को हटाकर नष्ट करें</li>
        <li>प्रतिरोधी सेब की किस्मों का चुनाव करें</li>
        </ul>
        """,
        
        "healthy": """
        <h3>बहुत अच्छी खबर!</h3>
        <p>आपका पौधा स्वस्थ दिखाई दे रहा है और कोई बीमारी के संकेत नहीं मिले हैं।</p>
        
        <h3>रखरखाव सुझाव</h3>
        <ul>
        <li>नियमित पानी और उर्वरक देना जारी रखें</li>
        <li>दिखावट में किसी भी बदलाव की निगरानी करें</li>
        <li>अच्छा हवा का प्रवाह बनाए रखें</li>
        <li>निवारक देखभाल का अभ्यास करें</li>
        </ul>
        
        <h3>रोकथाम</h3>
        <ul>
        <li>पौधों का नियमित निरीक्षण</li>
        <li>पौधों के बीच उचित दूरी</li>
        <li>ऊपर से पानी देने से बचें</li>
        <li>मृत या रोगग्रस्त पौधों के भाग हटाएं</li>
        </ul>
        """
    }
    
    return fallback_data.get(disease_name, 
        "<p>यह एक पौधे की बीमारी है जिसकी उचित पहचान और उपचार की आवश्यकता है। कृपया कृषि विशेषज्ञों से सलाह लें।</p>")
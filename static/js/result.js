// const translations = {
//     en: {
//         'title': 'Disease Detection Result',
//         'uploaded-image': 'Uploaded Image',
//         'detected-disease': 'Detected Disease:',
//         'ask-question': 'Ask a Question',
//         'qa-description': 'Have more questions about this disease? Ask our AI assistant!',
//         'question-placeholder': 'Type your question here...',
//         'ask-btn': 'Ask Question',
//         'translate-btn': 'Translate',
//         'answer': 'Answer:',
//         'thinking': 'AI is thinking...',
//         'upload-another': 'Upload Another Image',
//         'error-occurred': 'An error occurred. Please try again.',
//         'enter-question': 'Please enter a question.'
//     },
//     hi: {
//         'title': 'बीमारी का पता लगाने का परिणाम',
//         'uploaded-image': 'अपलोड की गई छवि',
//         'detected-disease': 'पहचानी गई बीमारी:',
//         'ask-question': 'सवाल पूछें',
//         'qa-description': 'इस बीमारी के बारे में और सवाल हैं? हमारे AI सहायक से पूछें!',
//         'question-placeholder': 'यहाँ अपना सवाल लिखें...',
//         'ask-btn': 'सवाल पूछें',
//         'translate-btn': 'अनुवाद करें',
//         'answer': 'उत्तर:',
//         'thinking': 'AI सोच रहा है...',
//         'upload-another': 'दूसरी छवि अपलोड करें',
//         'error-occurred': 'एक त्रुटि हुई। कृपया पुनः प्रयास करें।',
//         'enter-question': 'कृपया एक सवाल दर्ज करें।'
//     }
// };

// let currentLanguage = 'en';
// let currentAnswer = '';

// document.addEventListener('DOMContentLoaded', function() {
//     const themeToggle = document.getElementById('themeToggle');
//     const languageSelect = document.getElementById('languageSelect');
//     const questionInput = document.getElementById('questionInput');
//     const askButton = document.getElementById('askQuestion');
//     const translateButton = document.getElementById('translateAnswer');
//     const answerSection = document.getElementById('answerSection');
//     const answerContent = document.getElementById('answerContent');
//     const loadingIndicator = document.getElementById('loadingIndicator');
//     const diseaseDescription = document.getElementById('diseaseDescription');

//     // Load saved theme
//     const savedTheme = localStorage.getItem('theme') || 'light';
//     document.body.setAttribute('data-theme', savedTheme);
//     themeToggle.textContent = savedTheme === 'dark' ? '☀️' : '🌙';

//     // Load saved language
//     const savedLanguage = localStorage.getItem('language') || 'en';
//     currentLanguage = savedLanguage;
//     languageSelect.value = savedLanguage;
//     updateLanguage(savedLanguage);
    
//     // Load disease info in selected language
//     loadDiseaseInfo(savedLanguage);

//     // Theme toggle functionality
//     themeToggle.addEventListener('click', function() {
//         const currentTheme = document.body.getAttribute('data-theme');
//         const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        
//         document.body.setAttribute('data-theme', newTheme);
//         themeToggle.textContent = newTheme === 'dark' ? '☀️' : '🌙';
//         localStorage.setItem('theme', newTheme);
//     });

//     // Language change functionality
//     languageSelect.addEventListener('change', function() {
//         currentLanguage = this.value;
//         localStorage.setItem('language', currentLanguage);
//         updateLanguage(currentLanguage);
        
//         // Load disease info in new language
//         loadDiseaseInfo(currentLanguage);
        
//         // Clear previous answers
//         answerSection.style.display = 'none';
//         currentAnswer = '';
//     });

//     // Ask question functionality
//     askButton.addEventListener('click', function() {
//         const question = questionInput.value.trim();
//         if (!question) {
//             alert(translations[currentLanguage]['enter-question']);
//             return;
//         }

//         askQuestion(question);
//     });

//     function updateLanguage(lang) {
//         document.querySelectorAll('[data-translate]').forEach(element => {
//             const key = element.getAttribute('data-translate');
//             if (translations[lang][key]) {
//                 element.textContent = translations[lang][key];
//             }
//         });

//         document.querySelectorAll('[data-translate-placeholder]').forEach(element => {
//             const key = element.getAttribute('data-translate-placeholder');
//             if (translations[lang][key]) {
//                 element.placeholder = translations[lang][key];
//             }
//         });
//     }

//     async function loadDiseaseInfo(language) {
//         try {
//             const response = await fetch('/get_disease_info', {
//                 method: 'POST',
//                 headers: {
//                     'Content-Type': 'application/json',
//                 },
//                 body: JSON.stringify({
//                     disease: diseaseData.name,
//                     language: language
//                 })
//             });

//             const data = await response.json();
            
//             if (data.success) {
//                 diseaseDescription.innerHTML = data.disease_info.description;
//             }
//         } catch (error) {
//             console.error('Error loading disease info:', error);
//         }
//     }

//     async function askQuestion(question) {
//         loadingIndicator.style.display = 'flex';
//         answerSection.style.display = 'none';
//         askButton.disabled = true;

//         try {
//             const response = await fetch('/ask_question', {
//                 method: 'POST',
//                 headers: {
//                     'Content-Type': 'application/json',
//                 },
//                 body: JSON.stringify({
//                     question: question,
//                     disease: diseaseData.name,
//                     language: currentLanguage
//                 })
//             });

//             const data = await response.json();
            
//             if (data.success) {
//                 currentAnswer = data.answer;
//                 answerContent.innerHTML = data.answer;
//                 answerSection.style.display = 'block';
//             } else {
//                 throw new Error(data.error || 'Unknown error');
//             }
//         } catch (error) {
//             answerContent.innerHTML = `<p style="color: red;">${translations[currentLanguage]['error-occurred']}</p>`;
//             answerSection.style.display = 'block';
//         } finally {
//             loadingIndicator.style.display = 'none';
//             askButton.disabled = false;
//         }
//     }
// });


// async function loadDiseaseInfo(language) {
//     console.log('Loading disease info for language:', language);
//     console.log('Disease name:', diseaseData.name);
    
//     try {
//         const response = await fetch('/get_disease_info', {
//             method: 'POST',
//             headers: {
//                 'Content-Type': 'application/json',
//             },
//             body: JSON.stringify({
//                 disease: diseaseData.name,
//                 language: language
//             })
//         });

//         const data = await response.json();
//         console.log('Response data:', data);
        
//         if (data.success) {
//             diseaseDescription.innerHTML = data.disease_info.description;
//             console.log('Disease description updated successfully');
//         } else {
//             console.error('Error in response:', data.error);
//         }
//     } catch (error) {
//         console.error('Error loading disease info:', error);
//     }
// }
document.addEventListener('DOMContentLoaded', function() {
    // Theme toggle functionality
    const themeToggle = document.getElementById('themeToggle');
    const body = document.body;
    
    // Check if there's a saved theme preference
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        body.classList.add('dark-theme');
        themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
    }
    
    themeToggle.addEventListener('click', function() {
        body.classList.toggle('dark-theme');
        
        if (body.classList.contains('dark-theme')) {
            localStorage.setItem('theme', 'dark');
            themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
        } else {
            localStorage.setItem('theme', 'light');
            themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
        }
    });
    
    // Ask question functionality
    const questionInput = document.getElementById('questionInput');
    const askQuestionBtn = document.getElementById('askQuestion');
    const translateBtn = document.getElementById('translateAnswer');
    const answerSection = document.getElementById('answerSection');
    const answerContent = document.getElementById('answerContent');
    const loadingIndicator = document.getElementById('loadingIndicator');
    
    if (askQuestionBtn) {
        askQuestionBtn.addEventListener('click', function() {
            const question = questionInput.value.trim();
            if (!question) return;
            
            // Show loading indicator
            loadingIndicator.style.display = 'flex';
            answerSection.style.display = 'none';
            
            // Prepare data for the request
            const data = {
                question: question,
                disease: diseaseData.name
            };
            
            // Send request to backend
            fetch('/ask_question', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            })
            .then(response => response.json())
            .then(data => {
                // Hide loading indicator
                loadingIndicator.style.display = 'none';
                
                // Show answer section
                answerSection.style.display = 'block';
                
                // Populate answer content
                answerContent.innerHTML = data.answer;
                
                // Show translate button
                translateBtn.style.display = 'block';
            })
            .catch(error => {
                console.error('Error:', error);
                loadingIndicator.style.display = 'none';
                answerSection.style.display = 'block';
                answerContent.innerHTML = '<p class="error">Sorry, an error occurred while processing your question. Please try again.</p>';
            });
        });
    }
    
    // Translate answer functionality
    if (translateBtn) {
        translateBtn.addEventListener('click', function() {
            const answer = answerContent.innerHTML;
            
            // Show loading indicator
            loadingIndicator.style.display = 'flex';
            
            // Prepare data for translation request
            const data = {
                text: answer
            };
            
            // Send translation request
            fetch('/translate_text', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            })
            .then(response => response.json())
            .then(data => {
                // Hide loading indicator
                loadingIndicator.style.display = 'none';
                
                // Update answer content with translated text
                answerContent.innerHTML = data.translated_text;
                
                // Hide translate button after translation
                translateBtn.style.display = 'none';
            })
            .catch(error => {
                console.error('Error:', error);
                loadingIndicator.style.display = 'none';
                alert('Translation failed. Please try again.');
            });
        });
    }
    
    // Add the missing CSS class for drag-and-drop highlight
    const styleSheet = document.styleSheets[0];
    let highlightRuleExists = false;
    
    for (let i = 0; i < styleSheet.cssRules.length; i++) {
        if (styleSheet.cssRules[i].selectorText === '.upload-container.highlight') {
            highlightRuleExists = true;
            break;
        }
    }
    
    if (!highlightRuleExists) {
        styleSheet.insertRule('.upload-container.highlight { border-color: var(--primary-color); background-color: rgba(46, 125, 50, 0.1); }', styleSheet.cssRules.length);
    }
    
    // Add beautiful animation to disease name
    const diseaseBadge = document.querySelector('.disease-badge');
    if (diseaseBadge) {
        diseaseBadge.style.transition = 'all 0.3s ease';
        setTimeout(() => {
            diseaseBadge.style.transform = 'scale(1.1)';
            setTimeout(() => {
                diseaseBadge.style.transform = 'scale(1)';
            }, 300);
        }, 500);
    }
});
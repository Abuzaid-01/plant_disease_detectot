// // Language translations
// const translations = {
//     en: {
//         'main-title': '🌱 Plant Disease Detection Assistant',
//         'subtitle': 'Upload an image of your plant to detect diseases and get treatment recommendations',
//         'select-image': '📷 Select Plant Image:',
//         'analyze-btn': '🔍 Analyze Disease',
//         'analyzing': '🔄 Analyzing...',
//         'invalid-file': 'Please select a valid image file (JPEG, PNG, or GIF)',
//         'file-size-error': 'File size must be less than 10MB',
//         'select-file': 'Please select an image file'
//     },
//     hi: {
//         'main-title': '🌱 पौधों की बीमारी का पता लगाने वाला सहायक',
//         'subtitle': 'बीमारियों का पता लगाने और उपचार की सिफारिशें प्राप्त करने के लिए अपने पौधे की छवि अपलोड करें',
//         'select-image': '📷 पौधे की छवि चुनें:',
//         'analyze-btn': '🔍 बीमारी का विश्लेषण करें',
//         'analyzing': '🔄 विश्लेषण कर रहे हैं...',
//         'invalid-file': 'कृपया एक मान्य छवि फ़ाइल चुनें (JPEG, PNG, या GIF)',
//         'file-size-error': 'फ़ाइल का आकार 10MB से कम होना चाहिए',
//         'select-file': 'कृपया एक छवि फ़ाइल चुनें'
//     }
// };

// let currentLanguage = 'en';

// document.addEventListener('DOMContentLoaded', function() {
//     const fileInput = document.getElementById('file');
//     const form = document.getElementById('uploadForm');
//     const submitButton = document.getElementById('submitBtn');
//     const imagePreview = document.getElementById('imagePreview');
//     const preview = document.getElementById('preview');
//     const themeToggle = document.getElementById('themeToggle');
//     const languageSelect = document.getElementById('languageSelect');

//     // Load saved theme with smooth transition
//     const savedTheme = localStorage.getItem('theme') || 'light';
//     document.body.setAttribute('data-theme', savedTheme);
//     themeToggle.textContent = savedTheme === 'dark' ? '☀️' : '🌙';

//     // Load saved language
//     const savedLanguage = localStorage.getItem('language') || 'en';
//     currentLanguage = savedLanguage;
//     languageSelect.value = savedLanguage;
//     updateLanguage(savedLanguage);

//     // Theme toggle functionality with smooth animation
//     themeToggle.addEventListener('click', function() {
//         const currentTheme = document.body.getAttribute('data-theme');
//         const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        
//         // Add transition class
//         document.body.style.transition = 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
        
//         document.body.setAttribute('data-theme', newTheme);
//         themeToggle.textContent = newTheme === 'dark' ? '☀️' : '🌙';
//         localStorage.setItem('theme', newTheme);
        
//         // Remove transition class after animation
//         setTimeout(() => {
//             document.body.style.transition = '';
//         }, 300);
//     });

//     // Language change functionality
//     languageSelect.addEventListener('change', function() {
//         currentLanguage = this.value;
//         localStorage.setItem('language', currentLanguage);
//         updateLanguage(currentLanguage);
        
//         // Add visual feedback
//         this.style.transform = 'scale(0.95)';
//         setTimeout(() => {
//             this.style.transform = '';
//         }, 150);
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

//     // Enhanced file input change event
//     fileInput.addEventListener('change', function(e) {
//         const file = e.target.files[0];
//         const uploadSection = this.closest('.upload-section');
        
//         if (file) {
//             // Validate file type
//             const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
//             if (!validTypes.includes(file.type)) {
//                 showNotification(translations[currentLanguage]['invalid-file'], 'error');
//                 this.value = '';
//                 imagePreview.style.display = 'none';
//                 return;
//             }

//             // Validate file size (max 10MB)
//             if (file.size > 10 * 1024 * 1024) {
//                 showNotification(translations[currentLanguage]['file-size-error'], 'error');
//                 this.value = '';
//                 imagePreview.style.display = 'none';
//                 return;
//             }

//             // Show loading state for preview
//             imagePreview.style.display = 'block';
//             preview.style.opacity = '0.5';
            
//             // Show image preview with smooth animation
//             const reader = new FileReader();
//             reader.onload = function(e) {
//                 preview.src = e.target.result;
//                 preview.onload = function() {
//                     preview.style.opacity = '1';
//                     preview.style.transform = 'scale(1)';
//                     showNotification('Image loaded successfully! ✅', 'success');
//                 };
//             };
//             reader.readAsDataURL(file);
            
//             // Add success styling to upload section
//             uploadSection.style.borderColor = 'var(--success-color)';
//             setTimeout(() => {
//                 uploadSection.style.borderColor = '';
//             }, 2000);
            
//         } else {
//             imagePreview.style.display = 'none';
//         }
//     });

//     // Enhanced form submit event
//     form.addEventListener('submit', function(e) {
//         const file = fileInput.files[0];
//         if (!file) {
//             e.preventDefault();
//             showNotification(translations[currentLanguage]['select-file'], 'error');
//             return;
//         }

//         // Enhanced loading state
//         submitButton.innerHTML = `
//             <span class="spinner" style="width: 16px; height: 16px; margin-right: 8px;"></span>
//             ${translations[currentLanguage]['analyzing']}
//         `;
//         submitButton.disabled = true;
//         submitButton.style.opacity = '0.8';
        
//         // Add progress effect
//         const uploadSection = this.closest('.upload-section');
//         uploadSection.style.background = 'linear-gradient(45deg, var(--card-bg) 0%, var(--card-bg-secondary) 100%)';
//     });

//     // Notification system
//     function showNotification(message, type = 'info') {
//         // Remove existing notifications
//         const existingNotifications = document.querySelectorAll('.notification');
//         existingNotifications.forEach(notification => notification.remove());
        
//         const notification = document.createElement('div');
//         notification.className = `notification notification-${type}`;
//         notification.style.cssText = `
//             position: fixed;
//             top: 100px;
//             right: 20px;
//             background: ${type === 'error' ? 'var(--error-color)' : type === 'success' ? 'var(--success-color)' : 'var(--primary-color)'};
//             color: white;
//             padding: 1rem 1.5rem;
//             border-radius: 0.75rem;
//             box-shadow: var(--shadow-lg);
//             z-index: 1001;
//             transform: translateX(400px);
//             transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
//             font-weight: 500;
//             max-width: 300px;
//             word-wrap: break-word;
//         `;
//         notification.textContent = message;
        
//         document.body.appendChild(notification);
        
//         // Animate in
//         setTimeout(() => {
//             notification.style.transform = 'translateX(0)';
//         }, 100);
        
//         // Remove after 4 seconds
//         setTimeout(() => {
//             notification.style.transform = 'translateX(400px)';
//             setTimeout(() => notification.remove(), 300);
//         }, 4000);
//     }
    
//     // Add drag and drop functionality with visual feedback
//     const uploadSection = document.querySelector('.upload-section');
    
//     ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
//         uploadSection.addEventListener(eventName, preventDefaults, false);
//         document.body.addEventListener(eventName, preventDefaults, false);
//     });

//     function preventDefaults(e) {
//         e.preventDefault();
//         e.stopPropagation();
//     }

//     ['dragenter', 'dragover'].forEach(eventName => {
//         uploadSection.addEventListener(eventName, highlight, false);
//     });

//     ['dragleave', 'drop'].forEach(eventName => {
//         uploadSection.addEventListener(eventName, unhighlight, false);
//     });

//     function highlight(e) {
//         uploadSection.style.borderColor = 'var(--primary-color)';
//         uploadSection.style.background = 'var(--card-bg-secondary)';
//         uploadSection.style.transform = 'scale(1.02)';
//     }

//     function unhighlight(e) {
//         uploadSection.style.borderColor = '';
//         uploadSection.style.background = '';
//         uploadSection.style.transform = '';
//     }

//     uploadSection.addEventListener('drop', handleDrop, false);

//     function handleDrop(e) {
//         const dt = e.dataTransfer;
//         const files = dt.files;
        
//         if (files.length > 0) {
//             fileInput.files = files;
//             fileInput.dispatchEvent(new Event('change'));
//             showNotification('File dropped successfully! 📁', 'success');
//         }
//     }
// });


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
    
    // File upload functionality
    const fileInput = document.getElementById('fileInput');
    const browseBtn = document.getElementById('browseBtn');
    const changeBtn = document.getElementById('changeBtn');
    const dropArea = document.getElementById('dropArea');
    const previewContainer = document.getElementById('previewContainer');
    const imagePreview = document.getElementById('imagePreview');
    const uploadForm = document.getElementById('uploadForm');
    
    // Open file dialog when browse button is clicked
    if (browseBtn) {
        browseBtn.addEventListener('click', function() {
            fileInput.click();
        });
    }
    
    // File input change handler
    if (fileInput) {
        fileInput.addEventListener('change', function() {
            if (this.files && this.files[0]) {
                displayPreview(this.files[0]);
            }
        });
    }
    
    // Change image button
    if (changeBtn) {
        changeBtn.addEventListener('click', function() {
            fileInput.click();
        });
    }
    
    // Drag and drop functionality
    if (dropArea) {
        ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
            dropArea.addEventListener(eventName, preventDefaults, false);
        });
        
        function preventDefaults(e) {
            e.preventDefault();
            e.stopPropagation();
        }
        
        ['dragenter', 'dragover'].forEach(eventName => {
            dropArea.addEventListener(eventName, highlight, false);
        });
        
        ['dragleave', 'drop'].forEach(eventName => {
            dropArea.addEventListener(eventName, unhighlight, false);
        });
        
        function highlight() {
            dropArea.classList.add('highlight');
        }
        
        function unhighlight() {
            dropArea.classList.remove('highlight');
        }
        
        dropArea.addEventListener('drop', handleDrop, false);
        
        function handleDrop(e) {
            const dt = e.dataTransfer;
            const files = dt.files;
            
            if (files && files[0]) {
                fileInput.files = files;
                displayPreview(files[0]);
            }
        }
    }
    
    // Display image preview
    function displayPreview(file) {
        const reader = new FileReader();
        
        reader.onload = function(e) {
            imagePreview.src = e.target.result;
            dropArea.style.display = 'none';
            previewContainer.style.display = 'block';
        };
        
        reader.readAsDataURL(file);
    }
    
    // Form submission
    if (uploadForm) {
        uploadForm.addEventListener('submit', function(e) {
            if (!fileInput.files || fileInput.files.length === 0) {
                e.preventDefault();
                alert('Please select an image first!');
                return false;
            }
            
            const fileSize = fileInput.files[0].size / 1024 / 1024; // in MB
            if (fileSize > 10) {
                e.preventDefault();
                alert('File size exceeds 10MB. Please choose a smaller file.');
                return false;
            }
            
            // Show loading state
            const detectBtn = document.getElementById('detectBtn');
            if (detectBtn) {
                detectBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...';
                detectBtn.disabled = true;
            }
            
            return true;
        });
    }
});
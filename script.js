// Основные переменные
let currentStep = 0;
const totalSteps = 5;
let formData = {};

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', function() {
    initializeForm();
    setupEventListeners();
    loadDraft();
});

// Инициализация формы
function initializeForm() {
    const form = document.getElementById('surveyForm');
    
    // Создаем прогресс бар
    const progressBar = document.createElement('div');
    progressBar.className = 'progress-bar';
    progressBar.innerHTML = '<div class="progress-fill" id="progressFill"></div>';
    form.insertBefore(progressBar, form.firstChild);
    
    // Создаем секции формы
    createFormSections();
    
    // Обновляем прогресс
    updateProgress();
}

// Создание секций формы
function createFormSections() {
    const form = document.getElementById('surveyForm');
    
    // Личная информация
    const personalInfoSection = createSection('personalInfo', 'Личная информация', [
        { type: 'text', name: 'fullName', label: 'ФИО *', required: true },
        { type: 'select', name: 'age', label: 'Возраст *', required: true, options: [
            { value: '', text: 'Выберите возраст' },
            { value: '18-25', text: '18-25 лет' },
            { value: '26-35', text: '26-35 лет' },
            { value: '36-45', text: '36-45 лет' },
            { value: '46-55', text: '46-55 лет' },
            { value: '56-65', text: '56-65 лет' },
            { value: '65+', text: '65+ лет' }
        ]},
        { type: 'text', name: 'city', label: 'Город проживания *', required: true },
        { type: 'tel', name: 'phone', label: 'Контактный телефон *', required: true },
        { type: 'email', name: 'email', label: 'Email' }
    ]);
    
    // Финансовая деятельность
    const financialSection = createSection('financial', 'Финансовая деятельность', [
        { type: 'radio', name: 'trading', label: 'Занимаетесь ли вы торговлей на биржах? *', required: true, options: [
            { value: 'yes', text: 'Да, активно торгую' },
            { value: 'sometimes', text: 'Иногда торгую' },
            { value: 'no', text: 'Не торгую' }
        ]},
        { type: 'checkbox', name: 'exchanges', label: 'Какие биржи вы используете? (можно выбрать несколько)', options: [
            { value: 'moex', text: 'Московская биржа (MOEX)' },
            { value: 'spb', text: 'Санкт-Петербургская биржа' },
            { value: 'foreign', text: 'Зарубежные биржи' },
            { value: 'crypto', text: 'Криптовалютные биржи' }
        ]},
        { type: 'select', name: 'investmentAmount', label: 'Размер ваших инвестиций', options: [
            { value: '', text: 'Выберите диапазон' },
            { value: '0-100k', text: 'До 100 000 руб.' },
            { value: '100k-500k', text: '100 000 - 500 000 руб.' },
            { value: '500k-1m', text: '500 000 - 1 000 000 руб.' },
            { value: '1m-5m', text: '1 000 000 - 5 000 000 руб.' },
            { value: '5m+', text: 'Более 5 000 000 руб.' }
        ]}
    ]);
    
    // Влияние санкций
    const sanctionsSection = createSection('sanctions', 'Влияние санкционных ограничений', [
        { type: 'radio', name: 'sanctionsImpact', label: 'Как санкции повлияли на вашу торговую активность? *', required: true, options: [
            { value: 'significantly', text: 'Значительно ограничили' },
            { value: 'moderately', text: 'Умеренно повлияли' },
            { value: 'slightly', text: 'Незначительно повлияли' },
            { value: 'no_impact', text: 'Не повлияли' }
        ]},
        { type: 'checkbox', name: 'sanctionsProblems', label: 'Какие основные проблемы вы столкнулись из-за санкций? (можно выбрать несколько)', options: [
            { value: 'access_restriction', text: 'Ограничение доступа к зарубежным биржам' },
            { value: 'payment_issues', text: 'Проблемы с пополнением/выводом средств' },
            { value: 'asset_freeze', text: 'Заморозка активов' },
            { value: 'broker_restrictions', text: 'Ограничения со стороны брокеров' },
            { value: 'currency_issues', text: 'Проблемы с валютными операциями' },
            { value: 'other', text: 'Другое' }
        ]},
        { type: 'textarea', name: 'otherProblems', label: 'Если выбрали "Другое", укажите подробности', placeholder: 'Опишите другие проблемы, с которыми вы столкнулись' },
        { type: 'radio', name: 'refundAttempt', label: 'Пытались ли вы вернуть средства с зарубежных бирж? *', required: true, options: [
            { value: 'yes', text: 'Да, пытался' },
            { value: 'no', text: 'Нет, не пытался' }
        ]},
        { type: 'radio', name: 'refundResult', label: 'Результат попытки возврата средств', options: [
            { value: 'successful', text: 'Успешно вернул' },
            { value: 'partial', text: 'Частично вернул' },
            { value: 'failed', text: 'Не удалось вернуть' },
            { value: 'in_process', text: 'В процессе' }
        ]}
    ]);
    
    // Опыт с ЖИРНЫМ БРОКЕРОМ
    const experienceSection = createSection('experience', 'Опыт работы с ЖИРНЫМ БРОКЕРОМ', [
        { type: 'radio', name: 'previousContact', label: 'Обращались ли вы ранее в ЖИРНЫЙ БРОКЕР? *', required: true, options: [
            { value: 'yes', text: 'Да, обращался' },
            { value: 'no', text: 'Нет, не обращался' }
        ]},
        { type: 'rating', name: 'serviceRating', label: 'Оцените качество наших услуг' },
        { type: 'textarea', name: 'additionalInfo', label: 'Дополнительная информация', placeholder: 'Поделитесь дополнительной информацией о вашем опыте или пожеланиях' }
    ]);
    
    // Согласие
    const consentSection = createSection('consent', 'Согласие', [
        { type: 'checkbox', name: 'consent', label: 'Я согласен на обработку персональных данных и получение информации о услугах ЖИРНОГО БРОКЕРА *', required: true, single: true }
    ]);
    
    // Добавляем секции в форму
    form.appendChild(personalInfoSection);
    form.appendChild(financialSection);
    form.appendChild(sanctionsSection);
    form.appendChild(experienceSection);
    form.appendChild(consentSection);
    
    // Добавляем кнопки
    addFormButtons();
}

// Создание секции формы
function createSection(id, title, fields) {
    const section = document.createElement('section');
    section.className = 'form-section';
    section.id = id;
    
    const titleElement = document.createElement('h3');
    titleElement.textContent = title;
    section.appendChild(titleElement);
    
    fields.forEach(field => {
        const fieldElement = createField(field);
        section.appendChild(fieldElement);
    });
    
    return section;
}

// Создание поля формы
function createField(field) {
    const group = document.createElement('div');
    group.className = 'form-group';
    
    const label = document.createElement('label');
    label.textContent = field.label;
    if (field.required) {
        label.style.fontWeight = '600';
    }
    group.appendChild(label);
    
    let input;
    
    switch (field.type) {
        case 'text':
        case 'email':
        case 'tel':
            input = document.createElement('input');
            input.type = field.type;
            input.name = field.name;
            input.id = field.name;
            if (field.required) input.required = true;
            if (field.placeholder) input.placeholder = field.placeholder;
            break;
            
        case 'select':
            input = document.createElement('select');
            input.name = field.name;
            input.id = field.name;
            if (field.required) input.required = true;
            
            field.options.forEach(option => {
                const optionElement = document.createElement('option');
                optionElement.value = option.value;
                optionElement.textContent = option.text;
                input.appendChild(optionElement);
            });
            break;
            
        case 'textarea':
            input = document.createElement('textarea');
            input.name = field.name;
            input.id = field.name;
            input.rows = 4;
            if (field.placeholder) input.placeholder = field.placeholder;
            break;
            
        case 'radio':
            const radioContainer = document.createElement('div');
            radioContainer.className = 'radio-group';
            
            field.options.forEach(option => {
                const radioLabel = document.createElement('label');
                radioLabel.className = 'radio-label';
                
                const radioInput = document.createElement('input');
                radioInput.type = 'radio';
                radioInput.name = field.name;
                radioInput.value = option.value;
                if (field.required) radioInput.required = true;
                
                const radioCustom = document.createElement('span');
                radioCustom.className = 'radio-custom';
                
                const radioText = document.createElement('span');
                radioText.textContent = option.text;
                
                radioLabel.appendChild(radioInput);
                radioLabel.appendChild(radioCustom);
                radioLabel.appendChild(radioText);
                radioContainer.appendChild(radioLabel);
            });
            
            group.appendChild(radioContainer);
            return group;
            
        case 'checkbox':
            const checkboxContainer = document.createElement('div');
            checkboxContainer.className = 'checkbox-group';
            
            if (field.single) {
                // Одиночный чекбокс
                const checkboxLabel = document.createElement('label');
                checkboxLabel.className = 'checkbox-label consent-label';
                
                const checkboxInput = document.createElement('input');
                checkboxInput.type = 'checkbox';
                checkboxInput.name = field.name;
                if (field.required) checkboxInput.required = true;
                
                const checkboxCustom = document.createElement('span');
                checkboxCustom.className = 'checkbox-custom';
                
                const checkboxText = document.createElement('span');
                checkboxText.textContent = field.label;
                
                checkboxLabel.appendChild(checkboxInput);
                checkboxLabel.appendChild(checkboxCustom);
                checkboxLabel.appendChild(checkboxText);
                checkboxContainer.appendChild(checkboxLabel);
                
                group.innerHTML = '';
                group.appendChild(checkboxContainer);
                return group;
            } else {
                // Множественные чекбоксы
                field.options.forEach(option => {
                    const checkboxLabel = document.createElement('label');
                    checkboxLabel.className = 'checkbox-label';
                    
                    const checkboxInput = document.createElement('input');
                    checkboxInput.type = 'checkbox';
                    checkboxInput.name = field.name;
                    checkboxInput.value = option.value;
                    
                    const checkboxCustom = document.createElement('span');
                    checkboxCustom.className = 'checkbox-custom';
                    
                    const checkboxText = document.createElement('span');
                    checkboxText.textContent = option.text;
                    
                    checkboxLabel.appendChild(checkboxInput);
                    checkboxLabel.appendChild(checkboxCustom);
                    checkboxLabel.appendChild(checkboxText);
                    checkboxContainer.appendChild(checkboxLabel);
                });
            }
            
            group.appendChild(checkboxContainer);
            return group;
            
        case 'rating':
            const ratingContainer = document.createElement('div');
            ratingContainer.className = 'rating-group';
            
            for (let i = 5; i >= 1; i--) {
                const ratingLabel = document.createElement('label');
                ratingLabel.className = 'rating-label';
                
                const ratingInput = document.createElement('input');
                ratingInput.type = 'radio';
                ratingInput.name = field.name;
                ratingInput.value = i;
                
                const ratingStar = document.createElement('span');
                ratingStar.className = 'rating-star';
                ratingStar.textContent = '★';
                
                ratingLabel.appendChild(ratingInput);
                ratingLabel.appendChild(ratingStar);
                ratingContainer.appendChild(ratingLabel);
            }
            
            group.appendChild(ratingContainer);
            return group;
    }
    
    if (input) {
        group.appendChild(input);
    }
    
    return group;
}

// Добавление кнопок формы
function addFormButtons() {
    const form = document.getElementById('surveyForm');
    
    const actionsDiv = document.createElement('div');
    actionsDiv.className = 'form-actions';
    
    const saveDraftBtn = document.createElement('button');
    saveDraftBtn.type = 'button';
    saveDraftBtn.id = 'saveDraft';
    saveDraftBtn.className = 'btn btn-secondary';
    saveDraftBtn.textContent = 'Сохранить черновик';
    
    const submitBtn = document.createElement('button');
    submitBtn.type = 'submit';
    submitBtn.className = 'btn btn-primary';
    submitBtn.textContent = 'Отправить анкету';
    
    actionsDiv.appendChild(saveDraftBtn);
    actionsDiv.appendChild(submitBtn);
    form.appendChild(actionsDiv);
}

// Настройка обработчиков событий
function setupEventListeners() {
    const form = document.getElementById('surveyForm');
    const saveDraftBtn = document.getElementById('saveDraft');
    
    // Обработка отправки формы
    form.addEventListener('submit', handleFormSubmit);
    
    // Обработка сохранения черновика
    saveDraftBtn.addEventListener('click', saveDraft);
    
    // Обработка изменений в полях
    form.addEventListener('change', handleFieldChange);
    
    // Обработка показа/скрытия дополнительных полей
    setupConditionalFields();
    
    // Валидация в реальном времени
    setupRealTimeValidation();
}

// Обработка отправки формы
function handleFormSubmit(e) {
    e.preventDefault();
    
    if (validateForm()) {
        const formData = collectFormData();
        submitForm(formData);
    }
}

// Валидация формы
function validateForm() {
    const form = document.getElementById('surveyForm');
    const requiredFields = form.querySelectorAll('[required]');
    let isValid = true;
    
    requiredFields.forEach(field => {
        if (!field.value || (field.type === 'checkbox' && !field.checked)) {
            isValid = false;
            field.style.borderColor = '#e74c3c';
            field.style.boxShadow = '0 0 0 3px rgba(231, 76, 60, 0.1)';
        } else {
            field.style.borderColor = '#e1e8ed';
            field.style.boxShadow = 'none';
        }
    });
    
    if (!isValid) {
        alert('Пожалуйста, заполните все обязательные поля (отмеченные звездочкой)');
        return false;
    }
    
    return true;
}

// Сбор данных формы
function collectFormData() {
    const form = document.getElementById('surveyForm');
    const formData = new FormData(form);
    const data = {};
    
    for (let [key, value] of formData.entries()) {
        if (data[key]) {
            if (Array.isArray(data[key])) {
                data[key].push(value);
            } else {
                data[key] = [data[key], value];
            }
        } else {
            data[key] = value;
        }
    }
    
    // Добавляем метаданные
    data.timestamp = new Date().toISOString();
    data.userAgent = navigator.userAgent;
    data.referrer = document.referrer;
    
    return data;
}

// Отправка формы
function submitForm(data) {
    const submitBtn = document.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    
    // Показываем индикатор загрузки
    submitBtn.textContent = 'Отправка...';
    submitBtn.disabled = true;
    submitBtn.classList.add('loading');
    
    // Имитация отправки (в реальном проекте здесь будет AJAX запрос)
    setTimeout(() => {
        // Сохраняем данные в localStorage для демонстрации
        const submissions = JSON.parse(localStorage.getItem('surveySubmissions') || '[]');
        submissions.push(data);
        localStorage.setItem('surveySubmissions', JSON.stringify(submissions));
        
        // Очищаем черновик
        localStorage.removeItem('surveyDraft');
        
        // Показываем модальное окно успеха
        showSuccessModal();
        
        // Сбрасываем кнопку
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
        submitBtn.classList.remove('loading');
        
        // Очищаем форму
        document.getElementById('surveyForm').reset();
        
    }, 2000);
}

// Показ модального окна успеха
function showSuccessModal() {
    const modal = document.getElementById('successModal');
    if (!modal) {
        createSuccessModal();
    }
    document.getElementById('successModal').style.display = 'block';
}

// Создание модального окна успеха
function createSuccessModal() {
    const modal = document.createElement('div');
    modal.id = 'successModal';
    modal.className = 'modal';
    
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h3>Спасибо за участие в опросе!</h3>
            </div>
            <div class="modal-body">
                <p>Ваша анкета успешно отправлена. Наши специалисты свяжутся с вами в ближайшее время.</p>
                <p>Если у вас есть срочные вопросы, звоните нам прямо сейчас!</p>
                <p><strong>Телефон: +7 (863) 123-45-67</strong></p>
            </div>
            <div class="modal-footer">
                <button class="btn btn-primary" onclick="closeModal()">Закрыть</button>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
}

// Закрытие модального окна
function closeModal() {
    document.getElementById('successModal').style.display = 'none';
}

// Сохранение черновика
function saveDraft() {
    const formData = collectFormData();
    localStorage.setItem('surveyDraft', JSON.stringify(formData));
    
    const saveBtn = document.getElementById('saveDraft');
    const originalText = saveBtn.textContent;
    saveBtn.textContent = 'Сохранено!';
    saveBtn.style.background = '#27ae60';
    
    setTimeout(() => {
        saveBtn.textContent = originalText;
        saveBtn.style.background = '';
    }, 2000);
}

// Загрузка черновика
function loadDraft() {
    const draft = localStorage.getItem('surveyDraft');
    if (draft) {
        const data = JSON.parse(draft);
        populateForm(data);
    }
}

// Заполнение формы данными
function populateForm(data) {
    Object.keys(data).forEach(key => {
        const field = document.querySelector(`[name="${key}"]`);
        if (field) {
            if (field.type === 'checkbox' || field.type === 'radio') {
                if (Array.isArray(data[key])) {
                    data[key].forEach(value => {
                        const option = document.querySelector(`[name="${key}"][value="${value}"]`);
                        if (option) option.checked = true;
                    });
                } else {
                    const option = document.querySelector(`[name="${key}"][value="${data[key]}"]`);
                    if (option) option.checked = true;
                }
            } else {
                field.value = data[key];
            }
        }
    });
}

// Обработка изменений в полях
function handleFieldChange(e) {
    // Автосохранение каждые 30 секунд
    clearTimeout(window.autoSaveTimeout);
    window.autoSaveTimeout = setTimeout(() => {
        saveDraft();
    }, 30000);
    
    // Обработка условных полей
    handleConditionalFields(e);
}

// Настройка условных полей
function setupConditionalFields() {
    // Показ/скрытие поля результата возврата средств
    const refundAttemptRadios = document.querySelectorAll('[name="refundAttempt"]');
    refundAttemptRadios.forEach(radio => {
        radio.addEventListener('change', function() {
            const refundDetails = document.getElementById('refundDetails');
            if (this.value === 'yes') {
                refundDetails.style.display = 'block';
            } else {
                refundDetails.style.display = 'none';
            }
        });
    });
    
    // Показ/скрытие поля рейтинга услуг
    const previousContactRadios = document.querySelectorAll('[name="previousContact"]');
    previousContactRadios.forEach(radio => {
        radio.addEventListener('change', function() {
            const previousExperience = document.getElementById('previousExperience');
            if (this.value === 'yes') {
                previousExperience.style.display = 'block';
            } else {
                previousExperience.style.display = 'none';
            }
        });
    });
}

// Обработка условных полей
function handleConditionalFields(e) {
    if (e.target.name === 'refundAttempt') {
        const refundDetails = document.getElementById('refundDetails');
        if (e.target.value === 'yes') {
            refundDetails.style.display = 'block';
        } else {
            refundDetails.style.display = 'none';
        }
    }
    
    if (e.target.name === 'previousContact') {
        const previousExperience = document.getElementById('previousExperience');
        if (e.target.value === 'yes') {
            previousExperience.style.display = 'block';
        } else {
            previousExperience.style.display = 'none';
        }
    }
}

// Настройка валидации в реальном времени
function setupRealTimeValidation() {
    const form = document.getElementById('surveyForm');
    const inputs = form.querySelectorAll('input, select, textarea');
    
    inputs.forEach(input => {
        input.addEventListener('blur', function() {
            if (this.hasAttribute('required') && !this.value) {
                this.style.borderColor = '#e74c3c';
                this.style.boxShadow = '0 0 0 3px rgba(231, 76, 60, 0.1)';
            } else {
                this.style.borderColor = '#e1e8ed';
                this.style.boxShadow = 'none';
            }
        });
        
        input.addEventListener('input', function() {
            if (this.style.borderColor === 'rgb(231, 76, 60)') {
                this.style.borderColor = '#e1e8ed';
                this.style.boxShadow = 'none';
            }
        });
    });
}

// Обновление прогресса
function updateProgress() {
    const progressFill = document.getElementById('progressFill');
    if (progressFill) {
        const progress = ((currentStep + 1) / totalSteps) * 100;
        progressFill.style.width = progress + '%';
    }
}

// Обработка клика вне модального окна
window.addEventListener('click', function(e) {
    const modal = document.getElementById('successModal');
    if (e.target === modal) {
        closeModal();
    }
});

// Обработка клавиши Escape
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        closeModal();
    }
});

// Функция для экспорта данных (для администратора)
function exportData() {
    const submissions = JSON.parse(localStorage.getItem('surveySubmissions') || '[]');
    const dataStr = JSON.stringify(submissions, null, 2);
    const dataBlob = new Blob([dataStr], {type: 'application/json'});
    
    const link = document.createElement('a');
    link.href = URL.createObjectURL(dataBlob);
    link.download = 'survey_data_' + new Date().toISOString().split('T')[0] + '.json';
    link.click();
}

// Функция для очистки данных
function clearData() {
    if (confirm('Вы уверены, что хотите очистить все данные?')) {
        localStorage.removeItem('surveySubmissions');
        localStorage.removeItem('surveyDraft');
        alert('Данные очищены');
    }
}
// todo : add check image condition for image preview

class BaseFormElement {
    constructor(config) {
        this.type = config.type;
        this.name = config.name;
        this.label = config.label;
        this.collapsible = config.collapsible || true;
        this.required = config.required || false;
        this.image = config.image || false;
        this.validations = config.validations || [];
    }

    renderElement() {
        throw new Error('renderElement method must be implemented.');
    }

    applyValidations(input){
        input.addEventListener('input', (e) => {
            let isValid = true;
            let errorMessage = '';

            for (const validation of this.validations) {
                const rule = ValidationRules[validation.type];
                
                if (typeof rule === 'function') {
                    const ruleWithValue = rule(validation.value);
                    if (!ruleWithValue.validate(e.target.value)) {
                        isValid = false;
                        errorMessage = ruleWithValue.message;
                        break;
                    }
                } 
                else if (rule) {
                    if (!rule.validate(e.target.value)) {
                        isValid = false;
                        errorMessage = rule.message;
                        break;
                    }
                }
            }

            // validity state
            if (!isValid) {
                e.target.setCustomValidity(errorMessage);
            } else {
                e.target.setCustomValidity('');
            }
        });
    }
}

class InputElement extends BaseFormElement {
    constructor(config) {
        super(config);
        this.inputType = config.inputType || 'text';
        this.placeholder = config.placeholder || '';
    }

    renderElement() {
        const elementBody = DomElementManager.getDivWithClassName(['form-field']);
        const label = DomElementManager.getLabelWithTextContent(this.label, this.name);

        const input = DomElementManager.getInputWithAttributes(this, 'form-input');
        
        const questionImagePreview = DomElementManager.getDivWithClassName(['flex-wrap']);
        if(this.image){
            const img = DomElementManager.getQuestionImagePreview(this.image);
            questionImagePreview.append(img);
        }

        //add check image condition here 
        // if(this.inputType == 'file') {
        //     const imagePreview = DomElementManager.getImagePreviewFromFile(input);
        //     elementBody.append(imagePreview);
        // }
        if(this.inputType == 'password'){
            // input.minLength = '8';
            const validation = {type: 'minLength', value: 8,};
            this.validations.push(validation);
        }

        this.applyValidations(input);
        elementBody.append(label, questionImagePreview, input);
        return elementBody;
    }
}

class SelectElement extends BaseFormElement {
    constructor(config) {
        super(config);
        this.options = config.options || [];
        this.placeholder = config.placeholder || '';
    }

    renderElement() {
        const elementBody = DomElementManager.getDivWithClassName(['form-field']);
        const label = DomElementManager.getLabelWithTextContent(this.label, this.name);

        const select = DomElementManager.getSelectWithAttributes(this, 'form-select');
        const defaultOption = DomElementManager.getOptionWithAttributes(this.placeholder, '', true, true);
        select.append(defaultOption);
        this.options.forEach(optionText => {
            const option = DomElementManager.getOptionWithAttributes(optionText, optionText);
            select.append(option);
        });

        const questionImagePreview = DomElementManager.getDivWithClassName(['flex-wrap']);
        if(this.image){
            const img = DomElementManager.getQuestionImagePreview(this.image);
            questionImagePreview.append(img);
        }

        elementBody.append(label, questionImagePreview, select);
        return elementBody;
    }
}

class MultichoiceElement extends BaseFormElement {
    constructor(config) {
        super(config);
        this.options = config.options || [];
    }

    renderElement() {
        const elementBody = DomElementManager.getDivWithClassName(['form-field']);
        const label = DomElementManager.getLabelWithTextContent(this.label, this.name);

        const optionsContainer = DomElementManager.getDivWithClassName(['radio-group']);
        this.options.forEach((optionText) => {
            const radioOptionElement = DomElementManager.getDivWithClassName(['radio-option']);
            const radioInput = document.createElement('input');
            radioInput.type = 'radio';
            radioInput.name = this.name;
            radioInput.id = `${this.name}-${optionText}`;
            radioInput.value = optionText;
            radioInput.required = this.required;

            const radioLabel = DomElementManager.getLabelWithTextContent(optionText, `${this.name}-${optionText}`, 'radio-label');

            radioOptionElement.append(radioInput, radioLabel);
            optionsContainer.append(radioOptionElement);
        });

        const questionImagePreview = DomElementManager.getDivWithClassName(['flex-wrap']);
        if(this.image){
            const img = DomElementManager.getQuestionImagePreview(this.image);
            questionImagePreview.append(img);
        }

        elementBody.append(label, questionImagePreview, optionsContainer);
        return elementBody;
    }
}

class CheckboxElement extends BaseFormElement {
    constructor(config) {
        super(config);
        this.options = config.options || [];
    }

    renderElement() {
        const elementBody = DomElementManager.getDivWithClassName(['form-field']);
        const label = DomElementManager.getLabelWithTextContent(this.label, this.name);

        const optionsContainer = DomElementManager.getDivWithClassName(['checkbox-group']);
        this.options.forEach((optionText) => {
            const checkboxOptionElement = DomElementManager.getDivWithClassName(['checkbox-option']);
            const checkboxInput = document.createElement('input');
            checkboxInput.type = 'checkbox';
            checkboxInput.name = this.name;
            checkboxInput.id = `${this.name}-${optionText}`;
            checkboxInput.value = optionText;
            checkboxInput.required = this.required;

            const checkboxLabel = DomElementManager.getLabelWithTextContent(optionText, `${this.name}-${optionText}`, 'checkbox-label');

            checkboxOptionElement.append(checkboxInput, checkboxLabel);
            optionsContainer.append(checkboxOptionElement);
        });

        const questionImagePreview = DomElementManager.getDivWithClassName(['flex-wrap']);
        if(this.image){
            const img = DomElementManager.getQuestionImagePreview(this.image);
            questionImagePreview.append(img);
        }

        elementBody.append(label, questionImagePreview, optionsContainer);
        return elementBody;
    }
}

class TextareaElement extends BaseFormElement {
    constructor(config) {
        super(config);
        this.placeholder = config.placeholder || '';
        this.rows = config.rows || 3;
        this.cols = config.cols || 30;
    }

    renderElement() {
        const elementBody = DomElementManager.getDivWithClassName(['form-field']);
        const label = DomElementManager.getLabelWithTextContent(this.label, this.name);

        const textarea = document.createElement('textarea');
        textarea.rows = this.rows;
        textarea.cols = this.cols;
        textarea.name = this.name;
        textarea.id = this.name;
        textarea.placeholder = this.placeholder;
        textarea.required = this.required;
        textarea.className = 'form-textarea';

        const questionImagePreview = DomElementManager.getDivWithClassName(['flex-wrap']);
        if(this.image){
            const img = DomElementManager.getQuestionImagePreview(this.image);
            questionImagePreview.append(img);
        }

        elementBody.append(label, questionImagePreview, textarea);
        return elementBody;
    }
}

class FormConfigManager {
    createElement(config) {
        switch(config.type) {
            case 'input':
                return new InputElement(config);
            case 'select':
                return new SelectElement(config);
            case 'radio':
                return new MultichoiceElement(config);
            case 'checkbox':
                return new CheckboxElement(config);
            case 'textarea':
                return new TextareaElement(config);
            default:
                throw new Error(`Form element type : ${config.type} not supported.`);
        }
    }
}
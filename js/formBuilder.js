// todo : change render function - not render entire form / all sections always
// render only a section for a change
// currently taking toggle button status from here. --> change this

class Section {
    constructor(config) {
        this.title = config.title;
        this.id = config.id;
        this.elements = [];
    }

    addElement(element) {
        this.elements.push(element);
    }

    removeElement(name) {
        this.elements = this.elements.filter(element => element.name !== name);
    }

    renderSection() {
        const sectionDiv = DomElementManager.getSectionDiv(this.title, this.id);
        const elementsContainer = sectionDiv.querySelector('.section-elements');
        
        this.elements.forEach(element => {
            const elementDOM = element.renderElement();
            elementsContainer.appendChild(elementDOM);
        });

        return sectionDiv;
    }
}

class FormBuilder {
    constructor() {
        this.sections = [];
    }

    addSection(sectionConfig) {
        const section = new Section(sectionConfig);
        this.sections.push(section);
        // return section.id;
    }

    removeSection(sectionId) {
        this.sections = this.sections.filter(section => section.id !== sectionId);
    }

    reorderSection(elementSectionId, afterElementSectionID){
        const curIndex = this.sections.findIndex(section => section.id === elementSectionId);
        const curSection = this.sections[curIndex];

        if(afterElementSectionID === null){
            this.sections.splice(curIndex, 1);
            this.sections.push(curSection);
        }else{
            const afterIndex = this.sections.findIndex(section => section.id === afterElementSectionID);
            this.sections.splice(curIndex, 1);
            if(afterIndex > curIndex){
                afterIndex - 1;
            }
            this.sections.splice(afterIndex, 0, curSection);
        }
    }
}

class ConcreteFormBuilder extends FormBuilder {
    constructor() {
        super();
        this.formConfigManager = new FormConfigManager();
        this.formProgress = new FormProgress();
    }

    addElementToSection(sectionId, elementConfig) {
        const section = this.sections.find(s => s.id === sectionId);
        if (!section) throw new Error('Section not found');
        
        const element = this.formConfigManager.createElement(elementConfig);
        section.addElement(element);
    }

    removeElementFromSection(sectionId, elementName) {
        const section = this.sections.find(s => s.id === sectionId);
        if (section) {
            section.removeElement(elementName);
        }
    }

    renderForm(container) {
        const progressElement = this.formProgress.getProgressElement();
        container.innerHTML = '';
        container.appendChild(progressElement);

         // change this
        const toggleThemeBtn = document.getElementById('theme_btn');
        const isDarkTheme = toggleThemeBtn.checked; 

        function handleSubmit(event){
            // todo
            event.preventDefault();
        }

        const form = document.createElement('form');
        form.className = 'form-body';
        form.onsubmit = handleSubmit;
        if(isDarkTheme)
            container.classList.add('dark-theme');
        
        this.sections.forEach((section)=> {
            const sectionDOM = section.renderSection();
            // console.log('sectionDom : ', sectionDOM);
            form.appendChild(sectionDOM);
        });

        form.addEventListener('change', () => {
            const progress = this.formProgress.calculateProgress(form);
            this.formProgress.updateProgress(progress);
        });

        if(this.sections.length && this.sections[0].elements.length){
            const clearButton = document.createElement('button');
            const submitButton = document.createElement('button');
            clearButton.type = 'reset';     
            clearButton.textContent = 'Clear';
            submitButton.type = 'submit';
            submitButton.textContent = 'Submit';
            form.append(clearButton, submitButton);
        }

        const initialProgress = this.formProgress.calculateProgress(form);
        this.formProgress.updateProgress(initialProgress);

        container.append(form);
    }
}
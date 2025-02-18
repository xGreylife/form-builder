const SUPPORTED_FIELD_TYPES = {
    'text': 'input',
    'email': 'input',
    'password': 'input',
    'date': 'input',
    'file': 'input',
    'select': 'select',
    'radio': 'radio',
    'checkbox': 'checkbox',
    'textarea': 'textarea'
};

document.addEventListener('DOMContentLoaded', () => {
    const concreteFormBuilder = new ConcreteFormBuilder();
    let currentSectionId = null;

    const fieldTypeInput = document.getElementById('field_type');
    const fieldLabelInput = document.getElementById('field_label');
    const fieldNameInput = document.getElementById('field_name');
    const addFieldBtn = document.getElementById('add_field_btn');
    const addOptionBtn = document.getElementById('add_option_btn');
    const optionsContainer = document.getElementById('options_container');
    const fieldList = document.getElementById('field_list');
    const isRequiredInput = document.getElementById('required_field');
    const formPreview = document.getElementById('form_preview');
    const fieldBuilder = document.querySelector('.field-builder');
    const addSectionBtn = document.getElementById('add_section_btn');
    const sectionTitleInput = document.getElementById('section_title');
    const sectionList = document.getElementById('section_list');
    const themeToggleBtn = document.getElementById('theme_btn');
    const questionImage = document.getElementById('field_image');

    // hide field builder
    fieldBuilder.style.display = 'none';
    
    const optionsSection = document.getElementById('options_section');    
    fieldTypeInput.addEventListener('change', () => {
        const selectedType = fieldTypeInput.value;
        if (['select', 'radio', 'checkbox'].includes(selectedType)) {
            optionsSection.style.display = 'block';
        } else {
            optionsSection.style.display = 'none';
            optionsContainer.innerHTML = '';
        }
    });

    addOptionBtn.addEventListener('click', () => {
        const optionWrapper = document.createElement('div');
        optionWrapper.className = 'option-wrapper';
        
        const optionInput = document.createElement('input');
        optionInput.type = 'text';
        optionInput.className = 'option-input';
        optionInput.placeholder = 'Enter option text';
        
        const removeBtn = document.createElement('button');
        removeBtn.textContent = 'Remove';
        removeBtn.className = 'remove-option-btn';
        removeBtn.onclick = () => optionWrapper.remove();
        
        optionWrapper.append(optionInput, removeBtn);
        optionsContainer.appendChild(optionWrapper);
    });

    function generateSectionId() {
        return 'section_' + Date.now();
    }

    function renderSectionList() {
        sectionList.innerHTML = '';
        concreteFormBuilder.sections.forEach(section => {
            console.log(section);
            const li = document.createElement('li');
            li.className = 'section-list-item';
            li.classList.add('draggable');
            li.draggable = 'true';
            li.dataset.id = section.id;
            li.innerHTML = `
                <div class="section-info ${currentSectionId === section.id ? 'active' : ''}">
                    <span class="section-name">${section.title}</span>
                    <div class="section-actions">
                        <button class="delete-section-btn">Delete</button>
                    </div>
                </div>
            `;

            li.querySelector('.section-name').addEventListener('click', () => {
                currentSectionId = section.id;
                fieldBuilder.style.display = 'block';
                renderSectionList();
                renderFieldList();
            });

            li.querySelector('.delete-section-btn').addEventListener('click', () => {
                concreteFormBuilder.removeSection(section.id);
                currentSectionId = concreteFormBuilder.sections[0]?.id || null;
                fieldBuilder.style.display = currentSectionId ? 'block' : 'none';
                renderSectionList();
                renderFieldList();
                concreteFormBuilder.renderForm(formPreview);
            });

            sectionList.appendChild(li);
            
            let curDraggableId = null, curDragAfterElementId = null;
            const draggables = document.querySelectorAll('.draggable');
            // console.log('draggables : ', draggables);
            draggables.forEach((draggable) => {
                draggable.addEventListener('dragstart', ()=>{
                    draggable.classList.add('dragging');
                });

                draggable.addEventListener('dragend', ()=>{
                    draggable.classList.remove('dragging');
                    console.log('ids : ', curDraggableId, curDragAfterElementId);
                    concreteFormBuilder.reorderSection(curDraggableId, curDragAfterElementId);
                    concreteFormBuilder.renderForm(formPreview);
                });
            });

            sectionList.addEventListener('dragover', (e)=>{
                e.preventDefault();
                const afterElement = getDragAfterElement(sectionList, e.clientY);
                const draggable = document.querySelector('.dragging');
                curDraggableId = draggable.dataset.id;
                if(afterElement == null){
                    sectionList.append(draggable);
                    curDragAfterElementId = null;
                }else{
                    sectionList.insertBefore(draggable, afterElement);
                    curDragAfterElementId = afterElement.dataset.id;
                }
                console.log(curDragAfterElementId);
                // concreteFormBuilder.reorderSection(curDraggableId, curDragAfterElementId);
                // concreteFormBuilder.renderForm(formPreview);
            });

            function getDragAfterElement(container, y){
                const draggableELements = [...container.querySelectorAll('.draggable:not(.dragging)')];
                return draggableELements.reduce((closest, child) => {
                    const box = child.getBoundingClientRect();
                    const offset = y - box.top - box.height / 2;
                    if(offset < 0 && offset > closest.offset){
                        return { offset: offset, element: child };
                    }else{
                        return closest;
                    }
                }, {offset: Number.NEGATIVE_INFINITY}).element;
            }
        });

        // console.log('org section list', concreteFormBuilder.sections)
    }

    function renderFieldList() {
        fieldList.innerHTML = '';
        if (!currentSectionId) return;

        const currentSection = concreteFormBuilder.sections.find((section) => section.id === currentSectionId);
        if (!currentSection) return;

        currentSection.elements.forEach(element => {
            const li = document.createElement('li');
            li.className = 'field-list-item';
            li.innerHTML = `
                <div class="field-info">
                    <span class="field-name">${element.label} (${element.type})</span>
                    <button class="delete-field-btn" data-name="${element.name}">Delete</button>
                </div>
            `;

            li.querySelector('.delete-field-btn').addEventListener('click', () => {
                concreteFormBuilder.removeElementFromSection(currentSectionId, element.name);
                renderFieldList();
                concreteFormBuilder.renderForm(formPreview);
            });

            fieldList.appendChild(li);
        });
    }

    addSectionBtn.addEventListener('click', () => {
        const title = sectionTitleInput.value.trim();
        if (!title) {
            alert('Section title required.');
            return;
        }

        const sectionId = generateSectionId();
        concreteFormBuilder.addSection({ title, id: sectionId });
        sectionTitleInput.value = '';
        currentSectionId = sectionId;
        fieldBuilder.style.display = 'block';
        renderSectionList();
        concreteFormBuilder.renderForm(formPreview);
    });

    addFieldBtn.addEventListener('click', () => {
        if (!currentSectionId) {
            alert('Create/select a section first.');
            return;
        }

        const fieldType = fieldTypeInput.value;
        const label = fieldLabelInput.value.trim();
        const name = fieldNameInput.value.trim();
        const required = isRequiredInput.checked;
        const image = questionImage.files[0];

        if (!label || !name) {
            alert('Label and name is required');
            return;
        }

        function checkUniqueName(name){
            return concreteFormBuilder.sections.some((section) => {
                return section.elements.some((element) => {
                    return element.name === name;
                });
            });
        }

        if (checkUniqueName(name)) {
            alert('Field name must be unique');
            return;
        }

        const options = [];
        if (['select', 'radio', 'checkbox'].includes(fieldType)) {
            const optionInputs = document.querySelectorAll('.option-input');
            if (optionInputs.length === 0) {
                alert('Add atleast one option to continue.');
                return;
            }
            
            optionInputs.forEach(input => {
                const optionValue = input.value.trim();
                if (optionValue) {
                    options.push(optionValue);
                }
            });

            if (options.length === 0) {
                alert('Add atleast one option to continue.');
                return;
            }
        }

        try {
            const elementConfig = {
                type: SUPPORTED_FIELD_TYPES[fieldType] || fieldType,
                inputType: fieldType,
                name: name,
                label: label,
                required: required,
                options: options,
                placeholder: `Enter ${label.toLowerCase()}...`,
                image: image || false,
            };

            concreteFormBuilder.addElementToSection(currentSectionId, elementConfig);
            
            fieldLabelInput.value = '';
            fieldNameInput.value = '';
            optionsContainer.innerHTML = '';
            isRequiredInput.checked = false;
            questionImage.value = '';
            
            if (['select', 'radio', 'checkbox'].includes(fieldType)) {
                optionsSection.style.display = 'none';
            }
            
            renderFieldList();
            concreteFormBuilder.renderForm(formPreview);
        } catch (error) {
            console.error('Form builder error:', error);
            alert(`Error: ${error.message}`);
        }
    });

    themeToggleBtn.addEventListener('click', ()=>{
        formPreview.classList.toggle('dark-theme');
    });
});
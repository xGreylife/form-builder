// todo : update with new functions as per need, and update other files accordingly
// add transition to collapsible div 
// create form progress element function here

class DomElementManager{
    // general elements
    static getSectionDiv(title, id) {
        const sectionDiv = document.createElement('div');
        sectionDiv.className = 'form-section';
        sectionDiv.setAttribute('data-section-id', id);
        
        const titleElement = document.createElement('h3');
        titleElement.textContent = title;
        titleElement.className = 'section-title';
        
        const elementsContainer = DomElementManager.getCollapsibleDiv(titleElement, true);
        elementsContainer.className = 'section-elements';
        
        sectionDiv.append(titleElement, elementsContainer);
        return sectionDiv;
    }
    
    static getDivWithClassName(classNameList = []){
        const div = document.createElement('div');
        div.classList = classNameList;
        return div;
    }

    static getLabelWithTextContent(textContent, htmlFor = '', className = ''){
        const label = document.createElement('label');
        label.textContent = textContent;
        label.htmlFor = htmlFor;
        label.className = className;
        return label;
    }

    static getCollapsibleDiv(label, isCollapsible){                                  
        const collapsibleDiv = document.createElement('div');
        if(isCollapsible){
            label.addEventListener('click', function(event){
                if(collapsibleDiv.style.visibility == 'hidden'){
                    collapsibleDiv.style.visibility = 'visible';
                    collapsibleDiv.style.maxHeight = 'fit-content';
                }else{
                    collapsibleDiv.style.visibility = 'hidden';
                    collapsibleDiv.style.maxHeight = 0;
                }

                // if (collapsibleDiv.style.maxHeight){
                //     collapsibleDiv.style.maxHeight = null;
                // } else {
                //     console.log('scrollHeight : ', collapsibleDiv.scrollHeight);
                //     collapsibleDiv.style.maxHeight = collapsibleDiv.scrollHeight + 'px';
                // } 
            });
        }
        return collapsibleDiv;
    }

    static getColorInput(div){
        const colorInput = document.createElement('input');
        colorInput.type = 'color';
        colorInput.style.width = '28px';
        colorInput.addEventListener('input', function(){
            div.style.borderLeft = `7px solid ${colorInput.value}`;
        });
        return colorInput;
    }

    static getImagePreviewFromFile(fileInput){
        const imagePreview = DomElementManager.getDivWithClassName(['flex-wrap']);
        
        fileInput.addEventListener('change', function(){
            const file = fileInput.files[0];

            if(file){
                const reader = new FileReader();
                reader.onload = function(){
                    const img = document.createElement('img');
                    img.className = 'img-preview';
                    img.src = reader.result;
                    imagePreview.innerHtml = '';
                    imagePreview.append(img);
                }
                reader.readAsDataURL(file);
            }
        });

        return imagePreview;
    }

    static getQuestionImagePreview(image){
        const img = document.createElement('img');
        if(image){
            const reader = new FileReader();
            reader.onload = function(){
                img.className = 'img-preview';
                img.src = reader.result;
            }
            reader.readAsDataURL(image);
        }
        return img;
    }

    // input elements
    static getInputWithAttributes(attributeObj, className = ''){
        const input = document.createElement('input');
        input.type = attributeObj.inputType;
        input.name = attributeObj.name;
        input.required = attributeObj.required;
        input.placeholder = attributeObj.placeholder;
        input.className = className;
        return input;
    }

    // select elements 
    static getSelectWithAttributes(attributeObj, className = ''){
        const select = document.createElement('select');
        select.name = attributeObj.name;
        select.id = attributeObj.name;
        select.required = attributeObj.required;
        select.className = className;
        return select;
    }

    static getOptionWithAttributes(textContent, value, isSelected = false, isDisabled = false){
        const option = document.createElement('option');
        option.textContent = textContent;
        option.value = value;
        option.selected = isSelected;
        option.disabled = isDisabled;
        return option;
    }
}
class FormProgress {
    constructor() {
        this.createProgressElements();
    }

    createProgressElements() {
        const progressDiv = DomElementManager.getDivWithClassName(['form-progress']);
        const progressInfo = DomElementManager.getDivWithClassName(['progress-info']);

        const progressLabel = document.createElement('span');
        progressLabel.className = 'progress-label';
        progressLabel.textContent = 'Form Progress';

        const progressPercentage = document.createElement('span');
        progressPercentage.className = 'progress-percentage';
        progressPercentage.textContent = '0%';

        const progressBarContainer = DomElementManager.getDivWithClassName(['progress-bar-container']);

        const progressBar = DomElementManager.getDivWithClassName(['progress-bar']);

        progressInfo.append(progressLabel, progressPercentage);
        progressBarContainer.appendChild(progressBar);
        progressDiv.append(progressInfo, progressBarContainer);

        this.progressBar = progressBar;
        this.progressPercentage = progressPercentage;
        this.progressElement = progressDiv;
    }

    calculateProgress(form) {
        if (!form) return 0;

        const formFields = new Set(); 
        let filledFields = 0;

        const allFields = form.querySelectorAll('input, select, textarea');
        // console.log('allFields : ', allFields);
        
        allFields.forEach(field => {
            if(formFields.has(field.name)){
                return;
            }else{
                formFields.add(field.name);
            }
            

            if (field.type === 'radio' || field.type === 'checkbox') {
                const group = form.querySelectorAll(`[name="${field.name}"]`);
                if (Array.from(group).some(input => input.checked)) {
                    filledFields++;
                }
            } else {
                if (field.value.trim() !== '') {
                    filledFields++;
                }
            }
            // console.log('filledFields : ', filledFields);
        });

        // console.log('formFields : ', formFields);
        const totalUniqueFields = formFields.size;
        return totalUniqueFields === 0 ? 0 : Math.round((filledFields / totalUniqueFields) * 100);
    }

    updateProgress(percentage) {
        this.progressBar.style.width = `${percentage}%`;
        this.progressPercentage.textContent = `${percentage}%`;
    }

    getProgressElement() {
        return this.progressElement;
    }
}
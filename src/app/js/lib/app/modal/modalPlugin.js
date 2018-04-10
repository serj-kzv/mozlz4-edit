class ModalPlugin {
    constructor(modalOpenBtnId, modalId) {
        this.isOpened = false;
        this.openModalFunc = modal => {
            if (!this.isOpened) {
                this.isOpened = true;
                const
                    conf = ModalPlugin.getConf(),
                    closeBtns = Array.from(modal.querySelectorAll(`.${conf.modalCloseBtnClass}`)),
                    closeModalFunc = event => {
                        modal.classList.remove(conf.modalClass);
                        closeBtns.forEach(closeBtn => closeBtn.removeEventListener('click', closeModalFunc, true));
                        modal.removeEventListener('click', closeModalFunc, true);
                        this.isOpened = false;
                    };

                closeBtns.forEach(closeBtn => closeBtn.addEventListener('click', closeModalFunc, true));
                modal.addEventListener('click', closeModalFunc, true);
                modal.classList.add(conf.modalClass);
            }
        };
        this.init(modalOpenBtnId, modalId);
    }

    init(modalOpenBtnId, modalId) {
        const
            modalBtn = document.querySelector(`#${modalOpenBtnId}`),
            modal = document.querySelector(`#${modalId}`);

        modalBtn.addEventListener('click', event => {
            this.openModalFunc(modal);
        }, true);
    }

    static getConf() {
        return {
            modalClass: 'modal',
            modalContentClass: 'modal-content',
            modalCloseBtnClass: 'modal-cls-btn'
        };
    }
}
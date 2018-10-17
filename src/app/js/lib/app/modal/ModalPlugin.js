export default class ModalPlugin {
    constructor(openBtnSelector, modalId, options) {
        this.options = options;
        this.isOpened = false;
        this.openModalFn = null;
        this.CFG = ModalPlugin.getCfg();
        this.init(openBtnSelector, modalId);
    }

    init(openBtnSelector, modalId) {
        this.initOpenModalFn();
        this.initOpenModal(openBtnSelector, modalId);
    }

    initOpenModalFn() {
        this.openModalFn = modal => {
            if (!this.isOpened) {
                this.isOpened = true;

                const
                    closeBtns = Array.from(modal.querySelectorAll(`.${this.CFG.modalCloseBtnClass}`)),
                    closeModalFn = event => {
                        const target = event.target;

                        if (modal === target || closeBtns.some(closeBtn => closeBtn === target)) {
                            modal.classList.remove(this.CFG.modalClass);
                            modal.removeEventListener('click', closeModalFn);
                            this.isOpened = false;
                            this.options.onClose(this);
                        }
                    };

                modal.addEventListener('click', closeModalFn);
                modal.classList.add(this.CFG.modalClass);
            }
        };
    }

    initOpenModal(openBtnSelector, modalId) {
        const
            modalBtns = document.querySelectorAll(`#${openBtnSelector}`),
            modal = document.querySelector(`#${modalId}`);

        modalBtns.forEach(modalBtn => modalBtn.addEventListener('click', evt => this.openModalFn(modal)));
    }

    static getCfg() {
        return Object.freeze({
            modalClass: 'modal',
            modalContentClass: 'modal-content',
            modalCloseBtnClass: 'modal-cls-btn'
        });
    }
}
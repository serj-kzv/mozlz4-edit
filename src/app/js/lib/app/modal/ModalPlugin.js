export default class ModalPlugin {
    constructor(openBtnSelector, modalId) {
        this.isOpened = false;
        this.openModalFunc = null;
        this.init(openBtnSelector, modalId);
    }

    init(openBtnSelector, modalId) {
        this.initOpenModalFunc();
        this.initOpenModal(openBtnSelector, modalId);
    }

    initOpenModalFunc() {
        this.openModalFunc = modal => {
            if (!this.isOpened) {
                this.isOpened = true;

                const
                    conf = ModalPlugin.getConf(),
                    closeBtns = Array.from(modal.querySelectorAll(`.${conf.modalCloseBtnClass}`)),
                    closeModalFunc = event => {
                        const target = event.target;

                        if (modal === target || closeBtns.some(closeBtn => closeBtn === target)) {
                            modal.classList.remove(conf.modalClass);
                            modal.removeEventListener('click', closeModalFunc);
                            this.isOpened = false;
                        }
                    };

                modal.addEventListener('click', closeModalFunc);
                modal.classList.add(conf.modalClass);
            }
        };
    }

    initOpenModal(openBtnSelector, modalId) {
        const
            modalBtns = document.querySelectorAll(`#${openBtnSelector}`),
            modal = document.querySelector(`#${modalId}`);

        modalBtns.forEach(modalBtn => modalBtn.addEventListener('click', event => this.openModalFunc(modal)));
    }

    static getConf() {
        return Object.freeze({
            modalClass: 'modal',
            modalContentClass: 'modal-content',
            modalCloseBtnClass: 'modal-cls-btn'
        });
    }
}
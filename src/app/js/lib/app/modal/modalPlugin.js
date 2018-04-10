(function () {
    const
        conf = Object.freeze({
            modalClass: 'modal',
            modalCloseBtnClass: 'modal-cls-btn'
        }),
        openModal = modal => {
            modal.classList.add(conf.modalClass);

            const
                closeBtns = Array.from(modal.querySelectorAll(`.${conf.modalCloseBtnClass}`)),
                closeModal = event => {
                    closeBtns.forEach(closeBtn => {
                        closeBtn.removeEventListener('click', closeModal);
                        modal.classList.remove(conf.modalClass);
                    });
                };

            closeBtns.forEach(closeBtn => closeBtn.addEventListener('click', closeModal));
        };

    window.modalPlugin = (modalOpenBtnId, modalId) => {
        const modalBtn = document.querySelector(`#${modalOpenBtnId}`);
        const modal = document.querySelector(`#${modalId}`);

        modalBtn.addEventListener('click', event => {
            openModal(modal);
        });
    };
})();
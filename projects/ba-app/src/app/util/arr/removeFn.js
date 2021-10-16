const removeFn = (arr, el) => {
    const idx = arr.indexOf(el);

    if (idx > -1) {
        arr.splice(idx, 1);
    }
};

export default removeFn;
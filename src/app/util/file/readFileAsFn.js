const readFileAsFn = (file, converterName) => new Promise(resolve => {
        const fileReader = new FileReader();

        fileReader.addEventListener('loadend', event => resolve(event.target.result));
        fileReader[converterName](file);
});

export default readFileAsFn;

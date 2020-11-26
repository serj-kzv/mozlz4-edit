const isEqualFn = (file1, file2) => {
    return file1.length === file2.length ? !file1.some((byte, index) => byte !== file2[index]) : false;
};

export default isEqualFn;

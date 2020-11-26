import openAsDataFn from "./openAsDataFn";

const openAsJsonFn = async (content) => {
    return await openAsDataFn(content, 'application/json', null, null);
};

export default openAsJsonFn;

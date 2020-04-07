interface IPost {
    createPost: (accountId: string, numImg: number, postContent: string) => {}
    updatePost: (postId: number, postContent: string) => {};
    deletePost: (postId: number, haveImgs: boolean, haveInteract: boolean) => {};
    createMultiImgs: (values: Array<string[]>) => {};
    firstImgs: () => {};
    getImgs: (postId: string) => {};
    joinLikes: () => {};
    getPosts: (startIndex: number, limit: number) => {};
    createInteract: (postId: string, accountId: string, fullName: string) => {}
    deleteInteract: (postId: string, accountId: string) => {}
    countInteract: () => {};
    getInteracts: (postId: string) => {};
};

export default IPost;
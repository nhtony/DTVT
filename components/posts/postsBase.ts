interface IPost {
    createPost: (accountId: string, numImg: number, postContent: string) => {}
    updatePost: (postId: number, postContent: string) => {};
    deletePost: (postId: number, haveImgs: boolean, haveInteract: boolean) => {};
    createMultiImgs: (values: Array<string[]>) => {};
    createDestination: (values: Array<string[]>) => {};
    firstImgs: () => {};
    getImgs: (postId: string) => {};
    joinLikes: () => {};
    getPosts: (startIndex: number, limit: number) => {};
    createInteract: (postId: string, accountId: string) => {}
    deleteInteract: (postId: string, accountId: string) => {}
    countInteract: () => {};
};

export default IPost;
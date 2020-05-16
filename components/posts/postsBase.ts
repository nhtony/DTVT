interface IPost {
    createPost: (accountId: string, numImg: number, postContent: string, postType: number) => {}
    updatePost: (postId: number, postContent: string) => {};
    deletePost: (postId: number, haveImgs: boolean, haveInteract: boolean, table: string) => {};
    createMultiImgs: (values: Array<string[]>) => {};
    createDestination: (values: Array<string[]>, table: string) => {};
    firstImgs: () => {};
    getImgs: (postId: string) => {};
    joinLikes: () => {};
    getPosts: (query: string, startIndex: number, limit: number) => {};
    createInteract: (postId: string, accountId: string) => {}
    deleteInteract: (postId: string, accountId: string) => {}
    countInteract: () => {};
};

export default IPost;
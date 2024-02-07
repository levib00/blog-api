Comment Routes

Get All Comments

    URL: https://levib00-blog-api.adaptable.app/comments/
    Method: GET
    Description: Retrieves all comments.
    Middleware: None
    Controller: commentController.AllCommentsGet

Get Comments by Post ID

    URL: https://levib00-blog-api.adaptable.app/comments/:postId
    Method: GET
    Description: Retrieves comments associated with a specific post.
    Middleware: None
    Controller: commentController.PostPageCommentsGet

Get Comment by ID

    URL: https://levib00-blog-api.adaptable.app/comments/:commentId
    Method: GET
    Description: Retrieves a specific comment by its ID.
    Middleware: None
    Controller: commentController.CommentGet

Create a Comment

    URL: https://levib00-blog-api.adaptable.app/comments/
    Method: POST
    Description: Creates a new comment.
    Middleware: None
    Controller: commentController.CommentPost

Delete a Comment

    URL: https://levib00-blog-api.adaptable.app/comments/:commentId/delete
    Method: DELETE
    Description: Deletes a comment by its ID.
    Middleware: verifyToken
    Controller: commentController.CommentDelete

Post Routes

Get All Posts

    URL: https://levib00-blog-api.adaptable.app/posts/
    Method: GET
    Description: Retrieves all posts.
    Middleware: verifyToken
    Controller: postController.AllPostsGet

Get Post by ID

    URL: https://levib00-blog-api.adaptable.app/posts/:postId
    Method: GET
    Description: Retrieves a specific post by its ID.
    Middleware: verifyToken
    Controller: postController.PostGet

Create a Post

    URL: https://levib00-blog-api.adaptable.app/posts/
    Method: POST
    Description: Creates a new post.
    Middleware: verifyToken
    Controller: postController.PostPost

Edit a Post

    URL: https://levib00-blog-api.adaptable.app/posts/:postId/edit
    Method: PUT
    Description: Edits an existing post.
    Middleware: verifyToken
    Controller: postController.editPostPut

Delete a Post

    URL: https://levib00-blog-api.adaptable.app/posts/:postId/delete
    Method: DELETE
    Description: Deletes a post by its ID.
    Middleware: verifyToken
    Controller: postController.PostDelete

Authentication Routes

Log In

    URL: https://levib00-blog-api.adaptable.app/users/log-in
    Method: POST
    Description: Logs in a user and generates a JWT token.
    Middleware: Passport authentication with local strategy
    Controller: Generates a JWT token using jwt.sign

Log Out

    URL: https://levib00-blog-api.adaptable.app/users/log-out
    Method: POST
    Description: Logs out the current user and destroys the session.
    Middleware: None
    Controller: Logs out the user and destroys the session, clearing cookies.
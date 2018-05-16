import {
  ADD_POST,
  GET_POSTS,
  GET_POST,
  ADD_LIKE,
  ADD_DISLIKE,
  ADD_COMMENT,
  DELETE_COMMENT,
  SET_BEST_COMMENT,
  DELETE_POST,
  POST_LOADING
} from '../constants/action-types';

const initialState = {
  posts: [],
  post: {},
  loading: false
};

export default (state = initialState, action) => {
  switch (action.type) {
    case POST_LOADING:
      return {
        ...state,
        loading: true
      };
    case GET_POSTS:
      return {
        ...state,
        posts: action.payload,
        loading: false
      };
    case GET_POST:
      return {
        ...state,
        post: action.payload,
        loading: false
      };
    case ADD_LIKE:
      return {
        ...state,
        post: {
          ...state.post,
          likes: state.post.likes.some( like => like.user === action.payload)
                  ? state.post.likes.filter( like => like.user !== action.payload)
                  : [{ user: action.payload }, ...state.post.likes],
          dislikes: state.post.dislikes.some( dislike => dislike.user === action.payload)
                    ? state.post.dislikes.filter( dislike => dislike.user !== action.payload)
                    : state.post.dislikes,
        },
      };
    case ADD_DISLIKE:
      return {
        ...state,
        post: {
          ...state.post,
          likes: state.post.likes.some( like => like.user === action.payload)
                    ? state.post.likes.filter( like => like.user !== action.payload)
                    : state.post.likes,
          dislikes: state.post.dislikes.some( dislike => dislike.user === action.payload)
                    ? state.post.dislikes.filter( dislike => dislike.user !== action.payload)
                    : [{ user: action.payload }, ...state.post.dislikes],
        },
      };
    case ADD_COMMENT:
      return {
        ...state,
        post: {
          ...state.post,
          comments: [action.payload, ...state.post.comments]
        }
      };
    case DELETE_COMMENT:
      return {
        ...state,
        post: {
          ...state.post,
          comments: state.post.comments.filter( comment => comment._id !== action.payload)
        }
      };
    case SET_BEST_COMMENT:
      return {
        ...state,
        post: {
          ...state.post,
          comments: state.post.comments.map( comment => {
            if(comment._id === action.payload) {
              comment.best = comment.best ? false : true;
              return comment;
            }
            comment.best = false;
            return comment;
          })
        }
      }
    case ADD_POST:
      return {
        ...state,
        posts: [action.payload, ...state.posts]
      };
    case DELETE_POST:
      return {
        ...state,
        posts: state.posts.filter(post => post._id !== action.payload)
      };
    default:
      return state;
  }
}

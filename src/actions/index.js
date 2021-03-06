import axios from 'axios';
import { browserHistory } from 'react-router';

export const ActionTypes = {
  FETCH_POSTS: 'FETCH_POSTS',
  FETCH_POST: 'FETCH_POST',
  CREATE_POST: 'CREATE_POST',
  UPDATE_POST: 'UPDATE_POST',
  DELETE_POST: 'DELETE_POST',
  FETCH_MESSAGES: 'FETCH_MESSAGES',
  FETCH_MESSAGE: 'FETCH_MESSAGE',
  CREATE_MESSAGE: 'CREATE_MESSAGE',
  UPDATE_MESSAGE: 'UPDATE_MESSAGE',
  DELETE_MESSAGE: 'DELETE_MESSAGE',
  AUTH_USER: 'AUTH_USER',
  DEAUTH_USER: 'DEAUTH_USER',
  AUTH_ERROR: 'AUTH_ERROR',
  FETCH_USER: 'FETCH_USER',
  FETCH_AUTHOR: 'FETCH_AUTHOR',
  ERROR_MESSAGE: 'ERROR_MESSAGE',
  FETCH_MESSAGE_ERROR: 'FETCH_MESSAGE_ERROR',
};

const ROOT_URL = 'https://digup.herokuapp.com/api';
// const ROOT_URL = 'http://localhost:9090/api';

export function errorMessage(error) {
  return (dispatch) => {
    dispatch({ type: ActionTypes.ERROR_MESSAGE, message: error });
    browserHistory.push('/error');
  };
}

export function fetchPosts() {
  return (dispatch) => {
    axios.get(`${ROOT_URL}/posts`).then(response => {
      dispatch({ type: ActionTypes.FETCH_POSTS, posts: response.data });
    }).catch(error => {
      console.log(error.response);
    });
  };
}

export function createPost(post) {
  return (dispatch) => {
    axios.post(`${ROOT_URL}/posts`, post, { headers: { authorization: localStorage.getItem('token') } })
    .then(response => {
      dispatch({ type: ActionTypes.CREATE_POST, payload: { post } });
      browserHistory.push('/');
    }).catch(error => {
      dispatch(errorMessage(`Error creating post: ${error.response}`));
    });
  };
}

export function fetchPost(id) {
  return (dispatch) => {
    axios.get(`${ROOT_URL}/posts/${id}`).then(response => {
      dispatch({ type: ActionTypes.FETCH_POST, post: response.data });
    }).catch(error => {
      dispatch(errorMessage(`Error fetching post: ${error.response}`));
    });
  };
}

export function updatePost(post, id) {
  return (dispatch) => {
    const fields = { title: post.title, content: post.content, tags: post.tags };
    axios.put(`${ROOT_URL}/posts/${id}`, fields, { headers: { authorization: localStorage.getItem('token') } })
    .then(response => {
      dispatch(fetchPost(id));
    }).catch(error => {
      dispatch(errorMessage(`Error updating post: ${error.response}`));
    });
  };
}

export function deletePost(id) {
  return (dispatch) => {
    axios.delete(`${ROOT_URL}/posts/${id}`, { headers: { authorization: localStorage.getItem('token') } })
    .then(response => {
      dispatch({ type: ActionTypes.DELETE_POST, payload: null });
      browserHistory.push('/');
    }).catch(error => {
      dispatch(errorMessage(`Error deleting post: ${error.response}`));
    });
  };
}

export function fetchMessages() {
  return (dispatch) => {
    axios.get(`${ROOT_URL}/messages`).then(response => {
      dispatch({ type: ActionTypes.FETCH_MESSAGES, messages: response.data });
    }).catch(error => {
      console.log(error.response);
    });
  };
}

export function createMessage(message) {
  return (dispatch) => {
    axios.post(`${ROOT_URL}/messages`, message, { headers: { authorization: localStorage.getItem('token') } })
    .then(response => {
      dispatch({ type: ActionTypes.CREATE_MESSAGE, payload: { message } });
      browserHistory.push('/messages');
    }).catch(error => {
      dispatch(errorMessage(`Error creating message: ${error.response}`));
    });
  };
}

export function updateMessage(message, id) {
  return (dispatch) => {
    axios.put(`${ROOT_URL}/messages/${id}`, message, { headers: { authorization: localStorage.getItem('token') } })
    .then(response => {
      dispatch({ type: ActionTypes.FETCH_MESSAGE, message: response.data });
    }).catch(error => {
      dispatch(errorMessage(`Error updating message: ${error.response}`));
    });
  };
}

export function fetchMessage(id) {
  return (dispatch) => {
    axios.get(`${ROOT_URL}/messages/${id}`).then(response => {
      dispatch({ type: ActionTypes.FETCH_MESSAGE, message: response.data });
    }).catch(error => {
      dispatch({ type: ActionTypes.FETCH_MESSAGE_ERROR });
    });
  };
}

export function deleteMessage(id) {
  return (dispatch) => {
    axios.delete(`${ROOT_URL}/messages/${id}`, { headers: { authorization: localStorage.getItem('token') } })
    .then(response => {
      dispatch({ type: ActionTypes.DELETE_MESSAGE, payload: null });
      dispatch(fetchMessages());
    }).catch(error => {
      dispatch(errorMessage(`Error deleting message: ${error.response}`));
    });
  };
}

export function signoutUser() {
  return (dispatch) => {
    localStorage.removeItem('token');
    dispatch({ type: ActionTypes.DEAUTH_USER });
    browserHistory.push('/');
  };
}

export function authError(error) {
  return (dispatch) => {
    dispatch({ type: ActionTypes.AUTH_ERROR });
    dispatch(errorMessage(error));
  };
}

export function signinUser({ email, password }) {
  return (dispatch) => {
    axios.post(`${ROOT_URL}/signin`, { email, password }).then(response => {
      dispatch({ type: ActionTypes.AUTH_USER });
      localStorage.setItem('token', response.data.token);
      browserHistory.push('/');
    }).catch(error => {
      dispatch(authError(`Sign In Failed: ${error.response}`));
    });
  };
}


export function signupUser({ email, password, username, pic }) {
  return (dispatch) => {
    axios.post(`${ROOT_URL}/signup`, { email, password, username, pic }).then(response => {
      dispatch({ type: ActionTypes.AUTH_USER });
      localStorage.setItem('token', response.data.token);
      browserHistory.push('/');
    }).catch(error => {
      dispatch(authError(`Sign Up Failed: ${error.response}`));
    });
  };
}


export function fetchUser() {
  return (dispatch) => {
    axios.get(`${ROOT_URL}/profile`, { headers: { authorization: localStorage.getItem('token') } }).then(response => {
      dispatch({ type: ActionTypes.FETCH_USER, payload: {
        user: response.data,
      } });
    }).catch(error => {
      console.log(error.response);
    });
  };
}

export function fetchAuthor(id) {
  return (dispatch) => {
    axios.get(`${ROOT_URL}/profile/${id}`, { headers: { authorization: localStorage.getItem('token') } }).then(response => {
      dispatch({ type: ActionTypes.FETCH_AUTHOR, payload: {
        author: response.data,
      } });
    }).catch(error => {
      dispatch(errorMessage(`Cannot get author data: ${error.response}`));
    });
  };
}

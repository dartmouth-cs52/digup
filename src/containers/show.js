import React, { Component } from 'react';
import { Link, browserHistory } from 'react-router';
import * as actions from '../actions';
import { connect } from 'react-redux';
import jQuery from 'jquery';

class Show extends Component {
  constructor(props) {
    super(props);

    this.state = {
      editing: false,
      content: '',
      title: '',
      tags: '',
      anonymous: true,
      pictureURL: '',
      data: null,
    };
    this.onTitleChange = this.onTitleChange.bind(this);
    this.onContentChange = this.onContentChange.bind(this);
    this.onTagsChange = this.onTagsChange.bind(this);
    this.onEditChange = this.onEditChange.bind(this);
    this.onDeletion = this.onDeletion.bind(this);
    this.renderAuthor = this.renderAuthor.bind(this);
    this.renderLost = this.renderLost.bind(this);
    this.startConversation = this.startConversation.bind(this);
    this.startAnonymousConversation = this.startAnonymousConversation.bind(this);
    this.contactSwitch = this.contactSwitch.bind(this);

    this.renderClothing = this.renderClothing.bind(this);
    this.renderBike = this.renderBike.bind(this);
    this.renderTechnology = this.renderTechnology.bind(this);
    this.renderOther = this.renderOther.bind(this);
    this.renderTags = this.renderTags.bind(this);
    this.changeBike = this.changeBike.bind(this);
    this.changeTech = this.changeTech.bind(this);
    this.changeOther = this.changeOther.bind(this);
    this.changeClothing = this.changeClothing.bind(this);
  }

  componentWillMount() {
    this.props.fetchPost(this.props.params.id);
    this.props.fetchUser();
    this.props.fetchPosts();
    // this.props.fetchMessages();
  }

  componentWillReceiveProps(nextProps) {
    // console.log('props', nextProps.post);
    if (nextProps.post.key !== '') {
      jQuery.get(nextProps.post.pictureURL, (response) => {
        // console.log('THIS IS THE PHOTO DATA');
        this.setState({ data: response });
      });
    } else {
      this.setState({ data: null });
    }
  }

  onTitleChange(event) {
    this.setState({ title: event.target.value });
  }
  onContentChange(event) {
    this.setState({ content: event.target.value });
  }
  onTagsChange(event) {
    this.setState({ tags: event.target.value });
  }

  onEditChange(event) {
    if (this.state.editing) {
      this.setState({
        editing: false,
      });
      this.props.updatePost(this.state, this.props.params.id);
    } else {
      this.setState({
        editing: true,
        title: this.props.post.title,
        content: this.props.post.content,
        tags: '',
      });
    }
  }

  onDeletion(event) {
    this.props.deletePost(this.props.params.id);
    this.setState({
      content: '',
      title: '',
      tags: '',
    });
  }

  changeClothing() {
    if (this.state.tags !== 'Clothing') {
      this.setState({
        tags: 'Clothing',
      });
    }
  }

  changeBike() {
    if (this.state.tags !== 'Bike') {
      this.setState({
        tags: 'Bike',
      });
    }
  }

  changeTech() {
    if (this.state.tags !== 'Technology') {
      this.setState({
        tags: 'Technology',
      });
    }
  }

  changeOther() {
    if (this.state.tags !== 'Other') {
      this.setState({
        tags: 'Other',
      });
    }
  }

  contactSwitch() {
    if (!this.props.post.anonymous) {
      return <div className="showPostContact" onClick={this.startConversation} > Contact Me! </div>;
    } else {
      return <div className="showPostContact" onClick={this.startAnonymousConversation} > Contact Me (Anonymously)! </div>;
    }
  }

  startAnonymousConversation() {
    let exist = false;
    let count = 0;
    this.props.messages.map(message => {
      if (message.userID === this.props.post.authorId && message.myID === this.props.user.id) {
        count++;
        if (message.anonTitle === `Anonymous: ${this.props.post.title}`) {
          exist = true;
        }
      }
      return undefined;
    });
    if (count > 2) {
      exist = true;
    }
    if (!exist) {
      this.props.createMessage({ userID: this.props.post.authorId, myID: this.props.user.id,
        content: [], user: this.props.post.author, anonymous: true, anonTitle: `Anonymous: ${this.props.post.title}` });
    } else {
      browserHistory.push('/messages');
    }
  }


  startConversation() {
    let exist = false;
    let count = 0;
    this.props.messages.map(message => {
      if (message.userID === this.props.post.authorId && message.myID === this.props.user.id) {
        count++;
        if (message.anonTitle === `${this.props.post.title}`) {
          exist = true;
        }
        if (message.contacted === true) {
          exist = true;
        }
      }
      return undefined;
    });
    if (count > 2) {
      exist = true;
    }
    if (!exist) {
      this.props.createMessage({ userID: this.props.post.authorId, myID: this.props.user.id,
        content: [], user: this.props.post.authorName, anonymous: this.props.post.anonymous, anonTitle: `${this.props.post.title}`, contacted: true });
    } else {
      browserHistory.push('/messages');
    }
  }

  renderAuthor() {
    if (this.props.post.anonymous) {
      return <span> Anonymous </span>;
    } else {
      // console.log(this.props.post.authorName);
      return <Link to={`profile/${this.props.post.authorId}`} className="authorLink">{this.props.post.authorName}</Link>;
    }
  }

  renderLost() {
    if (this.props.post.lost) {
      return <span> lost </span>;
    } else {
      return <span> found </span>;
    }
  }

  renderPhoto() {
    if (this.state.data) {
      return (
        <div className="imagefull">
          <div className="imagebox">
            <img className="image" role="presentation" src={this.state.data} />
          </div>
        </div>
      );
    } else {
      return (
        <div> No photo </div>
      );
    }
  }

  renderClothing() {
    if (this.state.tags === 'Clothing') {
      return (
        <div className="check">
          <div className="checkTitle"> Clothing </div>
          <div className="checkboxDiv">
            <input type="checkbox" value="None" id="clothingCheck" name="check" checked />
            <label htmlFor="clothingCheck" onClick={this.changeClothing}></label>
          </div>
        </div>
      );
    } else {
      return (
        <div className="check">
          <div className="checkTitle"> Clothing </div>
          <div className="checkboxDiv">
            <input type="checkbox" value="None" id="clothingCheck" name="check" />
            <label htmlFor="clothingCheck" onClick={this.changeClothing}></label>
          </div>
        </div>
      );
    }
  }

  renderTechnology() {
    if (this.state.tags === 'Technology') {
      return (
        <div className="check">
          <div className="checkTitle"> Technology </div>
          <div className="checkboxDiv">
            <input type="checkbox" value="None" id="techCheck" name="check" checked />
            <label htmlFor="techCheck" onClick={this.changeTech}></label>
          </div>
        </div>
      );
    } else {
      return (
        <div className="check">
          <div className="checkTitle"> Technology </div>
          <div className="checkboxDiv">
            <input type="checkbox" value="None" id="techCheck" name="check" />
            <label htmlFor="techCheck" onClick={this.changeTech}></label>
          </div>
        </div>
      );
    }
  }

  renderBike() {
    if (this.state.tags === 'Bike') {
      return (
        <div className="check">
          <div className="checkTitle"> Bike </div>
          <div className="checkboxDiv">
            <input type="checkbox" value="None" id="bikeCheck" name="check" checked />
            <label htmlFor="bikeCheck" onClick={this.changeBike}></label>
          </div>
        </div>
      );
    } else {
      return (
        <div className="check">
          <div className="checkTitle"> Bike </div>
          <div className="checkboxDiv">
            <input type="checkbox" value="None" id="bikeCheck" name="check" />
            <label htmlFor="bikeCheck" onClick={this.changeBike}></label>
          </div>
        </div>
      );
    }
  }

  renderOther() {
    if (this.state.tags === 'Other') {
      return (
        <div className="check">
          <div className="checkTitle"> Other </div>
          <div className="checkboxDiv">
            <input type="checkbox" value="None" id="otherCheck" name="check" checked />
            <label htmlFor="otherCheck" onClick={this.changeOther}></label>
          </div>
        </div>
      );
    } else {
      return (
        <div className="check">
          <div className="checkTitle"> Other </div>
          <div className="checkboxDiv">
            <input type="checkbox" value="None" id="otherCheck" name="check" />
            <label htmlFor="otherCheck" onClick={this.changeOther}></label>
          </div>
        </div>
      );
    }
  }

  renderTags() {
    return (
      <div>
        {this.renderClothing()}
        {this.renderBike()}
        {this.renderTechnology()}
        {this.renderOther()}
      </div>
    );
  }


  render() {
    if (this.props.post && this.props.user) {
      // console.log(this.state.tags);
      if (this.props.post.authorId === this.props.user.id) {
        if (this.state.editing) {
          return (
            <div className="showPostContainer">
              <div className="editPostBox">
                <div className="editPostTitle">Title: <input onChange={this.onTitleChange} placeholder="title" value={this.state.title} /> </div>
                <div className="editPostContent">
                  Item Description: <textarea rows="8" cols="24" onChange={this.onContentChange} placeholder="Description" value={this.state.content} />
                </div>
                <div className="editPostContent">Tag:

                  {this.renderTags()}

                </div>
                <button onClick={this.onEditChange} className="doneButton">
                  Done
                </button>
                <button onClick={this.onDeletion} className="deleteButton">
                  Delete Post
                </button>
              </div>
            </div>
          );
        } else {
          return (
            <div className="showPostContainer">
              <div className="showPostBox">
                <div className="showPostTitle">{this.props.post.title}</div>
                <div className="showPostContent">Item Description: {this.props.post.content}</div>
                <div className="showPostContent">Item Tags: {this.props.post.tags}</div>
                <div> {this.renderPhoto()}</div>
                <div className="showPostContent"> {this.renderAuthor()} {this.renderLost()} this item.</div>
                <button onClick={this.onEditChange} className="editButton">
                  Edit
                </button>
                <button onClick={this.onDeletion} className="deleteButton">
                  Delete Post
                </button>
              </div>
            </div>
          );
        }
      } else {
        return (
          <div>
            <div className="showPostContainer">
              <div className="showPostBox">
                <div className="showPostTitle">{this.props.post.title}</div>
                <div className="showPostContent">Item Description: {this.props.post.content}</div>
                <div className="showPostContent">Item Tags: {this.props.post.tags}</div>
                <div> {this.renderPhoto()}</div>
                <div className="showPostContent"> {this.renderAuthor()} {this.renderLost()} this item.</div>
                {this.contactSwitch()}
              </div>
            </div>
          </div>
        );
      }
    } else {
      return (
        <div>
          Loading
        </div>
      );
    }
  }
}

const mapStateToProps = (state) => (
  {
    posts: state.posts.all,
    post: state.posts.post,
    user: state.profile.user,
    messages: state.messages.all,
  }
);

export default connect(mapStateToProps, actions)(Show);

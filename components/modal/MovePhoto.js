import $ from 'jquery';

import React, { Component } from 'react';
import siiimpleToast from 'siiimple-toast';
import { ajax } from '../Sub';

class MovePhoto extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selected_album: 0,
    };
  }
  beforeSubmit(e) {
    const val = $(e.target).val();
    this.setState({ selected_album: val });
  }
  handleSubmit(e) {
    e.preventDefault();

    const arr = $(e.target).find('input').val();

    if (arr === '') {
      new siiimpleToast().alert('사진이 선택되지 않았습니다');
      return;
    }

    ajax({
      url: `/photos/${arr}?a_idx=${this.state.selected_album}`,
      method: 'PUT',
      _callback: (response) => {
        new siiimpleToast().message(response);
        this.props.closeModal();
        this.props.updateData();
      },
    });
  }
  render() {
    return (
      <div id="movePhoto_Modal" className={this.props.status === true ? 'modal active' : 'modal'}>
        <form
          className={this.props.status === true ? 'modal-content active' : 'modal-content'}
          onSubmit={this.handleSubmit.bind(this)}
        >
          <span
            className="modal-close"
            onClick={this.props.closeModal}
          ><i className="material-icons">close</i></span>
          <h2 className="modal-header">
            {this.props.img ? <img src={this.props.img} alt="moveImage" /> : ''}{this.props.text}
          </h2>
          <input type="hidden" name="photo_arr" value={this.props.input} required />
          <div className="modal-scroll-content scroll_y">
            {this.props.data.map((data, i) => {
              const bgImage = {
                backgroundImage: `url(${data.src})`,
              };
              return (
                <div
                  key={i}
                  className="modal-scroll-content-album"
                  style={bgImage}
                >
                  <span className="title">{this.props.data[i].album.title}</span>
                  <span className="date">{this.props.data[i].album.date}</span>
                  <span className="info"><i className="material-icons">camera_alt</i>{this.props.data[i].album.info}</span>
                  <div className="move_photo_hover_div">
                    <button
                      className="btn ghost"
                      name="selected"
                      type="submit"
                      value={this.props.data[i].idx}
                      onClick={this.beforeSubmit.bind(this)}
                    >이 앨범으로 이동</button>
                  </div>
                </div>);
            })}
          </div>
        </form>
      </div>
    );
  }
}
export default MovePhoto;

import $ from 'jquery';

import React, { Component } from 'react';
import autoBind from 'react-autobind';

import Header from './Header';
import Cards from './Cards';
import CardsController from './CardsController';

//사진
import MovePhoto from './modal/MovePhoto';
import RemovePhoto from './modal/RemovePhoto';
import AddPhoto from './modal/AddPhoto';

//앨범
import CreateAlbum from './modal/CreateAlbum';
import ModifyAlbum from './modal/ModifyAlbum';

//삭제된 파일
import DeletedPhotos from './modal/DeletedPhotos';

//이미지 원본 모달
import ImageModal from './modal/ImageModal';

import { CardsControl_Action, Slider, ajax } from './Sub';

import siiimpleToast from 'siiimple-toast';

class Main_Page extends Component {
  constructor(props) {
    super(props);
    autoBind(this);
    this.state = {
      CreateAlbum: false,
      ModifyAlbum: false,
      AddPhoto: false,

      MovePhoto: false,
      MovePhoto_Data: [],
      MovePhoto_Input: "",
      MovePhoto_Img: "",
      MovePhoto_Text: "",

      RemovePhoto: false,
      RemovePhoto_Input: "",
      RemovePhoto_Img: "",
      RemovePhoto_Text: "",

      ImageModal: false,
      ImageModal_src: "",

      DeletedPhotos: false,
      DeletedPhotos_Data: [],

      selectedCardsNum: 0
    };
    this.toast = new siiimpleToast();
  }
  updateData() {
    const $chkbox = $('.custom_checkbox');
    $chkbox.prop("checked", false);
    $chkbox.parents('.card').removeClass('selected');
    $chkbox.parents('.checkbox').removeClass('active');

    let checked = CardsControl_Action();

    this.CardsCheckedChange(checked);

    this.props.updateData();
  }
  selectAll_on(num) {
    this.setState({ selectedCardsNum: num });
  }
  selectAll_off(num) {
    this.setState({ selectedCardsNum: num });
  }
  CardsCheckedChange(num) {
    this.setState({ selectedCardsNum: num });
  }
  open_MovePhoto() {
    let src = '',
      arr = [],
      text = '';

    $('.custom_checkbox').each(function () {
      if ($(this).prop('checked') == true) {
        arr.push($(this).val());
        src = $(this).parents('.card').find('img').attr('src');
      }
    });

    ajax({
      url: '/albums',
      dataType: "json",
      _callback: (response) => {
        response = JSON.parse(JSON.stringify(response));

        text = arr.length > 1 ? "외 " + (arr.length - 1) + "개 사진 이동" : "사진 이동";

        this.setState({
          MovePhoto_Data: response,
          MovePhoto_Input: arr.toString(),
          MovePhoto_Img: src,
          MovePhoto_Text: text,
          MovePhoto: true
        });
      }
    });
  }
  open_RemovePhoto() {
    let src = '',
      arr = [],
      text = '';

    $('.custom_checkbox').each(function () {
      if ($(this).prop('checked') == true) {
        arr.push($(this).val());
        src = $(this).parents('.card').find('img').attr('src');
      }
    });

    if (arr.length > 1) {
      text = "외 " + (arr.length - 1) + "개 사진 삭제";
    }
    else {
      text = "사진 삭제";
    }

    this.setState({
      RemovePhoto_Input: arr.toString(),
      RemovePhoto_Img: src,
      RemovePhoto_Text: text,
      RemovePhoto: true
    });
  }
  //이미지modal
  next() {
    let src = Slider(this.state.ImageModal_src, "next");

    this.setState({ ImageModal_src: src });
  }
  prev() {
    let src = Slider(this.state.ImageModal_src, "prev");

    this.setState({ ImageModal_src: src });
  }
  showImageModal(e) {
    let src = $(e.target).attr('src');

    this.setState({
      ImageModal: true,
      ImageModal_src: src
    });
  }
  show_createAlbum() {
    this.setState({ CreateAlbum: true });
  }
  show_modifyAlbum() {
    this.setState({ ModifyAlbum: true });
  }
  show_addPhoto() {
    this.setState({ AddPhoto: true });
  }
  show_deletedPhotos() {
    ajax({
      url: '/deleted-photos',
      dataType: "json",
      _callback: (response) => {
        response = JSON.parse(JSON.stringify(response));

        this.setState({
          DeletedPhotos: true,
          DeletedPhotos_Data: response
        });
      }
    });
  }
  closeModal(e) {
    if (e)
      e.preventDefault();

    this.setState({
      CreateAlbum: false,
      ModifyAlbum: false,
      AddPhoto: false,

      MovePhoto: false,
      MovePhoto_Data: [],
      MovePhoto_Input: "",
      MovePhoto_Img: "",
      MovePhoto_Text: "",

      RemovePhoto: false,
      RemovePhoto_Input: "",
      RemovePhoto_Img: "",
      RemovePhoto_Text: "",

      ImageModal: false,
      ImageModal_src: "",

      DeletedPhotos: false,
      DeletedPhotos_Data: []
    });
  }
  render() {
    return (
      <section id="main_section" style={this.props.style}>
        <Header
          title={this.props.title}
          photos={this.props.photos}
          albums={this.props.albums}
          type={this.props.type}
          gridChange={this.props.gridChange}
          goToHome={this.props.goToHome}
          show_deletedPhotos={this.show_deletedPhotos}
          show_createAlbum={this.show_createAlbum}
          show_modifyAlbum={this.show_modifyAlbum}
          show_addPhoto={this.show_addPhoto}
        />

        <Cards
          data={this.props.data}
          grid={this.props.grid}
          move={this.props.move}
          CardsCheckedChange={this.CardsCheckedChange}
          showImageModal={this.showImageModal}
        />

        <CardsController
          selectAll_on={this.selectAll_on}
          selectAll_off={this.selectAll_off}
          selectedCardsNum={this.state.selectedCardsNum}
          open_MovePhoto={this.open_MovePhoto}
          open_RemovePhoto={this.open_RemovePhoto}
        />

        <RemovePhoto
          status={this.state.RemovePhoto}
          img={this.state.RemovePhoto_Img}
          text={this.state.RemovePhoto_Text}
          input={this.state.RemovePhoto_Input}
          updateData={this.updateData}
          closeModal={this.closeModal}
        />

        <MovePhoto
          status={this.state.MovePhoto}
          data={this.state.MovePhoto_Data}
          img={this.state.MovePhoto_Img}
          input={this.state.MovePhoto_Input}
          text={this.state.MovePhoto_Text}
          updateData={this.updateData}
          closeModal={this.closeModal}
        />

        <CreateAlbum
          status={this.state.CreateAlbum}
          updateData={this.updateData}
          closeModal={this.closeModal}
        />

        <ModifyAlbum
          status={this.state.ModifyAlbum}
          currentAlbumName={this.props.title}
          updateData={this.updateData}
          closeModal={this.closeModal}
        />

        <AddPhoto
          status={this.state.AddPhoto}
          updateData={this.updateData}
          closeModal={this.closeModal}
        />

        <DeletedPhotos
          status={this.state.DeletedPhotos}
          data={this.state.DeletedPhotos_Data}
          updateData={this.updateData}
          closeModal={this.closeModal}
        />

        <ImageModal
          status={this.state.ImageModal}
          src={this.state.ImageModal_src}
          next={this.next}
          prev={this.prev}
          close={this.closeModal}
        />
      </section>
    );
  }
}

export default Main_Page;
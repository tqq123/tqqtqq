var postsData = require('../../data/post-data.js');

Page({
  data: {

  },

  onLoad: function (options) {
    // 生命周期函数--监听页面加载

    this.setData({
      post_key: postsData.postlist
    })
  },

  onPostTap: function (event) {
    var postId = event.currentTarget.dataset.postid;
    wx.navigateTo({
      url: 'post-detail/post-detail?id=' + postId
    })
  },

  onSwiperTap: function(event){
    //target指当前点击组件：image,   currentTarget指事件捕获的组件:swiper
    var postId = event.target.dataset.postid;
    wx.navigateTo({
      url: 'post-detail/post-detail?id=' + postId
    })
  }
})
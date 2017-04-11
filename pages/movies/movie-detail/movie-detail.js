var app = getApp();
import { Movie } from 'class/Movie.js';
//var util = require('../../../utils/util.js');
Page({
  data: {
    movie: {}
  },
  onLoad: function (options) {
    //var self = this;
    var movieId = options.id;
    var url = app.globalData.doubanBase + "/v2/movie/subject/" + movieId;
    var movie = new Movie(url);
    movie.getMovieData((movie) => {
      this.setData({
        movie: movie
      })
    })
    // movie.getMovieData(function (movie) {
    //   self.setData({
    //     movie: movie
    //   })
    // })
    //util.http(url, this.processDoubanData);
  },


  // 获取豆瓣数据
  // processDoubanData: function(data) {
  //   if (!data) {
  //     return;
  //   }
  //   var director = {
  //     avatar: "",
  //     name: "",
  //     id: ""
  //   }
  //   if (data.directors[0] != null) {
  //     if (data.directors[0].avatars != null) {
  //       director.avatar = data.directors[0].avatars.large;
  //     }
  //     director.name = data.directors[0].name;
  //     director.id = data.directors[0].id;
  //   }
  //   var movie = {
  //     movieImg: data.images ? data.images.large : "",
  //     country: data.countries[0],
  //     title: data.title,
  //     orginalTitle: data.original_title,
  //     wishCount: data.wish_count,
  //     commentCount: data.comments_count,
  //     year: data.year,
  //     generes: data.genres.join("、"),
  //     stars: util.convertToStarsArray(data.rating.stars),
  //     score: data.rating.average,
  //     director: director,
  //     casts: util.convertToCastString(data.casts),
  //     castsInfo: util.convertToCastInfos(data.casts),
  //     summary: data.summary
  //   }
  //   this.setData({
  //     movie: movie
  //   })
  // },

  //查看图片
  viewMoviePostImg: function (e) {
    var src = e.currentTarget.dataset.src;
    wx.previewImage({
      current: src, // 当前显示图片的链接，不填则默认为 urls 的第一张
      urls: [src]
    })
  }
})
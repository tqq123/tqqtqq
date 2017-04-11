var postsData = require('../../../data/post-data.js');
var app = getApp();
Page({
    data: {
        isPlayingMusic: false
    },
    onLoad: function (options) {
        var postId = options.id;
        var postData = postsData.postlist[postId];
        this.setData({
            postData: postData,
            currentPostId: postId
        });

        var postsCollected = wx.getStorageSync('posts_collected');
        if (postsCollected) {
            var postCollected = postsCollected[postId];
            this.setData({
                collected: postCollected
            })
        }
        else {
            var postsCollected = {};
            postsCollected[postId] = false;
            wx.setStorageSync('posts_collected', postsCollected);
        }

        
        if(app.globalData.g_isPlayingMusic && app.globalData.g_currentMusicPostId === postId){
            this.setData({
                isPlayingMusic : true
            })
        }
        this.setMusicMonitor();         
    },

    setMusicMonitor: function(){
        var self = this;
        wx.onBackgroundAudioPlay(function() {
            self.setData({
                isPlayingMusic: true
            }) 
            app.globalData.g_isPlayingMusic = true;
            app.globalData.g_currentMusicPostId = self.data.currentPostId;
        });
        wx.onBackgroundAudioPause(function() {
            self.setData({
                isPlayingMusic: false
            })
            app.globalData.g_isPlayingMusic = false; 
            app.globalData.g_currentMusicPostId = null;
        });
        wx.onBackgroundAudioStop(function() {
            self.setData({
                isPlayingMusic: false
            })
            app.globalData.g_isPlayingMusic = false; 
            app.globalData.g_currentMusicPostId = null;
        });

    },

    onCollectionTap: function (event) {
        //同步
        this.getPostsCollectedSyc();
        //异步
        //this.getPostsCollectedAsy();
    },

    getPostsCollectedAsy: function () {
        var self = this;
        wx.getStorage({
            key: 'posts_collected',
            success: function (res) {
                var postsCollected = res.data;
                var postCollected = postsCollected[self.data.currentPostId];
                //更新收藏状态
                postCollected = !postCollected;
                postsCollected[self.data.currentPostId] = postCollected;
                self.showToast(postsCollected, postCollected);
            }
        })
    },

    getPostsCollectedSyc: function () {
        var postsCollected = wx.getStorageSync('posts_collected');
        var postCollected = postsCollected[this.data.currentPostId];
        //更新收藏状态
        postCollected = !postCollected;
        postsCollected[this.data.currentPostId] = postCollected;
        this.showToast(postsCollected, postCollected);
    },

    showToast: function (postsCollected, postCollected) {
        var self = this;
        //更新文章缓存
        wx.setStorageSync('posts_collected', postsCollected);
        //更新数据，切换图片
        self.setData({
            collected: postCollected
        })
        wx.showToast({
            title: postCollected ? "收藏成功" : "取消收藏",
            duration: 1000,
            icon: "success"
        })
    },

    showModal: function (postsCollected, postCollected) {
        var self = this;
        wx.showModal({
            title: "收藏",
            content: postCollected ? "收藏该文章?" : "取消收藏?",
            showCancel: "true",
            cancelText: "取消",
            cancelColor: "#333",
            confirmText: "确认",
            confirmColor: "#405f80",
            success: function (res) {
                if (res.confirm) {
                    //更新文章缓存
                    wx.setStorageSync('posts_collected', postsCollected);
                    //更新数据，切换图片
                    self.setData({
                        collected: postCollected
                    })
                }
            }
        })
    },

    onShareTap: function (event) {
        var itemList = [
            "分享给微信好友",
            "分享到朋友圈",
            "分享到QQ",
            "分享到微博"
        ];
        wx.showActionSheet({
            itemList: itemList,
            itemColor: "#405f80",
            success: function (res) {
                wx.showModal({
                    title: "用户" + itemList[res.tapIndex],
                    content: "用户是否取消" + res.cancel
                })
            }
        })
    },

    onMusicTap: function (event) {
        var currentPostId = this.data.currentPostId;
        var postData = postsData.postlist[currentPostId];
        var isPlayingMusic = this.data.isPlayingMusic;
        if (isPlayingMusic) {
            wx.pauseBackgroundAudio();
            this.setData({
                isPlayingMusic: false
            })
        }
        else {
            wx.playBackgroundAudio({
                dataUrl: postData.music.url,
                title: postData.music.title,
                coverImgUrl: postData.music.coverImg
            })
            this.setData({
                isPlayingMusic: true
            })
        }
    }
})
import Vue from 'vue';

let store = {
    debug: true,
    state: {
        isMobile: false,
        windowSize: {
            x: 0,
            y: 0,
        },
        scrollTop: 0,
        user: {},
        layoutRatio: {
            xs: [0, 12, 0, 0,],
            sm: [0, 12, 0, 0,],
            md: [1, 7, 3, 1,],
            lg: [2, 5, 3, 2,],
            xl: [3, 4, 2, 3,],
        },
        config:{
            defaultHeadBgUrl : "https://source.unsplash.com/random/1920x1080",
            indexHeadBgUrl:"https://s1.ax2x.com/2018/09/29/5Hec0y.png",
            blogHeadBgUrl:undefined,
            archiveHeadBgUrl:undefined,
            musicHeadBgUrl:undefined,
            messageHeadBgUrl:undefined,
        },
        headBgUrl:"",
    },

    setIsMobile(newValue) {
        if (this.debug) console.log('setIsMobileAction triggered with', newValue);
        this.state.isMobile = newValue;
    },
    getIsMobile() {
        if (this.debug) console.log('getIsMobile triggered');
        return this.state.isMobile;
    },

    setWindowSize(newValue) {
        if (this.debug) console.log('setWindowSize triggered with', newValue);
        this.state.windowSize = newValue;
    },
    getWindowSize() {
        if (this.debug) console.log('getIsMobile triggered');
        return this.state.windowSize;
    },

    setScrollTop(newValue) {
        if (this.debug) console.log('setScrollTop triggered with', newValue);
        this.state.scrollTop = newValue;
    },
    getScrollTop() {
        if (this.debug) console.log('getScrollTop triggered');
        return this.state.scrollTop;
    },

    setUser(newValue) {
        if (this.debug) console.log('setUser triggered with', newValue);
        this.state.user = newValue;
    },
    getUser() {
        if (this.debug) console.log('getUser triggered');
        return this.state.user;
    },

    setLayoutRatio(newValue) {
        if (this.debug) console.log('setLayoutRatio triggered with', newValue);
        this.state.layoutRatio = newValue;
    },
    getLayoutRatio() {
        if (this.debug) console.log('getLayoutRatio triggered');
        return this.state.layoutRatio;
    },

    getConfig() {
        if (this.debug) console.log('getConfig triggered');
        return this.state.config;
    },

    setHeadBgUrl(newValue) {
        if (this.debug) console.log('setHeadBgUrl triggered with', newValue);
        this.state.headBgUrl = newValue;
    },
    getHeadBgUrl() {
        if (this.debug) console.log('getHeadBgUrl triggered');
        return this.state.headBgUrl;
    },
};

Vue.prototype.$store = store;

export default store;
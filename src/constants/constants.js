export const constants = {
    vuexLocalStorage: {
        key: 'ls',
    },
    defaultCoverArt: '/static/img/no-coverart.jpg',
    cookies: {
        auth: {
            name: 'ls',
            expires: 1 / 3, // One third of a day (8 hrs)
        },
        pendingUser: {
            name: 'pendingUser',
            expires: 1 / 3,
        },
    },
    links: {
        image: {
            aspectRatio: 1,
        },
    },
    visibilities: {
        public: 1,
        private: 2,
    },
    tracks: {
        types: {
            song: 1,
            beat: 2,
            soundKit: 3,
        },
    },
    user: {
        profileBannerAspectRatio: 0.254364,
        account: {
            videosPerPage: 20,
            menuHiddenBreakpoint: 992,
        },
    },
    marketingOptions: [
        {
            id: '1',
            title: 'Follow on LinkStream',
            icon: 'streamy',
        },
        {
            id: '2',
            title: 'Follow on SoundCloud',
            icon: 'soundcloud',
        },
        {
            id: '3',
            title: 'Follow on Twitter',
            icon: 'twitter',
        },
        {
            id: '4',
            title: 'Follow on Instagram',
            icon: 'ig',
        },
        {
            id: '5',
            title: 'Subscribe to SMS',
            icon: 'envelope-open',
        },
        {
            id: '6',
            title: 'Subscribe to Emails',
            icon: 'envelope-open',
        },
    ],
}

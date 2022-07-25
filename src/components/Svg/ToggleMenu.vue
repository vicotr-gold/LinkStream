<template>
    <fragment>
        <svg
            v-if="isHidden"
            width="18px"
            height="16px"
            viewBox="0 0 18 16"
            version="1.1"
            xmlns="http://www.w3.org/2000/svg"
            xmlns:xlink="http://www.w3.org/1999/xlink"
        >
            <defs>
                <path
                    d="M0.875,3.15625 L17.125,3.15625 C17.4701953,3.15625 17.75,2.87644531 17.75,2.53125 L17.75,0.96875 C17.75,0.623554687 17.4701953,0.34375 17.125,0.34375 L0.875,0.34375 C0.529804687,0.34375 0.25,0.623554687 0.25,0.96875 L0.25,2.53125 C0.25,2.87644531 0.529804687,3.15625 0.875,3.15625 Z M0.875,9.40625 L17.125,9.40625 C17.4701953,9.40625 17.75,9.12644531 17.75,8.78125 L17.75,7.21875 C17.75,6.87355469 17.4701953,6.59375 17.125,6.59375 L0.875,6.59375 C0.529804687,6.59375 0.25,6.87355469 0.25,7.21875 L0.25,8.78125 C0.25,9.12644531 0.529804687,9.40625 0.875,9.40625 Z M0.875,15.65625 L17.125,15.65625 C17.4701953,15.65625 17.75,15.3764453 17.75,15.03125 L17.75,13.46875 C17.75,13.1235547 17.4701953,12.84375 17.125,12.84375 L0.875,12.84375 C0.529804687,12.84375 0.25,13.1235547 0.25,13.46875 L0.25,15.03125 C0.25,15.3764453 0.529804687,15.65625 0.875,15.65625 Z"
                    id="path-1"
                ></path>
            </defs>
            <g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
                <g transform="translate(-71.000000, -32.000000)">
                    <g>
                        <g transform="translate(20.000000, 23.000000)">
                            <g transform="translate(51.000000, 9.000000)">
                                <mask id="mask-2" fill="white">
                                    <use xlink:href="#path-1"></use>
                                </mask>
                                <use fill="#000000" fill-rule="nonzero" xlink:href="#path-1"></use>
                                <g mask="url(#mask-2)" fill="#FFFFFF">
                                    <g transform="translate(-1.000000, -2.000000)" id="Purple">
                                        <rect x="0" y="0" width="20" height="20"></rect>
                                    </g>
                                </g>
                            </g>
                        </g>
                    </g>
                </g>
            </g>
        </svg>
        <svg
            v-else
            width="15px"
            height="15px"
            viewBox="0 0 15 15"
            version="1.1"
            xmlns="http://www.w3.org/2000/svg"
            xmlns:xlink="http://www.w3.org/1999/xlink"
        >
            <g id="Sign-Up-/-Sign-In" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
                <g
                    id="Desktop-Nav---Side-Nav-Sub-Menu-Open"
                    transform="translate(-83.000000, -34.000000)"
                    fill-rule="nonzero"
                >
                    <g id="Top-Nav">
                        <g id="Left-Nav-Items" transform="translate(11.000000, 10.000000)">
                            <g id="icon-close-sharp" transform="translate(67.000000, 19.000000)">
                                <g id="Icon" transform="translate(5.031250, 5.031250)" fill="#FFFFFF">
                                    <polygon
                                        id="Icon-Path"
                                        points="14.375 1.67159288 12.7034071 0 7.1875 5.51590712 1.67159288 0 0 1.67159288 5.51590712 7.1875 0 12.7034071 1.67159288 14.375 7.1875 8.85909288 12.7034071 14.375 14.375 12.7034071 8.85909288 7.1875"
                                    ></polygon>
                                </g>
                                <rect id="ViewBox" x="0" y="0" width="23" height="23"></rect>
                            </g>
                        </g>
                    </g>
                </g>
            </g>
        </svg>
    </fragment>
</template>

<script>
export default {
    name: 'ToogleMenu',
    props: {
        isHidden: {
            type: Boolean,
            default: false,
        },
    },
}
</script>

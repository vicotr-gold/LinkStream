<template>
    <div class="sidenav" @click.stop="() => {}">
        <div class="main-menu">
            <ul class="list-unstyled">
                <li
                    v-for="item in menuItems"
                    :class="{
                        active:
                            (selectedParentMenu === item.id &&
                                viewingParentMenu === '') ||
                            viewingParentMenu === item.id,
                    }"
                    :key="`parent_${item.id}`"
                    :data-flag="item.id"
                >
                    <a
                        v-if="item.newWindow"
                        :href="item.to"
                        rel="noopener noreferrer"
                        target="_blank"
                    >
                        <font-awesome-icon :icon="item.icon" size="lg" />
                        {{ item.label }}
                    </a>
                    <a
                        v-else-if="item.subs && item.subs.length > 0"
                        @click.prevent="openSubMenu($event, item)"
                        :href="`#${item.to}`"
                    >
                        <font-awesome-icon :icon="item.icon" size="lg" />
                        {{ item.label }}
                    </a>
                    <router-link
                        v-else
                        @click.native="
                            changeSelectedParentHasNoSubmenu(item.id)
                        "
                        :to="item.to"
                    >
                        <font-awesome-icon :icon="item.icon" size="lg" />
                        {{ item.label }}
                    </router-link>
                </li>
            </ul>
        </div>

        <div class="sub-menu">
            <ul
                v-for="(item, itemIndex) in menuItems"
                :class="{
                    'list-unstyled': true,
                    'd-block':
                        (selectedParentMenu === item.id &&
                            viewingParentMenu === '') ||
                        viewingParentMenu === item.id,
                }"
                :data-parent="item.id"
                :key="`sub_${item.id}`"
            >
                <li
                    v-for="(sub, subIndex) in item.subs"
                    :class="{
                        active: $route.path.indexOf(sub.to) > -1,
                    }"
                    :key="`menu_${itemIndex}_${subIndex}`"
                >
                    <a
                        v-if="sub.newWindow"
                        :href="sub.to"
                        rel="noopener noreferrer"
                        target="_blank"
                    >
                        <span>{{ sub.label }}</span>
                    </a>
                    <router-link v-else :to="sub.to">
                        <span>{{ sub.label }}</span>
                    </router-link>
                </li>
            </ul>
        </div>
    </div>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex'
import { appConstants, appMenus } from '~/constants'

export default {
    name: 'SideNav',
    data() {
        return {
            selectedParentMenu: null,
            menuItems: appMenus,
            viewingParentMenu: null,
        }
    },
    mounted() {
        this.selectMenu()
        window.addEventListener('resize', this.handleWindowResize)
        document.addEventListener('click', this.handleDocumentClick)
        this.handleWindowResize()
    },
    beforeDestroy() {
        document.removeEventListener('click', this.handleDocumentClick)
        window.removeEventListener('resize', this.handleWindowResize)
    },

    methods: {
        ...mapMutations([
            'changeSideMenuStatus',
            'addMenuClassname',
            'changeSelectedMenuHasSubItems',
        ]),
        selectMenu() {
            const currentParentUrl = this.$route.path
                .split('/')
                .filter(x => x !== '')[1]
            if (currentParentUrl !== undefined && currentParentUrl !== null) {
                this.selectedParentMenu = currentParentUrl.toLowerCase()
            } else {
                this.selectedParentMenu = 'dashboard'
            }
            this.isCurrentMenuHasSubItem()
        },
        isCurrentMenuHasSubItem() {
            const menuItem = this.menuItems.find(
                x => x.id === this.selectedParentMenu
            )
            const isCurrentMenuHasSubItem =
                menuItem && menuItem.subs && menuItem.subs.length > 0
                    ? true
                    : false
            if (isCurrentMenuHasSubItem != this.selectedMenuHasSubItems) {
                if (!isCurrentMenuHasSubItem) {
                    this.changeSideMenuStatus({
                        step: 0,
                        classNames: this.menuType,
                        selectedMenuHasSubItems: false,
                    })
                } else {
                    this.changeSideMenuStatus({
                        step: 0,
                        classNames: this.menuType,
                        selectedMenuHasSubItems: true,
                    })
                }
            }

            return isCurrentMenuHasSubItem
        },

        changeSelectedParentHasNoSubmenu(parentMenu) {
            this.selectedParentMenu = parentMenu
            this.viewingParentMenu = parentMenu
            this.changeSelectedMenuHasSubItems(false)
            this.changeSideMenuStatus({
                step: 0,
                classNames: this.menuType,
                selectedMenuHasSubItems: false,
            })
        },

        openSubMenu(e, menuItem) {
            const selectedParent = menuItem.id
            const hasSubMenu = menuItem.subs && menuItem.subs.length > 0
            this.changeSelectedMenuHasSubItems(hasSubMenu)
            if (!hasSubMenu) {
                this.viewingParentMenu = selectedParent
                this.selectedParentMenu = selectedParent
                this.toggle()
            } else {
                const currentClasses = this.menuType
                    ? this.menuType.split(' ').filter(x => x !== '')
                    : ''

                if (!currentClasses.includes('menu-mobile')) {
                    if (
                        currentClasses.includes('menu-sub-hidden') &&
                        (this.menuClickCount === 2 || this.menuClickCount === 0)
                    ) {
                        this.changeSideMenuStatus({
                            step: 3,
                            classNames: this.menuType,
                            selectedMenuHasSubItems: hasSubMenu,
                        })
                    } else if (
                        currentClasses.includes('menu-hidden') &&
                        (this.menuClickCount === 1 || this.menuClickCount === 3)
                    ) {
                        this.changeSideMenuStatus({
                            step: 2,
                            classNames: this.menuType,
                            selectedMenuHasSubItems: hasSubMenu,
                        })
                    } else if (
                        currentClasses.includes('menu-default') &&
                        !currentClasses.includes('menu-sub-hidden') &&
                        (this.menuClickCount === 1 || this.menuClickCount === 3)
                    ) {
                        this.changeSideMenuStatus({
                            step: 0,
                            classNames: this.menuType,
                            selectedMenuHasSubItems: hasSubMenu,
                        })
                    }
                } else {
                    this.addMenuClassname({
                        classname: 'sub-show-temporary',
                        currentClasses: this.menuType,
                    })
                }
                this.viewingParentMenu = selectedParent
            }
        },
        handleDocumentClick(e) {
            this.viewingParentMenu = ''
            // this.selectMenu()
            this.toggle()
        },
        toggle() {
            const currentClasses = this.menuType
                .split(' ')
                .filter(x => x !== '')
            if (
                currentClasses.includes('menu-sub-hidden') &&
                this.menuClickCount === 3
            ) {
                this.changeSideMenuStatus({
                    step: 2,
                    classNames: this.menuType,
                    selectedMenuHasSubItems: this.selectedMenuHasSubItems,
                })
            } else if (
                currentClasses.includes('menu-hidden') ||
                currentClasses.includes('menu-mobile')
            ) {
                if (
                    !(
                        this.menuClickCount === 1 &&
                        !this.selectedMenuHasSubItems
                    )
                ) {
                    this.changeSideMenuStatus({
                        step: 0,
                        classNames: this.menuType,
                        selectedMenuHasSubItems: this.selectedMenuHasSubItems,
                    })
                }
            }
        },
        // Resize
        handleWindowResize(event) {
            if (event && !event.isTrusted) {
                return
            }
            let nextClasses = this.getMenuClassesForResize(this.menuType)
            this.changeSideMenuStatus({
                step: 0,
                classNames: nextClasses.join(' '),
                selectedMenuHasSubItems: this.selectedMenuHasSubItems,
            })
        },
        getMenuClassesForResize(classes) {
            let nextClasses = classes.split(' ').filter(x => x !== '')
            const windowWidth = window.innerWidth

            if (windowWidth < appConstants.user.account.menuHiddenBreakpoint) {
                nextClasses.push('menu-mobile')
            } else {
                nextClasses = nextClasses.filter(x => x !== 'menu-mobile')
                if (
                    nextClasses.includes('menu-default') &&
                    nextClasses.includes('menu-sub-hidden')
                ) {
                    nextClasses = nextClasses.filter(
                        x => x !== 'menu-sub-hidden'
                    )
                }
                if (
                    nextClasses.includes('menu-default') &&
                    !nextClasses.includes('menu-sub-hidden')
                ) {
                    nextClasses.push('menu-sub-hidden')
                }
            }
            return nextClasses
        },
    },
    computed: {
        ...mapGetters({
            menuType: 'getMenuType',
            menuClickCount: 'getMenuClickCount',
            selectedMenuHasSubItems: 'getSelectedMenuHasSubItems',
        }),
    },
    watch: {
        $route(to, from) {
            if (to.path !== from.path) {
                const toParentUrl = to.path.split('/').filter(x => x !== '')[1]
                if (toParentUrl !== undefined && toParentUrl !== null) {
                    this.selectedParentMenu = toParentUrl.toLowerCase()
                } else {
                    this.selectedParentMenu = 'dashboard'
                }
                this.selectMenu()
                this.toggle()
                this.changeSideMenuStatus({
                    step: 0,
                    classNames: this.menuType,
                    selectedMenuHasSubItems: this.selectedMenuHasSubItems,
                })

                window.scrollTo(0, top)
            }
        },
    },
}
</script>

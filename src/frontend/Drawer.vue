<template>
  <aside class="mdc-drawer">
    <div class="mdc-drawer__header">
      <h3 class="mdc-drawer__title">Mail</h3>
      <h6 class="mdc-drawer__subtitle">email@material.io</h6>
    </div>
    <div class="mdc-drawer__content">
      <nav class="mdc-list">
        <router-link class="mdc-list-item mdc-list-item--activated" to="/1" aria-selected="true">
          <i class="material-icons mdc-list-item__graphic" aria-hidden="true">inbox</i>
          <span class="mdc-list-item__text">Inbox</span>
        </router-link>
        <router-link class="mdc-list-item" to="/2">
          <i class="material-icons mdc-list-item__graphic" aria-hidden="true">send</i>
          <span class="mdc-list-item__text">Outgoing</span>
        </router-link>
        <router-link class="mdc-list-item" to="/3">
          <i class="material-icons mdc-list-item__graphic" aria-hidden="true">drafts</i>
          <span class="mdc-list-item__text">Drafts</span>
        </router-link>
      </nav>
    </div>
  </aside>
</template>

<script>
import {MDCDrawer} from "@material/drawer";

export default {
  name: 'drawer',
  data() {
    return {}
  },
  methods: {
    toggle() {
      const el = new MDCDrawer(this.$el)
      el.open = !el.open
    },
  },
  mounted() {
    const element = this.$el;
    const mobileClass = "mdc-drawer--modal";
    const desktopClass = "mdc-drawer--dismissible";

    let drawer;

    // Criterium for switching to mobile
    const isMobile = window.matchMedia(`(max-width: 720px)`);

    // Prepare scrim/overlay element
    const mobileOverlay = document.createElement("div");
    mobileOverlay.classList.add("mdc-drawer-scrim");

    // Switch between mobile and desktop
    function toggleMobile(event) {
      const isMobile = event.matches;

      if (isMobile) {
        element.classList.add(mobileClass);
        element.classList.remove(desktopClass);

        // Insert scrim/overlay element right after drawer
        element.insertAdjacentElement("afterend", mobileOverlay);
      } else {
        element.classList.add(desktopClass);
        element.classList.remove(mobileClass);

        // Remove scrim/overlay element
        mobileOverlay.remove();
      }

      drawer = MDCDrawer.attachTo(element);
      drawer.open = !isMobile;
    }

    // Toggle when media query matches / stops matching
    isMobile.addListener(toggleMobile);

    // Toggle initially
    toggleMobile(isMobile);

    this.$root.$on('nav', () => this.toggle())
  },
}
</script>

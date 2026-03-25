import type { DirectiveBinding } from 'vue'

interface ClickOutsideElement extends HTMLElement {
  __clickOutsideHandler__: (event: Event) => void
}

export const clickOutside = {
  mounted(el: ClickOutsideElement, binding: DirectiveBinding) {
    el.__clickOutsideHandler__ = (event: Event) => {
      if (!(el === event.target || el.contains(event.target as Node))) {
        binding.value(event)
      }
    }
    document.addEventListener('click', el.__clickOutsideHandler__, true)
  },
  unmounted(el: ClickOutsideElement) {
    document.removeEventListener('click', el.__clickOutsideHandler__, true)
  }
}

export default clickOutside

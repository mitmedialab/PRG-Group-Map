<script lang="ts">
	import '../app.postcss';
	import { Navbar, NavBrand, NavLi, NavUl, NavHamburger } from 'flowbite-svelte';

</script>

<Navbar let:hidden let:toggle >
  <NavBrand href="/">
    <img
      src="https://pbs.twimg.com/profile_images/1069038192391802882/UaJBMVXx_400x400.jpg"
      class="mr-3 h-6 sm:h-9"
      alt="PRG Logo"
    />
    <span class="self-center whitespace-nowrap text-xl font-semibold dark:text-white">
      Personal Robotics Group
    </span>
  </NavBrand>
  <NavHamburger on:click={toggle} />
  <NavUl {hidden}>
    <NavLi href="/" active={true}>Interactive Map</NavLi>
    <NavLi>Projects</NavLi>
    <NavLi>People</NavLi>
  </NavUl>
</Navbar>
<slot />





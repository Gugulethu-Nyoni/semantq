/*
Here's how slots work in Svelte ¹ ² ³ ⁴ ⁵:

    A slot is a placeholder in a child component where you can insert content from a parent component.
    Slots are created in child components with the self-closing <slot> tag.
    Slots can have default content which can be overridden by content from a parent component.
    Slots can be named so that you can have multiple slots in a single component.
    Slots can also have props, which are values passed to the slot from the child component.
    You can conditionally render content based on whether a slot is overridden by a parent component.



    
Child Component:
*/
1. Default Slot

<!-- Child.svelte -->
<div>
  <slot>Hello, World!</slot>
</div>


<!-- Parent.svelte -->
<Child>
  Hello, Universe!
</Child>


<!-- Final Result -->
<div>
  <div>Hello, Universe!</div>
</div>


2. Named Slot


<!-- Child.svelte -->
<div>
  <slot name="header">Default Header</slot>
  <slot name="footer">Default Footer</slot>
</div>


<!-- Parent.svelte -->
<Child>
  <span slot="header">Custom Header</span>
  <span slot="footer">Custom Footer</span>
</Child>


<!-- Final Result -->
<div>
  <div>Custom Header</div>
  <div>Custom Footer</div>
</div>


3. Slot with Props


<!-- Child.svelte -->
<div>
  <slot {name}>Hello, {name}!</slot>
</div>

<script>
  export let name = 'World';
</script>


<!-- Parent.svelte -->
<Child name="Universe" />


<!-- Final Result -->
<div>
  <div>Hello, Universe!</div>
</div>



4. Conditional Slot

<!-- Child.svelte -->
<div>
  {#if hasSlot}
  <slot />
  {:else}
  <p>No slot provided</p>
  {/if}
</div>

<script>
  export let hasSlot = false;
</script>


<!-- Parent.svelte -->
<Child>
  <span>Slot content</span>
</Child>


<!-- Final Result -->
<div>
  <div>Slot content</div>
</div>

Note: The hasSlot variable is set to true when a slot is provided by the parent component.



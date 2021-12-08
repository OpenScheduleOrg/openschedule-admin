<template>
  <div class="cc-form">
    <slot></slot>
  </div>
</template>

<script>
import { defineComponent } from "vue";

export default defineComponent({
  name: "Form",
});
</script>

<style>
.cc-form {
  display: flex;
  width: 100%;
  height: 100%;
  flex-wrap: wrap;
  padding: 2px;
  font-size: 1rem;
}

.cc-form-group {
  display: flex;
  flex-direction: column;
  flex: 1 1 100%;
  width: 100%;
  padding: 0.5rem 1rem;
}

.cc-form-group .cc-input-field {
  position: relative;
  padding: 16px 8px 10px 8px;
  border-bottom: 1px solid black;
  border-radius: 4px 4px 0 0;
  font-size: 0.95em;
  background-color: bisque;
}

.cc-form-group .cc-input-field .cc-field-name {
  position: absolute;
  display: inline;
  left: 8px;
  top: 14px;
  transition: all 0.2s ease-out;
  color: rgba(27, 27, 27, 0.925);
  pointer-events: none;
  letter-spacing: normal;
}

.cc-form-group .cc-input-text:focus + .cc-field-name,
.cc-form-group .cc-input-text.input-not-empty + .cc-field-name {
  font-size: 0.65em;
  left: 6px;
  top: 0;
}

.cc-form-group .cc-input-field > * {
  width: 100%;
}
</style>

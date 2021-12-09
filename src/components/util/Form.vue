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
  padding: 0.1rem 0.1rem;
  --line-color: rgba(41, 41, 41, 0.438);
  --line-hover: rgb(0, 85, 197);
  --line-focus: rgb(0, 98, 226);
  --label-color: rgba(75, 75, 75, 0.75);
  --label-color-hover: rgba(2, 104, 238, 0.75);
  color: rgb(7, 120, 226);
}

.cc-form-group.cc-input-is-valid {
  --line-color: rgb(72, 255, 118);
  --line-hover: rgb(5, 151, 41);
  --line-focus: rgb(0, 158, 40);
  --label-color: rgba(0, 182, 45, 0.6);
}

.cc-form-group.cc-input-is-invalid {
  --line-color: rgb(240, 66, 66);
  --line-hover: rgb(143, 0, 0);
  --line-focus: rgb(161, 0, 22);
  --label-color: rgba(134, 1, 1, 0.6);
}

.cc-form-group .cc-input-readonly {
  color: rgb(100, 100, 100);
  opacity: 0.8;
}

.cc-form-group .cc-input-field {
  position: relative;
  padding: 8px 0 0 0;
  border-radius: 4px 4px 0 0;
  font-size: 0.95em;
}

.cc-form-group .cc-input-field::after,
.cc-form-group .cc-input-field::before {
  content: "";
  display: block;
  position: absolute;
  width: 100%;
  height: 1px;
  transform: scalex(0);
  background-color: rgba(0, 0, 0, 0);
  bottom: 0;
  transition: all 0.5s;
}

.cc-form-group .cc-input-field::before {
  background-color: var(--line-color);
  transform: scalex(1);
}

.cc-form-group .cc-input-field:not(.cc-input-readonly):hover::after {
  transform: scaleX(1);
  background-color: var(--line-hover);
}

.cc-form-group .cc-input-field:not(.cc-input-readonly):hover::before,
.cc-form-group .cc-input-field:not(.cc-input-readonly):focus-within::before {
  transform: scaleX(0);
}

.cc-form-group .cc-input-field:not(.cc-input-readonly):focus-within:after {
  transform: scaleY(1.5);
  background-color: var(--line-focus);
}

.cc-form-group .cc-input-field .cc-field-name {
  position: absolute;
  display: inline;
  left: 0px;
  top: 18px;
  transition: all 0.2s ease-out;
  color: var(--label-color);
  pointer-events: none;
  letter-spacing: normal;
}

.cc-form-group .cc-input-field:focus-within .cc-field-name,
.cc-form-group .cc-input-field.cc-input-not-empty .cc-field-name {
  color: var(--label-color-hover);
  font-size: 0.8em;
  left: 0;
  top: 0;
}

.cc-form-group
  .cc-input-field.cc-input-readonly.cc-input-not-empty
  .cc-field-name {
  color: var(--label-color);
  font-size: 0.8em;
  left: 0;
  top: 0;
}

.cc-form-group .cc-input-field > * {
  width: 100%;
  font-size: 1em;
}

.cc-advise {
  height: 0.8em;
  width: 100%;
  font-size: 0.72em;
  padding: 2px 49px;
  color: rgba(192, 0, 0, 0.836);
  transition: all 0.5s;
  opacity: 0.4;
}
.cc-input-is-invalid .cc-advise {
  transition: all 0.5s;
  opacity: 1;
  padding: 2px 2px;
}

.cc-advise *:first-child {
  font-size: 0.9em;
  margin-right: 2px;
}
</style>

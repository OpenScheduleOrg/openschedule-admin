<template>
  <div class="form">
    <slot></slot>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "Form",
});
</script>

<style>
.form {
  display: flex;
  width: 100%;
  height: 100%;
  flex-wrap: wrap;
  font-size: 0.8rem;
}

.form .form-dynamic-row {
  display: grid;
  align-items: center;
  width: 100%;
  grid-template-columns: 1fr;
  grid-gap: 1em;
}
.form .form-group-col-2 {
  grid-template-columns: repeat(2, 1fr);
}
.form .form-group-col-3 {
  grid-template-columns: repeat(3, 1fr);
}

.form-group {
  display: flex;
  flex-direction: column;
  flex: 1;
  --line-color: rgba(41, 41, 41, 0.438);
  --line-hover: rgb(0, 85, 197);
  --line-focus: rgb(0, 98, 226);
  --label-color: rgba(75, 75, 75, 0.75);
  --label-color-hover: rgba(2, 104, 238, 0.75);
  color: rgb(7, 120, 226);
  padding-bottom: .4rem;
}

.form-group.input-is-valid {
  --line-color: rgb(72, 255, 118);
  --line-hover: rgb(5, 151, 41);
  --line-focus: rgb(0, 158, 40);
  --label-color: rgba(0, 182, 45, 0.6);
}

.form-group.input-is-invalid {
  --line-color: rgb(240, 66, 66);
  --line-hover: rgb(143, 0, 0);
  --line-focus: rgb(161, 0, 22);
  --label-color: rgba(134, 1, 1, 0.6);
}

.form-group .field-container {
  display: flex;
  align-items: center;
  position: relative;
  width: 100%;
}

.form-group .field-icon {
  font-size: 1.2em !important;
  margin: 12px 8px 8px 8px;
  transition: all 0.3s;
}

.form-group .input-readonly {
  color: rgb(100, 100, 100);
  opacity: 0.8;
}

.form-group .input-field {
  position: relative;
  padding: 8px 0 0 0;
  border-radius: 4px 4px 0 0;
  font-size: 1em;
  width: 100%;
}

.form-group .input-field::after,
.form-group .input-field::before {
  content: "";
  display: block;
  position: absolute;
  width: 100%;
  height: 1px;
  transform: scalex(0);
  background-color: rgba(0, 0, 0, 0);
  bottom: 0;
  transition: all 0.3s;
}

.form-group .input-field::before {
  background-color: var(--line-color);
  transform: scalex(1);
}

.form-group .input-field:not(.input-readonly):hover::after {
  transform: scaleX(1);
  background-color: var(--line-hover);
}

/*
.form-group .input-field:not(.input-readonly):hover::before,
.form-group .input-field:not(.input-readonly):focus-within::before,
.form-group .input-field:not(.input-readonly).manual-focus::before {
  transform: scaleX(0);
}*/

.form-group .input-field:not(.input-readonly):focus-within:after,
.form-group .input-field:not(.input-readonly).manual-focus::after {
  transform: scaleY(1.5);
  background-color: var(--line-focus);
}

.form-group .input-field .field-name {
  position: absolute;
  display: inline;
  left: 0px;
  top: 18px;
  transition: all 0.2s ease-out;
  color: var(--label-color);
  pointer-events: none;
  letter-spacing: normal;
}

.form-group .input-field:focus-within .field-name,
.form-group .input-field.input-not-empty .field-name {
  font-size: 1.1em;
  left: 0;
  top: 0;
}
.form-group:not(.input-is-invalid)
  .input-field:focus-within
  .field-name,
.form-group:not(.input-is-invalid)
  .input-field.input-not-empty
  .field-name {
  color: var(--label-color-hover);
}

.form-group
  .input-field.input-readonly.input-not-empty
  .field-name {
  color: var(--label-color);
  font-size: 1.1em;
  left: 0;
  top: 0;
}

.form-group .input-field > * {
  width: 100%;
}

.advise {
  height: 0.8em;
  width: 100%;
  font-size: 0.72em;
  padding: 2px 49px;
  color: rgba(192, 0, 0, 0.836);
  transition: all 0.5s;
  opacity: 0.4;
}
.input-is-invalid .advise {
  transition: all 0.5s;
  opacity: 1;
  padding: 2px 2px;
}

.advise *:first-child {
  font-size: 0.9em;
  margin-right: 2px;
}

.not-editable {
  pointer-events: none;
}
</style>

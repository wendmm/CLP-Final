<template>
  <div>
    <div id="app">
      <input v-model="barcodeValue" /><br />
      <barcode :value="barcodeValue" :display-value="false">
        Show this if the rendering fails.
      </barcode>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      barcodeValue: "",
    };
  },
};
</script>
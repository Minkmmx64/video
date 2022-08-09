const process = require("process");
const FileName = process.argv.splice(2)[0];
const fs = require("fs");
const path = require("path");
const fn = FileName === undefined ? "EmptyScreen" : FileName;

const template = `<template>
  <div>${fn}</div>
</template>

<script lang="ts" setup>

</script>

<style lang="scss" scoped>

</style>
`
const pf = path.join(__dirname, 'src', 'components');

const fsw = fs.createWriteStream(`${pf}/${fn}.vue`);
fsw.write(template);

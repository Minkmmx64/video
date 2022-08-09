<template>
  <MSlider
    v-model="volumn1" 
    progressOutBgColor="transparent" 
    progressDisplay="vertical" 
    :progressRadioSize="11"
    :progressOutWidth="30" 
    progressBgColor="rgba(238,238,238,1)" 
    :progressWidth="200" 
    type="primary"
    :progressHeight="10" />
  <MSlider 
    v-model="volumn2"
    progressOutBgColor="transparent" 
    progressDisplay="vertical" 
    :progressRadioSize="11"
    :progressOutWidth="30" 
    progressBgColor="rgba(238,238,238,1)" 
    :progressWidth="200" type="danger"
    :progressHeight="10" />
  <MSlider 
    v-model="volumn3" 
    progressOutBgColor="transparent" 
    progressDisplay="vertical" 
    :progressRadioSize="11"
    :progressOutWidth="30" 
    progressBgColor="rgba(238,238,238,1)" 
    :progressWidth="200" type="warn"
    :progressHeight="10" />
  <MSlider 
    v-model="volumn4" 
    progressOutBgColor="transparent" 
    progressDisplay="vertical" 
    :progressRadioSize="11"
    :progressOutWidth="30" 
    progressBgColor="rgba(238,238,238,1)" 
    :progressWidth="200" 
    type="info"
    :progressHeight="10" />
  <MSlider 
    v-model="volumn5" 
    progressOutBgColor="transparent" 
    progressDisplay="vertical" 
    :progressRadioSize="30"
    :progressOutWidth="30" 
    progressBgColor="rgba(238,238,238,1)" 
    :progressWidth="200" 
    type="success"
    :progressHeight="20" />
  <MSlider 
    v-model="volumn6" 
    progressOutBgColor="transparent" 
    progressDisplay="vertical" 
    :progressRadioSize="11"
    :progressOutWidth="30" 
    progressBgColor="rgba(238,238,238,1)" 
    :progressWidth="200" 
    :progressStep="10"
    progressShowStep 
    type="success" 
    :progressHeight="10" />
  <MSlider 
    v-model="volumn7" 
    progressOutBgColor="transparent" 
    progressDisplay="vertical" 
    :progressRadioSize="11"
    :progressOutWidth="30" 
    progressBgColor="rgba(238,238,238,1)" 
    :progressWidth="200" 
    progressShowData 
    :progressStep="5" 
    :mark="marks"
    type="primary" 
    :progressHeight="5" />
  <MSlider 
    v-model="volumn8" 
    progressOutBgColor="transparent" 
    progressDisplay="horizontal" 
    :progressRadioSize="11"
    :progressOutWidth="30"
    progressBgColor="rgba(238,238,238,1)" 
    :progressWidth="200" 
    progressShowData 
    :progressStep="5"
    type="primary" 
    :progressHeight="5" /> 
  <MSlider 
    v-model="volumn9" 
    progressOutBgColor="transparent" 
    progressDisplay="horizontal" 
    :progressRadioSize="23"
    :progressOutWidth="30" 
    progressBgColor="rgba(238,238,238,1)" 
    :progressWidth="800" 
    progressShowData 
    type="danger" 
    :progressHeight="10" 
    :progressMinData="1" 
    :progressMaxData="3" 
    :progressComputed="computed" 
    :mark="marks" />
  当前值{{volumn9}}
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import MSlider from "./MSlider.vue";
const volumn1 = ref(0.1);
const volumn2 = ref(0.2);
const volumn3 = ref(0.3);
const volumn4 = ref(0.4);
const volumn5 = ref(0.5);
const volumn6 = ref(0.6);
const volumn7 = ref(0.7);
const volumn8 = ref(0.8);
const volumn9 = ref(2);
const computed = ( val : number) => val / 2;
const marks = ref<Mark>({
  0: '0°C',
  8: '8°C',
  37: '37°C',
  50: {
    style: {
      color: '#1989FA',
    },
    label: '50%',
  },
})
</script>
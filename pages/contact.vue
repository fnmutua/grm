<script setup>
definePageMeta({
  layout: "landing",

});
</script>

<template>
  <LandingContainer>
    <LandingSectionhead>
      <template v-slot:title>Contact</template>
      <template v-slot:desc>We   here to help.</template>
    </LandingSectionhead>

    <div class="grid md:grid-cols-2 gap-10 mx-auto max-w-4xl mt-16">
      <div>
        <h2 class="font-medium text-2xl text-gray-800">
          Contact us
        </h2>
        <p class="text-lg leading-relaxed text-slate-500 mt-3">
          Have something to say? We are here to help. Fill up the form or send
          email.
        </p>
        <div class="mt-5">
          <div class="flex items-center mt-2 space-x-2 text-gray-600">
            <Icon class="text-gray-400 w-4 h-4" name="uil:map-marker" />
            <span>DRiVE Project </span>
          </div>
        
          <div class="flex items-center mt-2 space-x-2 text-gray-600">
            <Icon class="text-gray-400 w-4 h-4" name="fe:building" />
            <span>Ministry of Agriculture</span>
          </div>
          <div class="flex items-center mt-2 space-x-2 text-gray-600">
            <Icon class="text-gray-400 w-4 h-4" name="uil:envelope" /><a
              href="mailto:jakobaichmayr@gmail.com"
              >drive@gmail.com</a
            >
          </div>

           <div class="flex items-center mt-2 space-x-2 text-gray-600">
            <Icon class="text-gray-400 w-4 h-4" name="uil:phone" /><a
              href="tel:+254 (721) 000 000"
              >+254 (721) 000 000</a
            >
          </div>  
        </div>
      </div>
      <div>
        <LandingContactform />
      </div>
    </div>
  </LandingContainer>
</template>

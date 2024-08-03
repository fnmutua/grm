 
<template>
    <NuxtLoadingIndicator />

  <LandingContainer>
    <LandingSectionhead >
      <template v-slot:title>Login</template>
      <template v-slot:desc>Enter your username and password.</template>
      

    </LandingSectionhead>
  
      <div>
        <LandingLogin />
      </div>
   </LandingContainer>
</template>

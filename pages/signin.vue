<script setup>
  const username = ref('')
  const phone = ref('')
  const password = ref('')

  const { signIn } = useAuth()
  async function signInWithCredentials() {
    // Probably you'll do some validation here before submitting to the backend
    // ...

    // This is the object that our backend expects for the `signIn` endpoint
    const credentials = {
      username: 'felix.mutua@gmail.com',
       password: password.value
    }

    try {
      // This sends a POST request to the `auth.provider.endpoints.signIn` endpoint with `credentials` as the body
      await signIn(credentials)
      alert('Successfully logged in!')
    } catch (error) {
      console.error(error)
    }
  }
</script>

<template>
  <div>
    <h1>Enter your credentials to continue</h1>
    <input v-model="username" type="email" />
    <input v-model="phone" type="tel" />
    <input v-model="password" type="password" />
    <UButton @click="signInWithCredentials()" />
  </div>
  
</template>

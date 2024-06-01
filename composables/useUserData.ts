 const useUserData = () => {
  const isLoggedIn = useState ('user', () => {})
  
  const setUserData = (user) => {
    isLoggedIn.value = user
  }
  return {
    isLoggedIn,
    setUserData
  }
}
export default useUserData
<template>
  <div class="home">
    <Header></Header>
    <Section></Section>
    <Footer></Footer>
  </div>
</template>

<script>
// @ is an alias to /src
import Header from "../components/Header";
import Section from "../components/Section";
import Footer from "../components/Footer";

export default {
  name: 'home',
  components: {
      Header,
      Section,
      Footer
  }
}
</script>
<style>
</style>

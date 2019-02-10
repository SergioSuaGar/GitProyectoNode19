<template>
    <div class="meteo">
        <Header></Header>
        <Meteo></Meteo>
        <Footer></Footer>
    </div>
</template>

<script>

    import Header from "../components/Header";
    import Meteo from "../components/Meteo";
    import Footer from "../components/Footer";


    export default {
        name: "meteo",
        components: {
            Header,
            Meteo,
            Footer
        }
    }
</script>

<style scoped>

</style>
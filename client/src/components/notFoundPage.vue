<template>
    <div class="container">
        <span class="text">
            <h1>Page Not Found</h1>
        </span>
        <div id="main">
            <span style="padding:10px">
                <p>You have been tricked into click on a link that can not be found. Please check the url or go to <router-link class="home" to="/dashboard">Home</router-link> and see if you can locate what you are looking for</p>
            </span>
            <span>
                <img src="@/assets/smile.png">
            </span>
        </div>
    </div>
</template>

<script>
export default {
    
}
</script>

<style scoped>
.container {
    top: 150px;
    color: white;
}
#main {
    display: flex;
    justify-content: center;
    flex-wrap: wrap;
    align-items: center;
}
#main img {
    width: 50%;
}
#main span {
    text-align: center;
}
a.home {
    color: tomato !important;
    font-size: 30px;
    font-weight: bold;
}
.text h1 {
    font-size: 60px;
    text-align: left;
    margin-bottom: 20px;
    margin-top: 0px;
    color: #ffffff;
    font-weight: 700;
    text-align: center;
}
#main p {
    font-weight: 600;
    font-size: 20px;
    text-align: left;
    color: #ffffff;
    line-height: 32px;
    padding-top: 10px;
}

/*---- responsive-design -----*/
@media(max-width:1336px){
    #main h1 {
        font-size: 66px;
    }
    #main p {
        font-size: 18px;
    }
}
@media(max-width:1280px){
    #main h1 {
        font-size: 62px;
    }
}
@media(max-width:1024px){
    #main h1 {
        font-size: 56px;
    }
}
@media(max-width:800px){
    .text {
        width: 70%;
        padding: 3em 0em 3em 0em;
    }
    #main h1 {
        font-size: 52px;
    }
    #main p {
        font-size: 16px;
    }
}
@media(max-width:736px){
	#main h1 {
        font-size: 48px;
    }
}
@media(max-width:667px){
	#main h1 {
        font-size: 43px;
    }
    .text {
        padding: 3em 0em 1em 0em;
    }
}
@media(max-width:640px){
    #main h1 {
        font-size: 40px;
    }
    #main p {
        line-height: 26px;
    }
}
@media(max-width:600px){
    #main h1 {
        font-size: 37px;
    }
}
@media(max-width:568px){
	#main p{
		font-size:16px;
	}
	#main h1 {
        font-size: 34px;
    }
}
@media(max-width:480px){
    #main h1 {
        font-size: 32px;
    }
    .text {
        padding: 3em 0em 0em 0em;
    }
}
</style>

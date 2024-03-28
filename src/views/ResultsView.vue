<template>
  <div class="results">
    <!-- navbar to choose codec -->
    <div class="results__navbar">
      <a @click="codecSelector" class="results__navbar--codec selected">Codec 1</a>
      <a v-if="codecs >= 2" @click="codecSelector" class="results__navbar--codec">Codec 2</a>
      <a v-if="codecs == 3" @click="codecSelector" class="results__navbar--codec">Codec 3</a>
    </div>
    <!-- info about the codec -->
    <div class="data_codec">
      <h1 class="data_codec__title">{{ results[codecSelected].codec }}</h1>
      <!-- Table with general info about a codec process -->
      <div class="data_codec__info">
        <GeneralTable :codecData="results[codecSelected]" class="data_codec__info--table"/>
        <div class="data_codec__info--size">
          <p class="data_codec__info--size__title">File size:</p>
          <p class="data_codec__info--size__number">{{ results[codecSelected].size }} MB</p>
        </div>
      </div>
      <!-- Charts with all the codecs quality metrics -->
      <div class="data_codec__charts">
        <MetricsCharts :codecData="results" class=""/>
      </div>
    </div>
  </div>
</template>


<script>
import useVideoStore from '../stores/videoStore.js'
import GeneralTable from '../components/GeneralTable.vue'
import MetricsCharts from '../components/MetricsCharts.vue'

export default {
  name: 'ResultsView',
  data() {
    return {
      results: useVideoStore().resultsList,
      codecs: 0,
      codecSelected: 0,
    }
  },
  components: {
    GeneralTable,
    MetricsCharts
  },
  created() {
    this.displayNavBar()
  },
  methods: {
    /**
    * Displays the navigation bar buttons.
    * Increments the 'codecs' count for each codec in the 'results' array.
    */
    displayNavBar() {
      this.results.forEach(codec => {
        this.codecs++
      })
    },
    /**
    * Handles the selection of a codec.
    * @param {Event} e - The event object representing the click event.
    */
    codecSelector(e) {
      // Link is disabled after being clicked
      if (e.target.classList.contains('selected')) {
        return;
      }
      for (let i = 0; i < e.target.parentNode.children.length; i++) {
        e.target.parentNode.children[i].classList.remove('selected');
      }
      e.target.classList.add('selected');
      for (let i = 0; i < e.target.parentNode.children.length; i++) {
        if (e.target.parentNode.children[i].classList.contains('selected')) {
          this.codecSelected = i
        }
      }
    },
  },
}
</script>


<style lang="scss">
  .results {
    min-height: calc(100vh - 80px);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-start;
    gap: 40px;
    margin: 50px;
    
    &__navbar {
      display: flex;
      flex-direction: row;
      gap: 20px;
      
      a {
        font-size: 1.1em;
        cursor: pointer;
        padding: 10px;
        border-radius: 5px;
        border: #000 1px solid;
      }
      a:hover {
        background-color: #f0f0f0;
      }
      a.selected {
        text-decoration: underline;
      }
    }
    
    .data_codec {
      display: flex;
      flex-direction: column;
      align-items: center;
      width: 75vw;
      height: fit-content;
      gap: 50px;
      padding: 50px;
      box-shadow: 0px 187px 75px rgba(0, 0, 0, 0.01), 0px 105px 63px rgba(0, 0, 0, 0.05), 0px 47px 47px rgba(0, 0, 0, 0.09), 0px 12px 26px rgba(0, 0, 0, 0.1), 0px 0px 0px rgba(0, 0, 0, 0.1);
      
      &__title {
        font-size: 1.7rem;
        font-weight: bolder;
      }
      
      &__info {
        width: 80%;
        display: flex;
        align-items: center;
        
        &--table {
          width: 65%;
        }
        
        &--size {
          width: 35%;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 40px;
          
          &__title {
            font-weight: bold;
            font-size: 1.2em;
          }
          
          &__number {
            font-weight: bold;
            font-size: 1.5em;
          }
        }
      }

      &__charts {
        width: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;        
      }
    }
  }

</style>

import { LightningElement,wire } from 'lwc';
import { publish, MessageContext } from 'lightning/messageService';
import MOVIE_CHANNEL from '@salesforce/messageChannel/movieChannel__c';
const DELAY = 3000
export default class MovieSearch extends LightningElement {

    selectedValue = ""
    selectedSearch = ""
    selectedPageNumber = 1
    loading = false
    delayTimeout
    searchResults = []
    selectedMovie

    @wire(MessageContext)
    messageContext;

    get typeOptions() {
        return [
            { label: 'Movie', value: 'movie' },
            { label: 'Series', value: 'series' },
            { label: 'Episode', value: 'episode' },
            { label: 'All', value: '' },
        ];
    }

    handleChange(event) {
        this.loading = true
        let {name,value} = event.target
        if(name ==='type'){
            this.selectedValue = value
        }else if(name === 'search'){
            this.selectedSearch = value
        }else if(name === 'pageNumber'){
            this.selectedPageNumber = value
        }
        if(this.delayTimeout){
            clearTimeout(this.delayTimeout)
        }
         
        this.delayTimeout = setTimeout(() => {
            this.searchMovie();
        }, DELAY);
    }

    async searchMovie(){
        const url=`https://www.omdbapi.com?s=${this.selectedSearch}&type=${this.selectedValue}&page=${this.selectedPageNumber}&apikey=3b531ffb`
        const response = await fetch(url)
        const data = await response.json()
        console.log('Movie search data:',data)
        this.loading = false
        if(data.Response === 'True'){
            this.searchResults = data.Search
        }   
    }
    get displaySearchResult(){
        return this.searchResults.length > 0
    }
    movieSelectedHandler(event){
        this.selectedMovie = event.detail
        const payload = { movieId: this.selectedMovie };        
        publish(this.messageContext, MOVIE_CHANNEL, payload);
    }
}
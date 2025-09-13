import { LightningElement,api } from 'lwc';

export default class MovieTile extends LightningElement {
    @api movie
    @api selectedMovieId

    clickHandler(event){
        
        this.dispatchEvent(new CustomEvent('selectedmovie', {
            detail: this.movie.imdbID
        }))
    }

    get tileSelected(){        
        return this.selectedMovieId === this.movie.imdbID ? 'tile selected':'tile'
    }
}
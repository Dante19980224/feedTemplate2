import React, { Component } from "react";
import axios from "axios";
import debounce from "lodash.debounce";
import "./feed.css";

class Feed extends Component {
  constructor(props) {
    super(props);

    this.state = {
      postList: [],       // list containing all the posts in Feed
      postnum: 0,       // index used to iterate db
      maxNum: 0,      // size of db
      postLimit: 45,     // there is a limit to how many posts can exist in a Feed. (FB and YT both have limits)
      error: false,     // error flag
      errorMsg: undefined,      // error message
      hasMore: true,      // if there are more posts to load
      isLoading: false      // if there is a fetching process taking place
    }

    window.onscroll = debounce(() => {      // debounce puts a delay between each invocation of event
      if(this.state.error || this.state.isLoading || !(this.state.hasMore)){
        return;     // will not trigger onscroll event if any of the 3 conditions meet
      }
      // innerHeight: Height of browser window(height of the portion of html you can see)
      // scollTop: 0 when at top of page. Increases as user scrolls down. Decreases as user scrolls up.
      // offsetHeight: The actual height of the html(height of the entire html, including parts you cannot see)
      // if user scrolls pass 90% of the page, load more. Could change to other percentage, or subtract a constant.
      if (window.innerHeight + document.documentElement.scrollTop >= Math.floor(document.documentElement.offsetHeight*.9)) {
        this.fetch10();
      }
    }, 500)     // half a second delay between invoke
  }

  // onload
  componentDidMount(){
    this.setState({
      postnum: 1      // starting at 1 ONLY because pokeAPI starts at 1
    })
    this.getMax();
  }

  async getMax(){     // get number of items from api or db and set 'maxNum'
    const maxN = await axios.get("https://pokeapi.co/api/v2/pokemon");
    this.setState({
      maxNum: maxN.data.count
    }, this.fetch10)    // fetch initial data before any scrolling takes place
  }

  fetch10() {   // fetches 10 items from api and append to 'postList'
    this.setState({
      isLoading: true         // turn on loading flag
    }, async () => {
      let f10 = this.state.postList;
      let i = 0;
      let currpkm;
      for(i; i < 10; i++){
        if((i+this.state.postnum) > Math.min(this.state.maxNum, this.state.postLimit)){   // not going out of bounds
          break;
        }
        try {
          currpkm = await axios.get(`https://pokeapi.co/api/v2/pokemon/${i+this.state.postnum}`);
        } catch (e) {       // if error occurs
          this.setState({
            error: true,        // turn on error flag(set 'error' to true)
            errorMsg: e.name+": "+e.message,      //  record message(set 'errorMsg' to the error message)
            isLoading: false    // finished loading(set 'isLoading' to false)
          })
          console.log("fetch10 error: ", e);
          return;     // exit function
        }
        f10.push(currpkm.data);
      }
      this.setState({
        postList: f10,      // updated content list
        postnum: (this.state.postnum + i),    // updated current index
        hasMore: (this.state.postnum <Math.min(this.state.maxNum, this.state.postLimit)),     // true if current index is less than limit
        isLoading: false      // finished loading
      })
    })
  }

  
  render(){
    let body = null;
    body = (
      <div>
        <h2>Feed</h2>
        <div>
          <h4>Using POKEAPI /pokemon/:id starting from 1 </h4>
          <ul id="feedParent"></ul>
          {this.state.postList.map((item, index) => {
            return (
              <div className="Feed" key={index}>
                <img src={item.sprites.front_default} alt={"image of "+item.name} />
                <p>ID: {item.id}</p>
                <p>Name: <b>{item.name}</b></p>
                <p>Height: {item.height}</p>
                <p>Weight: {item.weight}</p>
              </div>)
            })
          }
          <br/>
          {this.state.error && <div className="ErrorMsg">{this.state.errorMsg}</div>}
          {this.state.isLoading && <div>Loading...</div>}
          {(!this.state.hasMore) && <div>No more items</div>}
          <br/>
          </div>
        </div>
      );
      return body;
  }
}

export default Feed;
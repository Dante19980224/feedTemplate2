import React, { Component } from "react";
import axios from "axios";
import debounce from "lodash.debounce";
import "./feed.css";

class Feed extends Component {
  constructor(props) {
    super(props);

    this.state = {
      postList: [],
      pokenum: 1,
      maxNum: 0,
      error: false,
      hasMore: true,
      isLoading: false
    }

    window.onscroll = debounce(() => {
      if(this.state.error || this.state.isLoading || !(this.state.hasMore)){
        return;
      }

      if (window.innerHeight + document.documentElement.scrollTop === document.documentElement.offsetHeight) {
        console.log("did fetch after scroll");
        this.fetch10();
      }
    }, 500)
  }

  // onload
  componentDidMount(){
    console.log("component did mount");
    this.getMax();
  }

  async getMax(){
    const maxN = await axios.get("https://pokeapi.co/api/v2/pokemon");
    this.setState({
      maxNum: maxN.data.count
    }, this.fetch10)
  }

  fetch10() {
    this.setState({
      isLoading: true
    }, async () => {
      let f10 = this.state.postList;
      console.log("f10 pre anything: ", f10);
      let i = this.state.pokenum;
      let currpkm;
      for(i; i <= 10; i++){
        if(i > this.state.maxNum){
          break;
        }
        try {
          currpkm = await axios.get(`https://pokeapi.co/api/v2/pokemon/${i}`);
        } catch (e) {
          this.setState({
            error: e
          })
          console.log("fetch10 error: ", e);
          break;
        }
        f10.push(currpkm.data);
      }
      // console.log("f10 is: ", f10);
      this.setState({
        postList: f10,
        pokenum: i,
        hasMore: (i<this.state.maxNum),
        isLoading: false
      })
      console.log("f10 post setState: ", f10);
    })
  }

  
  render(){
    let body = null;
    body = (
      <div>
        <h2>Feed</h2>
        <div>
          <h4>Using POKEAPI /pokemon/:id starting from 1 </h4>
          {this.state.postList.map((item, index) => {
          console.log(index);
          return (
            <div className="Feed" key={index}>
              <img src={item.sprites.front_default} alt={"image of "+item.name} />
              <p>ID: {item.id}</p>
              <p>Name: <b>{item.name}</b></p>
              <p>Height: {item.height}</p>
              <p>Weight: {item.weight}</p>
            </div>)
          })}
          <br/>
          {this.state.error && <div>Error: {this.state.error}</div>}
          {this.state.isLoading && <div>Loading...</div>}
          {!(this.state.hasMore) && <div>No more items.</div>}
          <br/>
          </div>
        </div>
      );
      return body;
  }
}

export default Feed;
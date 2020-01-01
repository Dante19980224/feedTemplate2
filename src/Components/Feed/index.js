import React, { useState, useEffect } from "react";
import axios from "axios";
import debounce from "lodash.debounce";
import "./feed.css";

async function getMax(){
  const maxNum = await axios.get("https://pokeapi.co/api/v2/pokemon");
  return maxNum.data.count;
}

const Feed = () => {
  const [postList, setPostList] = useState([]);
  const [pokenum, setPokenum] = useState(1);
  // const [error, setError] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  let handleScroll = debounce(() => {
    if(window.innerHeight + document.documentElement.scrollTop !== document.documentElement.offsetHeight){
      return;
    }
    if(isLoading || !hasMore){
      return;
    }
    
    console.log("handleScroll KICING IN!!!!!!!!!");
    setIsLoading(true);
    const maxNum = getMax();
    if(pokenum > maxNum){
      setHasMore(false);
      return;
    }

    async function fetch10(pnum, plist) {
      const maxNum = getMax();
      let f10 = plist;
      let i = pnum;
      let currpkm;
      // console.log("i in handleScroll starts with: ", i);
      // console.log("f10 in handleScroll starts with: ", f10);
      let lim = i + 10;
      for(i; i < lim; i++){
        if(i > maxNum){
          break;
        }
        try {
          currpkm = await axios.get(`https://pokeapi.co/api/v2/pokemon/${i}`);
        } catch (e) {
          console.log("fetch10 error: ", e);
          break;
        }
        f10.push(currpkm.data);
      }
      // console.log("f10 is: ", f10);
      setPokenum(i);
      setPostList(f10);
    }
    fetch10(pokenum, postList);
    
    // setError(true);
    
    setIsLoading(false);

  }, 100, [isLoading, hasMore, pokenum, postList]);

  useEffect(() => {
    console.log("1st useEffect taking place!!!");
    setIsLoading(true);
    const maxNum = getMax();
    if(pokenum > maxNum){
      setHasMore(false);
      return;
    }
    // console.log("postList WAS: ", postList);

    async function fetch10(pnum, plist) {
      const maxNum = getMax();
      let f10 = plist;
      let i = pnum;
      let currpkm;
      for(i; i <= 10; i++){
        if(i > maxNum){
          break;
        }
        try {
          currpkm = await axios.get(`https://pokeapi.co/api/v2/pokemon/${i}`);
        } catch (e) {
          console.log("fetch10 error: ", e);
          break;
        }
        f10.push(currpkm.data);
      }
      // console.log("f10 is: ", f10);
      setPokenum(i);
      setPostList(f10);
    }
    fetch10(pokenum, postList);
    // console.log("postList is NOW: ", postList);
    
    // setError(true);
    
    setIsLoading(false);
  }, [pokenum, postList]);

  useEffect(() => {
    console.log("2nd useEffect taking place!!!");
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  console.log("in the HOOOK");
  return (
    <div>
      <h2>Feed</h2>
      <div>
        {/* <h4>Pinned items</h4>
        <ol>
          {likeData.map((item, index) => (
            <li key={index}>
              <Link to={`/tiermaker/${item._id}`}>{item.title}</Link>
            </li>
          ))}
        </ol> */}
        <h4>Using POKEAPI /pokemon/:id starting from 1 </h4>
        {postList.map((item, index) => {
          console.log(index);
          return (<div className="Feed" key={index}>
            <img src={item.sprites.front_default} alt={"image of "+item.name} />
            <p>ID: {item.id}</p>
            <p>Name: <b>{item.name}</b></p>
            <p>Height: {item.height}</p>
            <p>Weight: {item.weight}</p>
          </div>)
        })}
        <br/>
        <b>
          {isLoading ? 'LOADING ...' : ''}
        </b>
        <br/>
      </div>
    </div>
  );
};

export default Feed;

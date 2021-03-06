import {getLoggedInUser, getPosts, usePostCollection, createPost, deletePost,updatePost,getSinglePost} from "./data/DataManager.js"
import {PostList} from "./feed/PostList.js"
import {NavBar} from "./nav/NavBar.js"
import {Footer} from "./nav/Footer.js"
import {PostEntry} from "./feed/PostEntry.js"
import {PostEdit} from "./feed/PostEdit.js"
/**
 * Main logic module for what should happen on initial page load for Giffygram
 */
// let postElement = document.querySelector(".postList");
// let navElement = document.querySelector("nav");
// let enrtyElement = document.querySelector(".entryForm")
const showPostList = () => {
	//Get a reference to the location on the DOM where the list will display
	const postElement = document.querySelector(".postList");
	getPosts().then((allPosts) => {
		postElement.innerHTML = PostList(allPosts);
	})
}
const showEdit = (postObj) => {
  const entryElement = document.querySelector(".entryForm");
  entryElement.innerHTML = PostEdit(postObj);
}
const showNavBar = () => {
    //Get a reference to the location on the DOM where the nav will display
    const navElement = document.querySelector("nav");
	navElement.innerHTML = NavBar();
}
const showFooter = () => {
    const footerElement = document.querySelector("footer");
    footerElement.innerHTML = Footer();
}
const showPostEntry = () => {
    const entryElement = document.querySelector(".entryForm");
    entryElement.innerHTML = PostEntry();
}

const applicationElement = document.querySelector(".giffygram");

const showFilteredPosts = (year) => {
    //get a copy of the post collection
    const epoch = Date.parse(`01/01/${year}`);
    //filter the data
    const filteredData = usePostCollection().filter(singlePost => {
      if (singlePost.timestamp >= epoch) {
        return singlePost
      }
    })
    const postElement = document.querySelector(".postList");
    postElement.innerHTML = PostList(filteredData);
  }

applicationElement.addEventListener("click", event => {
	if (event.target.id === "logout"){
		console.log("You clicked on logout")
	}
})

applicationElement.addEventListener("change", event => {
    if (event.target.id === "yearSelection") {
      const yearAsNumber = parseInt(event.target.value)
  
      console.log(`User wants to see posts since ${yearAsNumber}`)
    showFilteredPosts(yearAsNumber);
    }
  })

//   applicationElement.addEventListener("click", (event) => {
	
// 	if (event.target.id.startsWith("edit")){
// 		console.log("post clicked", event.target.id.split("--"))
// 		console.log("the id is", event.target.id.split("--")[1])
// 	}
// })
applicationElement.addEventListener("click", event => {
    if (event.target.id === "newPost__cancel") {
        //clear the input fields
    }
  })
  
  applicationElement.addEventListener("click", event => {
    event.preventDefault();
    if (event.target.id === "newPost__submit") {
    //collect the input values into an object to post to the DB
      const title = document.querySelector("input[name='postTitle']").value
      const url = document.querySelector("input[name='postURL']").value
      const description = document.querySelector("textarea[name='postDescription']").value
      //we have not created a user yet - for now, we will hard code `1`.
      //we can add the current time as well
      const postObject = {
          title: title,
          imageURL: url,
          description: description,
          userId: 1,
          timestamp: Date.now()
      }
  
    // be sure to import from the DataManager
        createPost(postObject)
    }
  })

  applicationElement.addEventListener("click", event => {
    event.preventDefault();
    if (event.target.id.startsWith("delete")) {
      const postId = event.target.id.split("__")[1];
      deletePost(postId)
        .then(response => {
          showPostList();
        })
    }
  })

  applicationElement.addEventListener("click", event => {
    event.preventDefault();
    if (event.target.id.startsWith("edit")) {
      const postId = event.target.id.split("__")[1];
      getSinglePost(postId)
        .then(response => {
          showEdit(response);
        })
    }
  })
  applicationElement.addEventListener("click", event => {
    event.preventDefault();
    if (event.target.id.startsWith("updatePost")) {
      const postId = event.target.id.split("__")[1];
      //collect all the details into an object
      const title = document.querySelector("input[name='postTitle']").value
      const url = document.querySelector("input[name='postURL']").value
      const description = document.querySelector("textarea[name='postDescription']").value
      const timestamp = document.querySelector("input[name='postTime']").value
      
      const postObject = {
        title: title,
        imageURL: url,
        description: description,
        userId: getLoggedInUser().id,
        timestamp: parseInt(timestamp),
        id: parseInt(postId)
      }
      showPostEntry();
      updatePost(postObject)
        .then(response => {
          showPostList();
        })
    }
  })
/*
    This function performs one, specific task.

    1. Can you explain what that task is?
    2. Are you defining the function here or invoking it?
*/ 
const startGiffyGram = () => {
    showNavBar();
    showPostEntry();
  showPostList();
  showFooter();
}
// Are you defining the function here or invoking it?
startGiffyGram();


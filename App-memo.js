import React, { memo, useCallback, useEffect, useMemo, useState } from "react";
import { faker } from "@faker-js/faker";
import { PostProvider, usePosts } from "./PostContext"; // Ensure the correct path for PostContext
import Test from "./Test";
// Helper function to create random posts
function createRandomPost() {
  return {
    title: `${faker.hacker.adjective()} ${faker.hacker.noun()}`,
    body: faker.hacker.phrase(),
  };
}

function App() {
  const [isFakeDark, setIsFakeDark] = useState(false);
  // const [searchQuery, setSearchQuery] = useState("");
  const [posts, setPosts] = useState(() =>
    Array.from({length: 30}, () => createRandomPost())
  );

  const handleAddPost = useCallback(function handleAddPost({post}){
    setPosts((post) => [post, ...posts]);
  }, [posts]);

  // function handleClearPosts(){
  //   setPosts([]);
  // }
  // Toggle fake-dark-mode class based on the state of `isFakeDark`
  useEffect(() => {
    document.documentElement.classList.toggle("fake-dark-mode", isFakeDark);
  }, [isFakeDark]);

  const archiveOptions = useMemo(() => {
    return{
      show: false,
      title: `Post archive in addition to ${posts.length} main posts`,
    }
    
  }, [posts.length]);
  return (
    <section>
      <button
        onClick={() => setIsFakeDark((prev) => !prev)}
        className="btn-fake-dark-mode"
      >
        {isFakeDark ? "☀️ Light Mode" : "🌙 Dark Mode"}
      </button>

      <PostProvider >
        <Header/>
        <Main />
        <Archive 
          archiveOptions={archiveOptions} 
          onAddPost={handleAddPost}
          setIsFakeDark={setIsFakeDark}/>
        <Footer />
      </PostProvider>
      
    </section>
  );
}

function Header() {
  const { onClearPosts } = usePosts();

  return (
    <header>
      <h1>
        <span>⚛️</span> The Atomic Blog
      </h1>
      <div>
        <Results />
        <SearchPosts />
        <button onClick={onClearPosts}>Clear posts</button>
      </div>
    </header>
  );
}

function SearchPosts() {
  const { searchQuery, setSearchQuery } = usePosts();
  return (
    <input
      value={searchQuery}
      onChange={(e) => setSearchQuery(e.target.value)}
      placeholder="Search posts..."
    />
  );
}

function Results() {
  const { posts } = usePosts();
  return <p>🚀 {posts.length} atomic posts found</p>;
}

function Main() {
  return (
    <main>
      <FormAddPost />
      <Posts />
    </main>
  );
}

function Posts() {
  return (
    <section>
      <List />
    </section>
  );
}

function FormAddPost() {
  const { onAddPost } = usePosts();
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title || !body) return;
    onAddPost({ title, body });
    setTitle("");
    setBody(""); // Reset the form fields after submission
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Post title"
      />
      <textarea
        value={body}
        onChange={(e) => setBody(e.target.value)}
        placeholder="Post body"
      />
      <button>Add post</button>
    </form>
  );
}

function List() {
  const { posts } = usePosts();
  return (
    <>
      <ul>
        {posts.map((post, i) => (
          <li key={i}>
            <h3>{post.title}</h3>
            <p>{post.body}</p>
          </li>
        ))}
      </ul>
      <Test />
    </>
  );
}

const Archive = memo (function Archive({archiveOptions, onAddPost}) {
  
  const [posts] = useState(() =>
    Array.from({ length: 3000 }, () => createRandomPost()) // Reduced length for performance
  );
  const [showArchive, setShowArchive] = useState(archiveOptions.show);

  return (
    <aside>
      <h2>{archiveOptions.title}</h2>
      <button onClick={() => setShowArchive((prev) => !prev)}>
        {showArchive ? "Hide archive posts" : "Show archive posts"}
      </button>

      {showArchive && (
        <ul>
          {posts.map((post, i) => (
            <li key={i}>
              <p>
                <strong>{post.title}:</strong> {post.body}
              </p>
              <button 
                onClick={() => 
                onAddPost(post)}>
                  Add as new post
              </button>
            </li>
          ))}
        </ul>
      )}
    </aside>
  );
})

function Footer() {
  return <footer>&copy; by The Atomic Blog ✌️</footer>;
}

export default App;

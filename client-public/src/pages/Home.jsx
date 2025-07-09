import PostList from "../components/PostList";

function Home() {
    return (
        <main className="p-6 max-w-3xl mx-auto">
            <h1 className="text-3xl font-bold mb-6">Latest Posts</h1>
            <PostList />
        </main>
    );
}

export default Home;